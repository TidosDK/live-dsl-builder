import {
  CommonTokenStream,
  CharStream,
  ParseTreeWalker,
  BaseErrorListener,
  Recognizer,
  Token,
  RecognitionException,
} from "antlr4ng";
import { bnfLexer } from "../antlr/bnfLexer";
import {
  bnfParser,
  Rule_Context,
  AlternativeContext,
} from "../antlr/bnfParser";
import type { bnfListener } from "../antlr/bnfListener";

class MetaErrorListener extends BaseErrorListener {
  public errors: any[] = [];

  syntaxError(
    recognizer: Recognizer<any>,
    offendingSymbol: Token | null,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | null,
  ): void {
    this.errors.push({
      line: line,
      column: column + 1,
      message: msg,
      length: offendingSymbol
        ? offendingSymbol.stop - offendingSymbol.start + 1
        : 1,
    });
  }
}

export function parseBnfToGrammarDef(bnfText: string) {
  const inputStream = CharStream.fromString(bnfText);
  const lexer = new bnfLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new bnfParser(tokenStream);

  const errorListener = new MetaErrorListener();

  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);

  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const tree = parser.rulelist();

  if (errorListener.errors.length > 0) {
    return {
      error: `Found ${errorListener.errors.length} syntax error(s).`,
      errors: errorListener.errors,
    };
  }

  const grammarDef = { tokens: [] as any[], rules: [] as any[] };

  class BridgeListener implements bnfListener {
    visitTerminal(): void {}
    visitErrorNode(): void {}
    enterEveryRule(): void {}
    exitEveryRule(): void {}

    processAlternatives(
      allAlternatives: AlternativeContext[],
      sequenceNames: any[],
    ) {
      allAlternatives.forEach((alt: any, altIndex: number) => {
        if (altIndex > 0) sequenceNames.push("|");

        alt.element().forEach((el: any) => {
          if (el.id_()) {
            sequenceNames.push(el.id_().RULE_ID().getText());
          } else if (el.text_()) {
            const rawWithQuotes = el.text_().STRING_LITERAL().getText();
            const content = rawWithQuotes.slice(1, -1);
            if (content.length === 0) return;

            let baseName = content.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();

            if (!baseName || baseName === "_") baseName = "SYMBOL";

            let tokenName = baseName;

            let counter = 1;
            let existingToken = grammarDef.tokens.find(
              (t) => t.name === tokenName,
            );

            while (existingToken && existingToken.pattern !== content) {
              tokenName = `${baseName}_${counter}`;
              counter++;
              existingToken = grammarDef.tokens.find(
                (t) => t.name === tokenName,
              );
            }

            if (!existingToken) {
              grammarDef.tokens.push({ name: tokenName, pattern: content });
            }
            sequenceNames.push(tokenName);
          } else if (el.zeroormore()) {
            const innerAlts = el.zeroormore().alternatives().alternative();
            const innerSequence: any[] = [];
            this.processAlternatives(innerAlts, innerSequence);
            sequenceNames.push({ type: "MANY", sequence: innerSequence });
          }
        });
      });
    }

    enterRule_(ctx: Rule_Context): void {
      const lhs = ctx.lhs();
      const rhs = ctx.rhs();
      if (!lhs || !rhs) return;

      const ruleName = lhs.id_()?.RULE_ID()?.getText();
      if (!ruleName) return;

      const alternativesCtx = rhs.alternatives();
      if (!alternativesCtx) return;

      const allAlternatives = alternativesCtx.alternative();
      const sequenceNames: any[] = [];

      this.processAlternatives(allAlternatives, sequenceNames);

      grammarDef.rules.push({ name: ruleName, sequence: sequenceNames });
    }
  }

  const listener = new BridgeListener();
  ParseTreeWalker.DEFAULT.walk(listener as any, tree);

  return { grammarDef };
}
