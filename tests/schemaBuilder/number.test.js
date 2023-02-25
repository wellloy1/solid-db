import { SB } from "../../sb";

describe.skip("SB.number", () => {
    it("1 - should create a number schema with a default value", () => {
        const schema = SB.number.default(10);
        expect(schema.type).toBe.number;
        expect(schema._default).toBe(10);
    });

    it("2 - should increment and decrement the number schema", () => {
        const schemaInc = SB.number.increment();
        const schemaDec = SB.number.decrement();
        expect(schemaInc._increment).toBeTruthy();
        expect(schemaDec._decrement).toBeTruthy();
    });

    it("3 - should throw an error if trying to use both increment and decrement", () => {
        expect(() => {
            SB.number.increment().decrement().increment();
        }).toThrow("You cannot use 'increment' and 'decrement' together.");
    });

    it("4 - should throw an error if trying to use increment or decrement for a non-numeric schema", () => {
        expect(() => {
            SB.string.increment();
        }).toThrow(
            "The 'increment' option is applicable for the 'number' or 'bigint' type."
        );

        expect(() => {
            SB.boolean.decrement();
        }).toThrow(
            "The 'decrement' option is applicable for the 'number' or 'bigint' type."
        );

        expect(() => {
            SB.object.decrement();
        }).toThrow(
            "The 'decrement' option is applicable for the 'number' or 'bigint' type."
        );

        expect(() => {
            SB.array.decrement();
        }).toThrow(
            "The 'decrement' option is applicable for the 'number' or 'bigint' type."
        );
    });

    it("5 - should set a rule for number schema", () => {
        const rule = (v) => v > 0;
        const schema = SB.number.rule(rule);
        expect(schema.type).toBe.number;
        expect(schema._rule).toBeInstanceOf(Function);
    });

    it("6 - should set a function for number schema", () => {
        const fn = (v) => v + 1;
        const schema = SB.number.fn(fn);
        expect(schema.type).toBe.number;
        expect(schema._fn).toBeInstanceOf(Function);
    });

    it("7 - should set null for number schema", () => {
        const schema = SB.number.null();
        expect(schema.type).toBe.number;
        expect(schema._null).toBeTruthy();
    });

    it("8 - should set a default value for number schema", () => {
        const schema = SB.number.default(0);
        expect(schema.type).toBe.number;
        expect(schema._default).toBe(0);
    });

    it("9 - should throw an error if trying to use both null and default", () => {
        expect(() => {
            SB.number.null().default(0);
        }).toThrow(
            "You have specified a 'null' option. You cannot use 'default' and 'null' together."
        );
    });

    it("10 - should throw an error if trying to use wrong type for default", () => {
        expect(() => {
            SB.number.default("test");
        }).toThrow(
            "Type of the value passed to 'default' option doesn't match the 'type'."
        );
    });

    it("11 - should throw an error if trying to use default and null with wrong order", () => {
        expect(() => {
            SB.number.default(0).null();
        }).toThrow(
            "You have specified a 'default' option. You cannot use 'default' and 'null' together."
        );
    });
});
