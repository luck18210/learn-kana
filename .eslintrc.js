module.exports = {
    "extends": ["eslint:recommended"],
    "rules": {
        "no-console": ["off"],
        "semi": ["error", "always"],
        "no-extra-parens": ["error", "all"],
        "valid-jsdoc": ["error"],
        "complexity": ["error", 10],
        "consistent-return": "error",
        "default-case": "error",
        "eqeqeq": "error",
        "no-use-before-define": "error",
        "max-depth": ["error", 5],
        "no-duplicate-imports": "error"
    },
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "modules": true,
        }
    }
}
