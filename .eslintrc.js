module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    // "extends": [
    //     "eslint:recommended",
    //     "plugin:react/recommended",
    //     "next",
    //     "prettier"
    // ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/no-unescaped-entities": "off",
        "@next/next/no-page-custom-font": "off"
    },
    "scripts": {
        "lint": "next lint"
    }

}
