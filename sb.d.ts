declare class SchemaError extends Error {
    constructor(message: string);
}

export declare class SB {
    [result: symbol]: any;
    static readonly string: StringSchema;
    static readonly number: NumberSchema;
    static readonly boolean: BooleanSchema;
    static readonly bigint: BigintSchema;
    static readonly object: ObjectSchema;
    static readonly array: ArraySchema;
}

export interface SBResult {
    type: "string" | "number" | "bigint" | "boolean" | "object" | "array";
    _default?: any;
    _null?: true;
}

export interface CommonSchemaResult {
    _default?: any;
    _null?: true;
    _fn?: Function;
    _rule?: Function;
}

export interface StringSchemaResult extends CommonSchemaResult {
    type: "string";
    _regexp?: RegExp;
}

export interface NumberSchemaResult extends CommonSchemaResult {
    type: "number";
    _increment?: true;
    _decrement?: true;
}

export interface BigintSchemaResult extends CommonSchemaResult {
    type: "bigint";
    _increment?: true;
    _decrement?: true;
}

export interface BooleanSchemaResult extends CommonSchemaResult {
    type: "boolean";
    _toggle?: true;
}

export interface ArraySchemaResult extends CommonSchemaResult {
    type: "array";
    _items?: any;
}

export interface ObjectSchemaResult extends CommonSchemaResult {
    type: "object";
    _props?: ObjectPropsSchemaResult;
}

export interface ObjectPropsSchemaResult {
    [key: string]:
        | StringSchemaResult
        | NumberSchemaResult
        | BigintSchemaResult
        | BooleanSchemaResult
        | ArraySchemaResult
        | ObjectSchemaResult;
}

export interface StringSchema extends CommonSchema {
    null(): StringSchema;
    regexp(exp: RegExp): StringSchema;
}

export interface NumberSchema extends CommonSchema {
    null(): NumberSchema;
    increment(): NumberSchema;
    decrement(): NumberSchema;
}

export interface BigintSchema extends CommonSchema {
    null(): BigintSchema;
    increment(): BigintSchema;
    decrement(): BigintSchema;
}

export interface BooleanSchema extends CommonSchema {
    null(): BooleanSchema;
    toggle(): BooleanSchema;
}

export interface CommonSchema {
    default(value?: string | number | boolean | null): CommonSchema;
    fn(func: (value: any) => any): CommonSchema;
    rule(func: (value: any) => boolean): CommonSchema;
    null(): StringSchema | NumberSchema | BigintSchema | BooleanSchema;
}

export interface ArraySchema extends CommonSchema {
    items(item: any): ArraySchema;
}

export interface ObjectSchema extends CommonSchema {
    props(obj: ObjectPropsSchema | ObjectPropsSchemaResult): ObjectSchema;
}

export interface ObjectPropsSchema {
    [key: string]:
        | StringSchema
        | NumberSchema
        | BigintSchema
        | BooleanSchema
        | ArraySchema
        | ObjectSchema;
}
