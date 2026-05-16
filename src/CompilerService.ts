import { parseBnfToGrammarDef } from "./parsers/metaParser";
import { parseDynamicLanguage } from "./parsers/dynamicParser";

export interface CompileResult {
  success: boolean;
  metaErrorString?: string;
  metaErrors?: any[];
  appLogicError?: string;
  appSyntaxErrors?: any[];
  grammarDef?: any;
  serializedGrammar?: any;
  cst?: any;
}

export function compileDSL(metaCode: string, appCode: string): CompileResult {
  const metaResult = parseBnfToGrammarDef(metaCode);

  if (metaResult.error || (metaResult.errors && metaResult.errors.length > 0)) {
    return {
      success: false,
      metaErrorString: metaResult.error || "Syntax errors found in Meta DSL.",
      metaErrors: metaResult.errors || [],
    };
  }

  const appResult = parseDynamicLanguage(
    JSON.stringify(metaResult.grammarDef),
    appCode,
  );

  if (appResult.error) {
    return {
      success: false,
      appLogicError: appResult.error,
      grammarDef: metaResult.grammarDef,
    };
  }

  const allAppErrors = [
    ...(appResult.lexErrors || []),
    ...(appResult.parseErrors || []),
  ];

  if (allAppErrors.length > 0) {
    return {
      success: false,
      appSyntaxErrors: allAppErrors,
      grammarDef: metaResult.grammarDef,
    };
  }

  return {
    success: true,
    grammarDef: metaResult.grammarDef,
    serializedGrammar: appResult.serializedGrammar,
    cst: appResult.cst,
  };
}
