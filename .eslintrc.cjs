module.exports = {
	env: {
		es2022: true,
		node: true,
	},
	extends: [
		`eslint:recommended`,
		`plugin:@typescript-eslint/recommended`,
		`plugin:prettier/recommended`,
	],
	parser: `@typescript-eslint/parser`,
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: `module`,
	},
	plugins: [`@typescript-eslint`],
	rules: {
		'prettier/prettier': `error`,
		quotes: [`error`, `backtick`],
	},
}
