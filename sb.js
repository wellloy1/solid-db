import { errorMessage } from "./errorMessage.js";

class SchemaError extends Error {
    constructor(message) {
        super();
        this.message =
            message +
            "\n" +
            this.stack.split("\n")[2] +
            "\n" +
            this.stack.split("\n")[1];
        this.stack = "";
    }
}

export class SB {
    constructor(type) {
        this.result = { type };
        this.result.__proto__ = createProto(type, this.result);
    }

    static get string() {
        return new SB("string").result;
    }

    static get number() {
        return new SB("number").result;
    }
    static get boolean() {
        return new SB("boolean").result;
    }
    static get bigint() {
        return new SB("bigint").result;
    }
    static get object() {
        return new SB("object").result;
    }
    static get array() {
        return new SB("array").result;
    }
}

const createExtendedNumberProto = (result) => ({});

const createCommonProto = (result) => ({
    null() {
        if (Object.hasOwn(result, "_null")) {
            throw new SchemaError(errorMessage.for.null.when.alreadyAdded);
        }
        if (Object.hasOwn(result, "_default")) {
            throw new SchemaError(errorMessage.for.null.when.defaultAdded);
        }
        return Object.assign(result, { _null: true });
    },

    default(value = null) {
        if (Object.hasOwn(result, "_default")) {
            throw new SchemaError(errorMessage.for.default.when.alreadyAdded);
        }
        if (Object.hasOwn(result, "_null")) {
            throw new SchemaError(errorMessage.for.default.when.nullAdded);
        }
        if (result.type !== typeof value && value !== null) {
            throw new SchemaError(errorMessage.for.default.when.invalidValue);
        }
        return Object.assign(result, { _default: value });
    },

    fn(func) {
        if (func === undefined) {
            throw new SchemaError(errorMessage.for.fn.when.undefinedValue);
        }
        if (Object.hasOwn(result, "_fn")) {
            throw new SchemaError(errorMessage.for.fn.when.alreadyAdded);
        }
        if (typeof func !== "function") {
            throw new SchemaError(errorMessage.for.fn.when.invalidValue);
        }
        return Object.assign(result, { _fn: (v) => func(v) });
    },

    rule(func) {
        if (func === undefined) {
            throw new SchemaError(errorMessage.for.rule.when.undefinedValue);
        }
        if (Object.hasOwn(result, "_rule")) {
            throw new SchemaError(errorMessage.for.rule.when.alreadyAdded);
        }
        if (typeof func !== "function") {
            throw new SchemaError(errorMessage.for.rule.when.invalidValue);
        }
        return Object.assign(result, { _rule: (v) => func(v) });
    },
    regexp(exp) {
        if (exp === undefined) {
            throw new SchemaError(errorMessage.for.regexp.when.undefinedValue);
        }
        if (result.type !== "string") {
            throw new SchemaError(errorMessage.for.regexp.when.notApplicable);
        }
        if (Object.hasOwn(result, "_regexp")) {
            throw new SchemaError(errorMessage.for.regexp.when.alreadyAdded);
        }
        function isRegExpValid(exp) {
            try {
                new RegExp(exp);
            } catch (e) {
                throw new SchemaError(
                    errorMessage.for.regexp.when.invalidValue
                );
            }
        }
        isRegExpValid(exp);
        return Object.assign(result, { _regexp: exp });
    },
    toggle() {
        if (result.type !== "boolean") {
            throw new SchemaError(errorMessage.for.toggle.when.notApplicable);
        }
        if (Object.hasOwn(result, "_toggle")) {
            throw new SchemaError(errorMessage.for.toggle.when.alreadyAdded);
        }
        return Object.assign(result, { _toggle: true });
    },
    increment() {
        if (result.type !== "number" && result.type !== "bigint") {
            throw new SchemaError(
                errorMessage.for.increment.when.notApplicable
            );
        }
        if (Object.hasOwn(result, "_increment")) {
            throw new SchemaError(errorMessage.for.increment.when.alreadyAdded);
        }
        if (Object.hasOwn(result, "_decrement")) {
            throw new SchemaError(
                errorMessage.for.increment.when.decrementAdded
            );
        }
        return Object.assign(result, { _increment: true });
    },
    decrement() {
        if (result.type !== "number" && result.type !== "bigint") {
            throw new SchemaError(
                errorMessage.for.decrement.when.notApplicable
            );
        }
        if (Object.hasOwn(result, "_decrement")) {
            throw new SchemaError(errorMessage.for.decrement.when.alreadyAdded);
        }
        if (Object.hasOwn(result, "_increment")) {
            throw new SchemaError(
                errorMessage.for.decrement.when.incrementAdded
            );
        }
        return Object.assign(result, { _decrement: true });
    },
    props(obj) {
        if (result.type !== "object") {
            throw new SchemaError(errorMessage.for.props.when.notApplicable);
        }
        if (Object.hasOwn(result, "_props")) {
            throw new SchemaError(errorMessage.for.props.when.alreadyAdded);
        }
        if (obj === undefined) {
            throw new SchemaError(errorMessage.for.props.when.undefinedValue);
        }
        if (
            obj === null ||
            typeof obj !== "object" ||
            Object.keys(obj).length === 0
        ) {
            throw new SchemaError(errorMessage.for.props.when.invalidValue);
        }
        return Object.assign(result, { _props: obj });
    },

    items(item) {
        if (result.type !== "array") {
            throw new SchemaError(errorMessage.for.items.when.notApplicable);
        }
        if (Object.hasOwn(result, "_items")) {
            throw new SchemaError(errorMessage.for.items.when.alreadyAdded);
        }
        if (item === undefined) {
            throw new SchemaError(errorMessage.for.items.when.undefinedValue);
        }
        if (
            item === null ||
            typeof item !== "object" ||
            Object.keys(item).length === 0
        ) {
            throw new SchemaError(errorMessage.for.items.when.invalidValue);
        }
        return Object.assign(result, { _items: item });
    },
});

const createStringProto = (result) => ({
    ...createCommonProto(result),
});

const createNumberProto = (result) => ({
    ...createCommonProto(result),
});

const createBigintProto = (result) => ({
    ...createCommonProto(result),
});

const createBooleanProto = (result) => ({
    ...createCommonProto(result),
});

const createObjectProto = (result) => ({
    ...createCommonProto(result),
});

const createArrayProto = (result) => ({
    ...createCommonProto(result),
});

const protos = {
    string: createCommonProto,
    number: createCommonProto,
    bigint: createCommonProto,
    boolean: createCommonProto,
    object: createCommonProto,
    array: createCommonProto,
};

function createProto(type, result) {
    return protos[type](result);
}

// console.log(SB.string);
// console.log(SB.string.null());
// console.log(SB.string.regexp("/.^/"));
// console.log(SB.string.default().fn());

// console.log();

// console.log(SB.number);
// console.log(SB.number.null());
// console.log(SB.number.default().fn());
// console.log(SB.number.increment());
// console.log(SB.number.decrement());

// console.log();

// console.log(SB.boolean.toggle());
// console.log(SB.boolean.null());
// console.log(SB.boolean.default().fn());

// ![
//     "string",
//     "number",
//     "boolean",
//     "bigint",
//     "object",
//     "array",
// ].includes(obj.type)
