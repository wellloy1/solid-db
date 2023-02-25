import { SB } from "../../sb.js";

describe.skip("SB.string", () => {
    describe(".regexp()", () => {
        it("should add the _regexp property to the schema object", () => {
            const regexp = /test/;
            const schema = SB.string.regexp(regexp);
            expect(schema._regexp).toBe(regexp);
        });

        it("should throw a SchemaError if the type of the schema is not 'string'", () => {
            const schema = SB.boolean;
            expect(() => schema.regexp(/test/)).toThrow(
                "The 'regexp' option is applicable for the 'string' type."
            );
        });

        it("should throw a SchemaError if _regexp property is already defined", () => {
            const schema = SB.string.regexp(/test/);
            expect(() => schema.regexp(/test/)).toThrow(
                "You have been already added an 'regexp' option."
            );
        });
    });

    describe(".default()", () => {
        it("should add the _default property to the schema object", () => {
            const defaultValue = "default";
            const schema = SB.string.default(defaultValue);
            expect(schema._default).toBe(defaultValue);
        });

        it("should throw a SchemaError if the _default property is already defined", () => {
            const schema = SB.string.default("default");
            expect(() => schema.default("another-default")).toThrow(
                "You have been already added a 'default' option."
            );
        });

        it("should throw a SchemaError if the _null property is already defined", () => {
            const schema = SB.string.null();
            expect(() => schema.default("default")).toThrow(
                "You have specified a 'null' option. You cannot use 'default' and 'null' together."
            );
        });

        it("should throw a SchemaError if the type of the value passed to 'default' option doesn't match the 'type'", () => {
            const schema = SB.string;
            expect(() => schema.default(10)).toThrow(
                "Type of the value passed to 'default' option doesn't match the 'type'."
            );
        });
    });

    describe(".null()", () => {
        it("should add the _null property to the schema object", () => {
            const schema = SB.string.null();
            expect(schema._null).toBe(true);
        });

        it("should throw a SchemaError if the _null property is already defined", () => {
            const schema = SB.string.null();
            expect(() => schema.null()).toThrow(
                "You have been already added a 'null' option"
            );
        });

        it("should throw a SchemaError if the _default property is already defined", () => {
            const schema = SB.string.default("default");
            expect(() => schema.null()).toThrow(
                "You have specified a 'default' option. You cannot use 'default' and 'null' together."
            );
        });
    });
});
