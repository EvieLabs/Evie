module.exports = {
	root: true,
	parserOptions: {
		project: `${__dirname}/src/tsconfig.json`,
	},
	extends: ["marine/prettier/node", "plugin:@typescript-eslint/recommended"],
	rules: {
		"import/order": "off",
		"@typescript-eslint/explicit-member-accessibility": "off",
		"@typescript-eslint/no-throw-literal": "off",
		"@typescript-eslint/method-signature-style": "off",
		"@typescript-eslint/require-await": "off",
	},
};
