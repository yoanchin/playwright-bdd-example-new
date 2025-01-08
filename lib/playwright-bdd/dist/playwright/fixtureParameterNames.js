"use strict";
/**
 * Extracted from playwright.
 * https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/common/fixtures.ts#L226
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixtureParameterNames = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type */
/* eslint-disable max-statements, visual/complexity, max-len, max-depth */
const signatureSymbol = Symbol('signature');
function fixtureParameterNames(fn) {
    if (typeof fn !== 'function')
        return [];
    if (!fn[signatureSymbol])
        fn[signatureSymbol] = innerFixtureParameterNames(fn);
    return fn[signatureSymbol];
}
exports.fixtureParameterNames = fixtureParameterNames;
function innerFixtureParameterNames(fn) {
    const text = filterOutComments(fn.toString());
    const match = text.match(/(?:async)?(?:\s+function)?[^(]*\(([^)]*)/);
    if (!match)
        return [];
    const trimmedParams = match[1].trim();
    if (!trimmedParams)
        return [];
    const [firstParam] = splitByComma(trimmedParams);
    if (firstParam[0] !== '{' || firstParam[firstParam.length - 1] !== '}') {
        throw new Error('First argument must use the object destructuring pattern: ' +
            firstParam +
            ' ' +
            fn.toString());
    }
    const props = splitByComma(firstParam.substring(1, firstParam.length - 1)).map((prop) => {
        const colon = prop.indexOf(':');
        return colon === -1 ? prop.trim() : prop.substring(0, colon).trim();
    });
    const restProperty = props.find((prop) => prop.startsWith('...'));
    if (restProperty) {
        throw new Error(`Rest property "${restProperty}" is not supported. List all used fixtures explicitly, separated by comma. ${fn.toString()}`);
    }
    return props;
}
function filterOutComments(s) {
    const result = [];
    let commentState = 'none';
    for (let i = 0; i < s.length; ++i) {
        if (commentState === 'singleline') {
            if (s[i] === '\n')
                commentState = 'none';
        }
        else if (commentState === 'multiline') {
            if (s[i - 1] === '*' && s[i] === '/')
                commentState = 'none';
        }
        else if (commentState === 'none') {
            if (s[i] === '/' && s[i + 1] === '/') {
                commentState = 'singleline';
            }
            else if (s[i] === '/' && s[i + 1] === '*') {
                commentState = 'multiline';
                i += 2;
            }
            else {
                result.push(s[i]);
            }
        }
    }
    return result.join('');
}
function splitByComma(s) {
    const result = [];
    const stack = [];
    let start = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '{' || s[i] === '[') {
            stack.push(s[i] === '{' ? '}' : ']');
        }
        else if (s[i] === stack[stack.length - 1]) {
            stack.pop();
        }
        else if (!stack.length && s[i] === ',') {
            const token = s.substring(start, i).trim();
            if (token)
                result.push(token);
            start = i + 1;
        }
    }
    const lastToken = s.substring(start).trim();
    if (lastToken)
        result.push(lastToken);
    return result;
}
//# sourceMappingURL=fixtureParameterNames.js.map