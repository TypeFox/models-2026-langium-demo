grammar ExampleDSL

entry Model: statements+=(Variable | Assignment | Struct)*;

Variable: (isInteger='int' | structType=[+Struct:ID]) name=ID ';';

Assignment: access=VariableAccess '=' value=Addition ';';
VariableAccess: variable=[Variable:ID] ('.' property=[+Property:ID])?;

Addition infers Expression:
	Multiplication ({infer BinaryExpr.left=current} operator=('+' | '-') right=Multiplication)*;

Multiplication infers Expression:
	Exponentiation ({infer BinaryExpr.left=current} operator=('*' | '/') right=Exponentiation)*;

Exponentiation infers Expression:
	Primary ({infer BinaryExpr.left=current} operator='^' right=Exponentiation)?;

Primary infers Expression: Parentheses | IntegerLiteral | VariableAccess;
Parentheses: '(' expr=Addition ')';
IntegerLiteral: value=INTEGER;

Struct: 'struct' name=ID '{' properties+=Property* '}';
Property: name=ID ';';

terminal INTEGER returns number: /[0-9]+(\.[0-9]+)?/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
