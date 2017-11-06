module.exports = {
  "globals": {
    "$": true,
    "google": true,
    "mapboxgl": true,
  },
  "rules": {
    "indent": [
      2,
      2
    ],
    "quotes": [
      2,
      "single"
    ],
    "linebreak-style": [
      2,
      "unix"
    ],
    "semi": [
      2,
      "never"
    ],
    "comma-dangle": [
      2,
      "always-multiline",
    ],
    "no-unused-vars": [
      1,
    ],
    "no-empty": [
      1,
    ],
    "no-console": [
      1,
    ],
    "padded-blocks": [
      2,
      "never",
    ],
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
  },
  "plugins": [
    "react"
  ]
};
