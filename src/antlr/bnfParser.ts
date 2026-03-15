
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { bnfListener } from "./bnfListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class bnfParser extends antlr.Parser {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly T__8 = 9;
    public static readonly ASSIGN = 10;
    public static readonly RULE_ID = 11;
    public static readonly STRING_LITERAL = 12;
    public static readonly WS = 13;
    public static readonly RULE_rulelist = 0;
    public static readonly RULE_rule_ = 1;
    public static readonly RULE_lhs = 2;
    public static readonly RULE_rhs = 3;
    public static readonly RULE_alternatives = 4;
    public static readonly RULE_alternative = 5;
    public static readonly RULE_element = 6;
    public static readonly RULE_zeroormore = 7;
    public static readonly RULE_optional_ = 8;
    public static readonly RULE_oneormore = 9;
    public static readonly RULE_text_ = 10;
    public static readonly RULE_id_ = 11;

    public static readonly literalNames = [
        null, "'|'", "'{'", "'}'", "'['", "']'", "'('", "')'", "'<'", "'>'", 
        "'::='"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, "ASSIGN", 
        "RULE_ID", "STRING_LITERAL", "WS"
    ];
    public static readonly ruleNames = [
        "rulelist", "rule_", "lhs", "rhs", "alternatives", "alternative", 
        "element", "zeroormore", "optional_", "oneormore", "text_", "id_",
    ];

    public get grammarFileName(): string { return "bnf.g4"; }
    public get literalNames(): (string | null)[] { return bnfParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return bnfParser.symbolicNames; }
    public get ruleNames(): string[] { return bnfParser.ruleNames; }
    public get serializedATN(): number[] { return bnfParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, bnfParser._ATN, bnfParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public rulelist(): RulelistContext {
        let localContext = new RulelistContext(this.context, this.state);
        this.enterRule(localContext, 0, bnfParser.RULE_rulelist);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 25;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 24;
                this.rule_();
                }
                }
                this.state = 27;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 8);
            this.state = 29;
            this.match(bnfParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rule_(): Rule_Context {
        let localContext = new Rule_Context(this.context, this.state);
        this.enterRule(localContext, 2, bnfParser.RULE_rule_);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 31;
            this.lhs();
            this.state = 32;
            this.match(bnfParser.ASSIGN);
            this.state = 33;
            this.rhs();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lhs(): LhsContext {
        let localContext = new LhsContext(this.context, this.state);
        this.enterRule(localContext, 4, bnfParser.RULE_lhs);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 35;
            this.id_();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rhs(): RhsContext {
        let localContext = new RhsContext(this.context, this.state);
        this.enterRule(localContext, 6, bnfParser.RULE_rhs);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 37;
            this.alternatives();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public alternatives(): AlternativesContext {
        let localContext = new AlternativesContext(this.context, this.state);
        this.enterRule(localContext, 8, bnfParser.RULE_alternatives);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 39;
            this.alternative();
            this.state = 44;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 1) {
                {
                {
                this.state = 40;
                this.match(bnfParser.T__0);
                this.state = 41;
                this.alternative();
                }
                }
                this.state = 46;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public alternative(): AlternativeContext {
        let localContext = new AlternativeContext(this.context, this.state);
        this.enterRule(localContext, 10, bnfParser.RULE_alternative);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 50;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 47;
                    this.element();
                    }
                    }
                }
                this.state = 52;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public element(): ElementContext {
        let localContext = new ElementContext(this.context, this.state);
        this.enterRule(localContext, 12, bnfParser.RULE_element);
        try {
            this.state = 58;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case bnfParser.T__1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 53;
                this.zeroormore();
                }
                break;
            case bnfParser.T__3:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 54;
                this.optional_();
                }
                break;
            case bnfParser.T__5:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 55;
                this.oneormore();
                }
                break;
            case bnfParser.STRING_LITERAL:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 56;
                this.text_();
                }
                break;
            case bnfParser.T__7:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 57;
                this.id_();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public zeroormore(): ZeroormoreContext {
        let localContext = new ZeroormoreContext(this.context, this.state);
        this.enterRule(localContext, 14, bnfParser.RULE_zeroormore);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 60;
            this.match(bnfParser.T__1);
            this.state = 61;
            this.alternatives();
            this.state = 62;
            this.match(bnfParser.T__2);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public optional_(): Optional_Context {
        let localContext = new Optional_Context(this.context, this.state);
        this.enterRule(localContext, 16, bnfParser.RULE_optional_);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 64;
            this.match(bnfParser.T__3);
            this.state = 65;
            this.alternatives();
            this.state = 66;
            this.match(bnfParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public oneormore(): OneormoreContext {
        let localContext = new OneormoreContext(this.context, this.state);
        this.enterRule(localContext, 18, bnfParser.RULE_oneormore);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 68;
            this.match(bnfParser.T__5);
            this.state = 69;
            this.alternatives();
            this.state = 70;
            this.match(bnfParser.T__6);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public text_(): Text_Context {
        let localContext = new Text_Context(this.context, this.state);
        this.enterRule(localContext, 20, bnfParser.RULE_text_);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 72;
            this.match(bnfParser.STRING_LITERAL);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public id_(): Id_Context {
        let localContext = new Id_Context(this.context, this.state);
        this.enterRule(localContext, 22, bnfParser.RULE_id_);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 74;
            this.match(bnfParser.T__7);
            this.state = 75;
            this.match(bnfParser.RULE_ID);
            this.state = 76;
            this.match(bnfParser.T__8);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,13,79,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,1,0,4,0,26,8,0,11,
        0,12,0,27,1,0,1,0,1,1,1,1,1,1,1,1,1,2,1,2,1,3,1,3,1,4,1,4,1,4,5,
        4,43,8,4,10,4,12,4,46,9,4,1,5,5,5,49,8,5,10,5,12,5,52,9,5,1,6,1,
        6,1,6,1,6,1,6,3,6,59,8,6,1,7,1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,9,1,9,
        1,9,1,9,1,10,1,10,1,11,1,11,1,11,1,11,1,11,0,0,12,0,2,4,6,8,10,12,
        14,16,18,20,22,0,0,73,0,25,1,0,0,0,2,31,1,0,0,0,4,35,1,0,0,0,6,37,
        1,0,0,0,8,39,1,0,0,0,10,50,1,0,0,0,12,58,1,0,0,0,14,60,1,0,0,0,16,
        64,1,0,0,0,18,68,1,0,0,0,20,72,1,0,0,0,22,74,1,0,0,0,24,26,3,2,1,
        0,25,24,1,0,0,0,26,27,1,0,0,0,27,25,1,0,0,0,27,28,1,0,0,0,28,29,
        1,0,0,0,29,30,5,0,0,1,30,1,1,0,0,0,31,32,3,4,2,0,32,33,5,10,0,0,
        33,34,3,6,3,0,34,3,1,0,0,0,35,36,3,22,11,0,36,5,1,0,0,0,37,38,3,
        8,4,0,38,7,1,0,0,0,39,44,3,10,5,0,40,41,5,1,0,0,41,43,3,10,5,0,42,
        40,1,0,0,0,43,46,1,0,0,0,44,42,1,0,0,0,44,45,1,0,0,0,45,9,1,0,0,
        0,46,44,1,0,0,0,47,49,3,12,6,0,48,47,1,0,0,0,49,52,1,0,0,0,50,48,
        1,0,0,0,50,51,1,0,0,0,51,11,1,0,0,0,52,50,1,0,0,0,53,59,3,14,7,0,
        54,59,3,16,8,0,55,59,3,18,9,0,56,59,3,20,10,0,57,59,3,22,11,0,58,
        53,1,0,0,0,58,54,1,0,0,0,58,55,1,0,0,0,58,56,1,0,0,0,58,57,1,0,0,
        0,59,13,1,0,0,0,60,61,5,2,0,0,61,62,3,8,4,0,62,63,5,3,0,0,63,15,
        1,0,0,0,64,65,5,4,0,0,65,66,3,8,4,0,66,67,5,5,0,0,67,17,1,0,0,0,
        68,69,5,6,0,0,69,70,3,8,4,0,70,71,5,7,0,0,71,19,1,0,0,0,72,73,5,
        12,0,0,73,21,1,0,0,0,74,75,5,8,0,0,75,76,5,11,0,0,76,77,5,9,0,0,
        77,23,1,0,0,0,4,27,44,50,58
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!bnfParser.__ATN) {
            bnfParser.__ATN = new antlr.ATNDeserializer().deserialize(bnfParser._serializedATN);
        }

        return bnfParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(bnfParser.literalNames, bnfParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return bnfParser.vocabulary;
    }

    private static readonly decisionsToDFA = bnfParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class RulelistContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(bnfParser.EOF, 0)!;
    }
    public rule_(): Rule_Context[];
    public rule_(i: number): Rule_Context | null;
    public rule_(i?: number): Rule_Context[] | Rule_Context | null {
        if (i === undefined) {
            return this.getRuleContexts(Rule_Context);
        }

        return this.getRuleContext(i, Rule_Context);
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_rulelist;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterRulelist) {
             listener.enterRulelist(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitRulelist) {
             listener.exitRulelist(this);
        }
    }
}


export class Rule_Context extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public lhs(): LhsContext {
        return this.getRuleContext(0, LhsContext)!;
    }
    public ASSIGN(): antlr.TerminalNode {
        return this.getToken(bnfParser.ASSIGN, 0)!;
    }
    public rhs(): RhsContext {
        return this.getRuleContext(0, RhsContext)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_rule_;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterRule_) {
             listener.enterRule_(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitRule_) {
             listener.exitRule_(this);
        }
    }
}


export class LhsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public id_(): Id_Context {
        return this.getRuleContext(0, Id_Context)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_lhs;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterLhs) {
             listener.enterLhs(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitLhs) {
             listener.exitLhs(this);
        }
    }
}


export class RhsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public alternatives(): AlternativesContext {
        return this.getRuleContext(0, AlternativesContext)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_rhs;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterRhs) {
             listener.enterRhs(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitRhs) {
             listener.exitRhs(this);
        }
    }
}


export class AlternativesContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public alternative(): AlternativeContext[];
    public alternative(i: number): AlternativeContext | null;
    public alternative(i?: number): AlternativeContext[] | AlternativeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AlternativeContext);
        }

        return this.getRuleContext(i, AlternativeContext);
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_alternatives;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterAlternatives) {
             listener.enterAlternatives(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitAlternatives) {
             listener.exitAlternatives(this);
        }
    }
}


