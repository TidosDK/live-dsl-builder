import { CommonTokenStream, CharStream, ParseTreeWalker } from "antlr4ng";
import { bnfLexer } from "../antlr/bnfLexer";
import {
  bnfParser,
  Rule_Context,
  AlternativeContext,
} from "../antlr/bnfParser";
import type { bnfListener } from "../antlr/bnfListener";

export function parseBnfToGrammarDef(bnfText: string) {
  const inputStream = CharStream.fromString(bnfText);
  const lexer = new bnfLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new bnfParser(tokenStream);

  const tree = parser.rulelist();

  // We can't really describe what the error is without spamming the user with errors for each charachter.
  if (parser.numberOfSyntaxErrors > 0) {
    return { error: "Syntax error in Window 1 grammar." };
  }

  const grammarDef = { tokens: [] as any[], rules: [] as any[] };

  class BridgeListener implements bnfListener {
    visitTerminal(): void {}
    visitErrorNode(): void {}
    enterEveryRule(): void {}
    exitEveryRule(): void {}

    // Magic!
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

            const safeName = content
              .replace(/[^a-zA-Z0-9]/g, "_")
              .toUpperCase();
            const hash = Array.from(content)
              .map((c) => c.charCodeAt(0).toString(16))
              .join("")
              .substring(0, 4);
            const tokenName = `T_${safeName}_${hash}`;

            if (!grammarDef.tokens.find((t) => t.pattern === content)) {
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

    // Used by the antlr auto-generated files.
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
