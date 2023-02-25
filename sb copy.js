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

const createExtendedNumberProto = (result) => ({
    increment() {
        if (result.type !== "number" && result.type !== "bigint") {
            throw new SchemaError(
                `The 'increment' option is applicable for the 'number' or 'bigint' type.`
            );
        }
        if (Object.hasOwn(result, "_increment")) {
            throw new SchemaError(
                `You have been already added an 'increment' option.`
            );
        }
        if (Object.hasOwn(result, "_decrement")) {
            throw new SchemaError(
                `You have specified a 'decrement' option. You cannot use "increment" and "decrement" together.`
            );
        }
        return Object.assign(result, { _increment: true });
    },
    decrement() {
        if (result.type !== "number" && result.type !== "bigint") {
            throw new SchemaError(
                `The 'decrement' option is applicable for the 'number' or 'bigint' type.`
            );
        }
        if (Object.hasOwn(result, "_decrement")) {
            throw new SchemaError(
                `You have been already added an 'increment' option.`
            );
        }
        if (Object.hasOwn(result, "_increment")) {
            throw new SchemaError(
                `You have specified a 'decrement' option. You cannot use "increment" and "decrement" together.`
            );
        }
        return Object.assign(result, { _decrement: true });
    },
});

const createCommonProto = (result) => ({
    null() {
        if (Object.hasOwn(result, "_null")) {
            throw new SchemaError(
                `You have been already added a 'null' option`
            );
        }
        if (Object.hasOwn(result, "_default")) {
            throw new SchemaError(
                `You have specified a 'default' option. You don't need to use "default" and "null" together.`
            );
        }
        return Object.assign(result, { _null: true });
    },

    default(value = null) {
        if (Object.hasOwn(result, "_default")) {
            throw new SchemaError(
                `You have been already added a 'default' option.`
            );
        }
        if (Object.hasOwn(result, "_null")) {
            throw new SchemaError(
                `You have specified a 'null' option. You cannot use "default" and "null" together.`
            );
        }
        if (result.type !== typeof value && value !== null) {
            throw new SchemaError(
                `Type of the value passed to 'default' option doesn't match the 'type'.`
            );
        }
        return Object.assign(result, { _default: value });
    },

    fn(func = (v) => null) {
        if (Object.hasOwn(result, "_fn")) {
            throw new SchemaError(`You have been already added a 'fn' option.`);
        }
        return Object.assign(result, { _fn: (v) => func(v) });
    },

    rule(func = (v) => true) {
        if (Object.hasOwn(result, "_rule")) {
            throw new SchemaError(
                `You have been already added an 'rule' option.`
            );
        }
        return Object.assign(result, { _rule: (v) => func(v) });
    },
});

const createStringProto = (result) => ({
    ...createCommonProto(result),
    regexp(exp) {
        if (result.type !== "string") {
            throw new SchemaError(
                `The 'regexp' option is applicable for the 'string' type.`
            );
        }
        if (Object.hasOwn(result, "_regexp")) {
            throw new SchemaError(
                `You have been already added an 'regexp' option.`
            );
        }
        return Object.assign(result, { _regexp: exp });
    },
});

const createNumberProto = (result) => ({
    ...createCommonProto(result),
    ...createExtendedNumberProto(result),
});

const createBigintProto = (result) => ({
    ...createCommonProto(result),
    ...createExtendedNumberProto(result),
});

const createBooleanProto = (result) => ({
    ...createCommonProto(result),
    toggle() {
        if (result.type !== "boolean") {
            throw new SchemaError(
                `The 'toggle' option is applicable for the 'boolean' type.`
            );
        }
        if (Object.hasOwn(result, "_toggle")) {
            throw new SchemaError(
                `You have been already added an 'regexp' option.`
            );
        }
        return Object.assign(result, { _toggle: true });
    },
});

const createObjectProto = (result) => ({
    ...createCommonProto(result),
    props(obj = {}) {
        if (result.type !== "object") {
            throw new SchemaError(
                `The 'props' option is applicable for the 'object' type only.`
            );
        }
        if (obj === undefined) {
            throw new SchemaError(
                `If you are using the 'props' option, you should specify its properties schema.`
            );
        }
        if (obj === null || typeof obj !== "object") {
            throw new SchemaError(
                `The 'props' option must be a type of 'object'.`
            );
        }
        return Object.assign(result, { _props: obj });
    },
});

const createArrayProto = (result) => ({
    ...createCommonProto(result),
    items(item) {
        if (result.type !== "array") {
            throw new SchemaError(
                `The 'items' option is applicable for the 'array' type.`
            );
        }
        if (item === undefined) {
            throw new SchemaError(
                `If you are using the 'items' option, you should specify its element schema.`
            );
        }
        return Object.assign(result, { _items: item });
    },
});

const protos = {
    string: createStringProto,
    number: createNumberProto,
    bigint: createBigintProto,
    boolean: createBooleanProto,
    object: createObjectProto,
    array: createArrayProto,
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
