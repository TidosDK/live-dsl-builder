import { Lexer, CstParser, createToken, EOF } from "chevrotain";
import type { TokenType } from "chevrotain";

export interface GrammarDefinition {
  tokens: { name: string; pattern: string }[];
  rules: { name: string; sequence: string[] }[];
}

export function parseDynamicLanguage(
  grammarDefStr: string,
  sourceCode: string,
) {
  try {
    const grammarDef: GrammarDefinition = JSON.parse(grammarDefStr);
    const tokens: Record<string, TokenType> = {};

    // Custom implementation of ID as antlr doesn't support it (from what I can tell).
    const StringToken = createToken({
      name: "ID",
      pattern: /"[^"\\]*(?:\\.[^"\\]*)*"/,
    });
    tokens["ID"] = StringToken;

    const WhiteSpace = createToken({
      name: "WhiteSpace",
      pattern: /\s+/,
      group: Lexer.SKIPPED,
    });
    tokens["WhiteSpace"] = WhiteSpace;

    const sortedTDefs = [...grammarDef.tokens].sort(
      (a, b) => b.pattern.length - a.pattern.length,
    );

    sortedTDefs.forEach((tDef) => {
      tokens[tDef.name] = createToken({
        name: tDef.name,
        pattern: tDef.pattern,
      });
    });

    const tokenVocabulary = Object.values(tokens);
    const dynamicLexer = new Lexer(tokenVocabulary);

    // Magic!
    class DynamicParser extends CstParser {
      constructor() {
        super(tokenVocabulary, { nodeLocationTracking: "full" });

        const buildSequence = (sequence: any[], context: any) => {
          const hasOr = sequence.includes("|");

          if (hasOr) {
            const options: any[] = [];
            let currentOption: any[] = [];

            sequence.forEach((item) => {
              if (item === "|") {
                options.push(currentOption);
                currentOption = [];
              } else {
                currentOption.push(item);
              }
            });
            options.push(currentOption);

            context.OR(
              options.map((opt) => ({
                ALT: () => {
                  opt.forEach((item: any) => {
                    if (typeof item === "string") {
                      if (tokens[item]) {
                        context.CONSUME(tokens[item]);
                      } else if (context[item]) {
                        context.SUBRULE(context[item]);
                      } else {
                        throw new Error(
                          `Undefined rule or token referenced: <${item}>`,
                        );
                      }
                    } else if (
                      typeof item === "object" &&
                      item.type === "MANY"
                    ) {
                      context.MANY(() => {
                        buildSequence(item.sequence, context);
                      });
                    }
                  });
                },
              })),
            );
          } else {
            sequence.forEach((item: any) => {
              if (typeof item === "string") {
                if (tokens[item]) {
                  context.CONSUME(tokens[item]);
                } else if (context[item]) {
                  context.SUBRULE(context[item]);
                } else {
                  throw new Error(
                    `Undefined rule or token referenced: <${item}>`,
                  );
                }
              } else if (typeof item === "object" && item.type === "MANY") {
                context.MANY(() => {
                  buildSequence(item.sequence, context);
                });
              }
            });
          }
        };

        grammarDef.rules.forEach((rDef, index) => {
          (this as any)[rDef.name] = this.RULE(rDef.name, () => {
            buildSequence(rDef.sequence, this);

            if (index === 0) {
              this.CONSUME(EOF);
            }
          });
        });

        this.performSelfAnalysis();
      }
    }

    const lexResult = dynamicLexer.tokenize(sourceCode);
    const parser = new DynamicParser();
    parser.input = lexResult.tokens;

    const rootRuleName = grammarDef.rules[0]?.name;
    let cst = null;

    if (rootRuleName && (parser as any)[rootRuleName]) {
      cst = (parser as any)[rootRuleName]();
    }

    return {
      cst: cst,
      lexErrors: lexResult.errors,
      parseErrors: parser.errors,
      serializedGrammar: parser.getSerializedGastProductions(),
    };
  } catch (e: any) {
    return { error: e.message };
  }
}
