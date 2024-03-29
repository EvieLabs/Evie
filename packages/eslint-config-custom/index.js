module.exports = {
	extends: ["turbo", "prettier", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	rules: {
		"no-mixed-spaces-and-tabs": "off",
	},
};
