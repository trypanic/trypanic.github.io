export const golangSyntax = {
	comment: [
		// multiline /* ... */
		{
			pattern: /\/\*[\s\S]*?\*\//,
			greedy: true,
		},
		// single line //...
		{
			pattern: /\/\/.*/,
			greedy: true,
		},
	],

	string: [
		// Raw string literal, backticks, multiline allowed
		{
			pattern: /`[^`]*`/,
			greedy: true,
			alias: "string",
		},
		// Interpreted string literal, double quotes, with escapes
		{
			pattern: /"(?:\\.|[^"\\])*"/,
			greedy: true,
			alias: "string",
		},
	],

	// Keywords: control flow, declaration, types, go 1.20 new-ish keywords etc
	keyword:
		/\b(?:break|default|func|interface|select|case|defer|go|map|struct|chan|else|goto|package|switch|const|fallthrough|if|range|type|continue|for|import|return|var|any|comparable|constraints)\b/,

	// Types: builtin types and user types (Capitalized)
	type: /\b(?:bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr)\b/,

	// Builtin functions - some common ones, can be extended
	function:
		/\b(?:append|cap|close|complex|copy|delete|imag|len|make|new|panic|print|println|real|recover)\b/,

	// Boolean literals
	boolean: /\b(?:true|false)\b/,

	// Nil literal
	nil: /\bnil\b/,

	// Numbers - int, float, imaginary (1i), hex, octal, binary
	number: [
		// imaginary numbers
		/\b0[xX][\da-fA-F]+i?\b/, // hex with i optional
		/\b0[oO]?[0-7]+i?\b/, // octal with i optional
		/\b0[bB][01]+i?\b/, // binary with i optional
		/\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?i?\b/, // decimal and floats with i optional
	],

	// Operators - granular style
	operator: [
		// assignment operator :=
		{
			pattern: /:=/,
			alias: "operator-assignment",
		},
		// channel operators: <- and -> (Go only has <-; -> is invalid but included per request)
		{
			pattern: /<-/,
			alias: "operator-channel-left",
		},
		{
			pattern: /->/,
			alias: "operator-channel-right",
		},
		// usual operators
		/[+\-*/%&|^!=<>]=?|&&|\|\||\.\.\./,
	],

	// Struct tags (backquoted strings after struct fields)
	tag: {
		pattern: /`[^`]*`/,
		greedy: true,
		alias: "attr-value",
	},

	// Interfaces - interface keyword handled in keywords, here highlight methods inside interface block
	"interface-method": {
		pattern: /(\binterface\b\s*{)[^}]+(?=})/,
		inside: {
			function: /\b\w+\b(?=\()/, // method names
			punctuation: /[{}(),]/,
			type: /\b\w+\b/,
		},
	},

	// Map and slice literals (map[key]value, []type)
	map: {
		pattern: /\bmap\s*\[[^\]]+\]\s*\w+/,
		inside: {
			keyword: /\bmap\b/,
			punctuation: /[\[\]]/,
			type: /\b\w+\b/,
		},
	},

	slice: {
		pattern: /\[\s*\]\s*\w+/,
		inside: {
			punctuation: /[\[\]]/,
			type: /\b\w+\b/,
		},
	},

	// Channel type - chan type
	channel: {
		pattern: /\bchan\s*(?:<-)?\s*\w+/,
		inside: {
			keyword: /\bchan\b/,
			operator: /<-?/,
			type: /\b\w+\b/,
		},
	},

	"chained-access": {
		pattern: /\b[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*){1,}/,
		inside: {
			// Match the first identifier
			namespace: /^[a-zA-Z_]\w*/,
			// Match all middle `.Name` parts as structure-name, excluding the last
			"structure-name": {
				pattern: /(?:\.[a-zA-Z_]\w*)(?=\.[a-zA-Z_]\w+$)/,
				alias: "class-name",
			},
			// Match the final `.Name` as property
			property: {
				pattern: /\.(?=[a-zA-Z_]\w*$)[a-zA-Z_]\w*/,
				alias: "property",
			},
			// Match all dots
			punctuation: /\./,
		},
	},
	// Identifiers - variable and function names (fallback)
	property: {
		pattern: /\.\w+(?=[({]?)/,
		alias: "property",
		greedy: true,
	},

	// Punctuation: braces, brackets, parentheses, commas, semicolons, dots, colons
	punctuation: /[{}[\];(),.:]/,

	identifier: /\b[a-zA-Z_]\w*\b/,
};
