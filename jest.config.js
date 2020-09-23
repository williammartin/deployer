module.exports = {
    "roots": [
        "<rootDir>/src",
        "<rootDir>/tests"
    ],
    "testMatch": [
        "**/tests/**/*Spec.ts",
        "**/src/**/*Spec.ts"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
}