export class AlternativeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public element(): ElementContext[];
    public element(i: number): ElementContext | null;
    public element(i?: number): ElementContext[] | ElementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ElementContext);
        }

        return this.getRuleContext(i, ElementContext);
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_alternative;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterAlternative) {
             listener.enterAlternative(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitAlternative) {
             listener.exitAlternative(this);
        }
    }
}


export class ElementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public zeroormore(): ZeroormoreContext | null {
        return this.getRuleContext(0, ZeroormoreContext);
    }
    public optional_(): Optional_Context | null {
        return this.getRuleContext(0, Optional_Context);
    }
    public oneormore(): OneormoreContext | null {
        return this.getRuleContext(0, OneormoreContext);
    }
    public text_(): Text_Context | null {
        return this.getRuleContext(0, Text_Context);
    }
    public id_(): Id_Context | null {
        return this.getRuleContext(0, Id_Context);
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_element;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterElement) {
             listener.enterElement(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitElement) {
             listener.exitElement(this);
        }
    }
}


export class ZeroormoreContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public alternatives(): AlternativesContext {
        return this.getRuleContext(0, AlternativesContext)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_zeroormore;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterZeroormore) {
             listener.enterZeroormore(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitZeroormore) {
             listener.exitZeroormore(this);
        }
    }
}


