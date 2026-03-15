grammar bnf;

rulelist     : rule_+ EOF ;
rule_        : lhs ASSIGN rhs ;
lhs          : id_ ;
rhs          : alternatives ;
alternatives : alternative ('|' alternative)* ;
alternative  : element* ;

element
    : zeroormore
    | optional_
    | oneormore
    | text_
    | id_
    ;

zeroormore  : '{' alternatives '}' ;
optional_   : '[' alternatives ']' ;
oneormore   : '(' alternatives ')' ;

text_       : STRING_LITERAL ;
id_         : '<' RULE_ID '>' ;

ASSIGN         : '::=' ;
RULE_ID        : [a-zA-Z] [a-zA-Z0-9_-]* ;
STRING_LITERAL : '"' ~["]* '"' | '\'' ~[']* '\'' ;
WS             : [ \r\n\t]+ -> skip ;