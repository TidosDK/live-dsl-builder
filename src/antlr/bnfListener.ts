import type {
  ErrorNode,
  ParseTreeListener,
  ParserRuleContext,
  TerminalNode,
} from "antlr4ng";

import { RulelistContext } from "./bnfParser.js";
import { Rule_Context } from "./bnfParser.js";
import { LhsContext } from "./bnfParser.js";
import { RhsContext } from "./bnfParser.js";
import { AlternativesContext } from "./bnfParser.js";
import { AlternativeContext } from "./bnfParser.js";
import { ElementContext } from "./bnfParser.js";
import { ZeroormoreContext } from "./bnfParser.js";
import { Optional_Context } from "./bnfParser.js";
import { OneormoreContext } from "./bnfParser.js";
import { Text_Context } from "./bnfParser.js";
import { Id_Context } from "./bnfParser.js";

/**
 * This interface defines a complete listener for a parse tree produced by
 * `bnfParser`.
 */
export class bnfListener implements ParseTreeListener {
  /**
   * Enter a parse tree produced by `bnfParser.rulelist`.
   * @param ctx the parse tree
   */
  enterRulelist?: (ctx: RulelistContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.rulelist`.
   * @param ctx the parse tree
   */
  exitRulelist?: (ctx: RulelistContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.rule_`.
   * @param ctx the parse tree
   */
  enterRule_?: (ctx: Rule_Context) => void;
  /**
   * Exit a parse tree produced by `bnfParser.rule_`.
   * @param ctx the parse tree
   */
  exitRule_?: (ctx: Rule_Context) => void;
  /**
   * Enter a parse tree produced by `bnfParser.lhs`.
   * @param ctx the parse tree
   */
  enterLhs?: (ctx: LhsContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.lhs`.
   * @param ctx the parse tree
   */
  exitLhs?: (ctx: LhsContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.rhs`.
   * @param ctx the parse tree
   */
  enterRhs?: (ctx: RhsContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.rhs`.
   * @param ctx the parse tree
   */
  exitRhs?: (ctx: RhsContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.alternatives`.
   * @param ctx the parse tree
   */
  enterAlternatives?: (ctx: AlternativesContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.alternatives`.
   * @param ctx the parse tree
   */
  exitAlternatives?: (ctx: AlternativesContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.alternative`.
   * @param ctx the parse tree
   */
  enterAlternative?: (ctx: AlternativeContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.alternative`.
   * @param ctx the parse tree
   */
  exitAlternative?: (ctx: AlternativeContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.element`.
   * @param ctx the parse tree
   */
  enterElement?: (ctx: ElementContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.element`.
   * @param ctx the parse tree
   */
  exitElement?: (ctx: ElementContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.zeroormore`.
   * @param ctx the parse tree
   */
  enterZeroormore?: (ctx: ZeroormoreContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.zeroormore`.
   * @param ctx the parse tree
   */
  exitZeroormore?: (ctx: ZeroormoreContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.optional_`.
   * @param ctx the parse tree
   */
  enterOptional_?: (ctx: Optional_Context) => void;
  /**
   * Exit a parse tree produced by `bnfParser.optional_`.
   * @param ctx the parse tree
   */
  exitOptional_?: (ctx: Optional_Context) => void;
  /**
   * Enter a parse tree produced by `bnfParser.oneormore`.
   * @param ctx the parse tree
   */
  enterOneormore?: (ctx: OneormoreContext) => void;
  /**
   * Exit a parse tree produced by `bnfParser.oneormore`.
   * @param ctx the parse tree
   */
  exitOneormore?: (ctx: OneormoreContext) => void;
  /**
   * Enter a parse tree produced by `bnfParser.text_`.
   * @param ctx the parse tree
   */
  enterText_?: (ctx: Text_Context) => void;
  /**
   * Exit a parse tree produced by `bnfParser.text_`.
   * @param ctx the parse tree
   */
  exitText_?: (ctx: Text_Context) => void;
  /**
   * Enter a parse tree produced by `bnfParser.id_`.
   * @param ctx the parse tree
   */
  enterId_?: (ctx: Id_Context) => void;
  /**
   * Exit a parse tree produced by `bnfParser.id_`.
   * @param ctx the parse tree
   */
  exitId_?: (ctx: Id_Context) => void;

  visitTerminal(node: TerminalNode): void {}
  visitErrorNode(node: ErrorNode): void {}
  enterEveryRule(node: ParserRuleContext): void {}
  exitEveryRule(node: ParserRuleContext): void {}
}
