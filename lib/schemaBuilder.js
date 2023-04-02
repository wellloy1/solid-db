import { errorMessage } from "./schemaErrorMessage.js";

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

export class SchemaBuilder {
    constructor(type, _props) {
        if (type !== "table") {
            this.result = { type };
            this.result.__proto__ = createProto(type, this.result);
        } else {
            this.result = { type, _props };
            this.result.__proto__ = createSchemaProto(this.result);
        }
    }

    static table(props) {
        return new SchemaBuilder("table", props).result;
    }

    static get string() {
        return new SchemaBuilder("string").result;
    }

    static get number() {
        return new SchemaBuilder("number").result;
    }
    static get boolean() {
        return new SchemaBuilder("boolean").result;
    }
    static get bigint() {
        return new SchemaBuilder("bigint").result;
    }
    static get object() {
        return new SchemaBuilder("object").result;
    }
    static get array() {
        return new SchemaBuilder("array").result;
    }
}

const createSchemaProto = (result) => ({
    pk(keys) {
        if (result.type !== "table") {
            throw new SchemaError(errorMessage.for.pk.when.notApplicable);
        }
        if (Object.hasOwn(result, "_pk")) {
            throw new SchemaError(errorMessage.for.pk.when.alreadyAdded);
        }
        if (keys === undefined) {
            throw new SchemaError(errorMessage.for.pk.when.undefinedValue);
        }
        if (typeof keys !== "string" && keys.constructor.name !== "Array") {
            throw new SchemaError(errorMessage.for.pk.when.invalidValue);
        }
        const propsKeys = Object.keys(result._props);

        let keysArr = keys;

        if (typeof keys === "string") {
            keysArr = keys.split(" ");
        }

        keysArr = keysArr.map((key) => key.trim()).filter((key) => !!key);

        for (const key of keysArr) {
            if (!propsKeys.includes(key)) {
                throw new SchemaError(errorMessage.for.pk.when.invalidKey(key));
            }
        }

        return Object.assign(result, { _pk: keysArr });
    },
    extra() {
        if (result.type !== "table") {
            throw new SchemaError(errorMessage.for.extra.when.notApplicable);
        }
        if (Object.hasOwn(result, "_extra")) {
            throw new SchemaError(errorMessage.for.extra.when.alreadyAdded);
        }
        return Object.assign(result, { _extra: true });
    },
});

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

const protos = {
    schema: createSchemaProto,
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