export class Optional_Context extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public alternatives(): AlternativesContext {
        return this.getRuleContext(0, AlternativesContext)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_optional_;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterOptional_) {
             listener.enterOptional_(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitOptional_) {
             listener.exitOptional_(this);
        }
    }
}


export class OneormoreContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public alternatives(): AlternativesContext {
        return this.getRuleContext(0, AlternativesContext)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_oneormore;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterOneormore) {
             listener.enterOneormore(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitOneormore) {
             listener.exitOneormore(this);
        }
    }
}


export class Text_Context extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public STRING_LITERAL(): antlr.TerminalNode {
        return this.getToken(bnfParser.STRING_LITERAL, 0)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_text_;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterText_) {
             listener.enterText_(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitText_) {
             listener.exitText_(this);
        }
    }
}


export class Id_Context extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RULE_ID(): antlr.TerminalNode {
        return this.getToken(bnfParser.RULE_ID, 0)!;
    }
    public override get ruleIndex(): number {
        return bnfParser.RULE_id_;
    }
    public override enterRule(listener: bnfListener): void {
        if(listener.enterId_) {
             listener.enterId_(this);
        }
    }
    public override exitRule(listener: bnfListener): void {
        if(listener.exitId_) {
             listener.exitId_(this);
        }
    }
}
