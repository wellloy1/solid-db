declare class SchemaError extends Error {
    constructor(message: string);
}

export declare class SchemaBuilder {
    [result: symbol]: any;
    static table(obj: ObjectPropsSchema): TableSchema;
    static readonly string: StringSchema;
    static readonly number: NumberSchema;
    static readonly boolean: BooleanSchema;
    static readonly bigint: BigintSchema;
    static readonly object: ObjectSchema;
    static readonly array: ArraySchema;
}

export interface TableSchema {
    pk(keys: string | string[]): TableSchema;
    extra(): TableSchema;
}

export interface StringSchema {
    default(value?: string | null): StringSchema;
    fn(func: (value: string) => string): StringSchema;
    rule(func: (value: string) => boolean): StringSchema;
    null(): StringSchema;
    regexp(exp: RegExp): StringSchema;
}

export interface NumberSchema {
    default(value?: number | null): NumberSchema;
    fn(func: (value: number) => number): NumberSchema;
    rule(func: (value: number) => boolean): NumberSchema;
    null(): NumberSchema;
    increment(): NumberSchema;
    decrement(): NumberSchema;
}

export interface BigintSchema {
    default(value?: bigint | null): BigintSchema;
    fn(func: (value: bigint) => bigint): BigintSchema;
    rule(func: (value: bigint) => boolean): BigintSchema;
    null(): BigintSchema;
    increment(): BigintSchema;
    decrement(): BigintSchema;
}

export interface BooleanSchema {
    default(value?: boolean | null): BooleanSchema;
    fn(func: (value: boolean) => boolean): BooleanSchema;
    rule(func: (value: boolean) => boolean): BooleanSchema;
    null(): BooleanSchema;
    toggle(): BooleanSchema;
}

export interface ArraySchema {
    default(value?: array | null): ArraySchema;
    fn(func: (value: array) => array): ArraySchema;
    rule(func: (value: array) => boolean): ArraySchema;
    null(): ArraySchema;
    items(
        item:
            | StringSchema
            | NumberSchema
            | BigintSchema
            | BooleanSchema
            | ArraySchema
            | ObjectSchema
    ): ArraySchema;
}

export interface ObjectSchema {
    default(value?: object | null): ObjectSchema;
    fn(func: (value: object) => object): ObjectSchema;
    rule(func: (value: object) => boolean): ObjectSchema;
    null(): ObjectSchema;
    props(obj: ObjectPropsSchema): ObjectSchema;
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

// Generated schemas:
export interface SchemaBuilderResult {
    type: "string" | "number" | "bigint" | "boolean" | "object" | "array";
    _default?: any;
    _null?: true;
}

export interface StringSchemaResult {
    type: "string";
    _regexp?: RegExp;
}

export interface NumberSchemaResult {
    type: "number";
    _increment?: true;
    _decrement?: true;
}

export interface BigintSchemaResult {
    type: "bigint";
    _increment?: true;
    _decrement?: true;
}

export interface BooleanSchemaResult {
    type: "boolean";
    _toggle?: true;
}

export interface ArraySchemaResult {
    type: "array";
    _items?: any;
}

export interface ObjectSchemaResult {
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
