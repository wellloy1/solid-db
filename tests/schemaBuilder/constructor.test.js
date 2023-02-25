import { SB } from "../../sb.js";

describe("SB", () => {
    test("creates a string schema", () => {
        const schema = SB.string;
        expect(schema.type).toBe("string");
    });

    test("creates a number schema", () => {
        const schema = SB.number;
        expect(schema.type).toBe("number");
    });

    test("creates a boolean schema", () => {
        const schema = SB.boolean;
        expect(schema.type).toBe("boolean");
    });

    test("creates a bigint schema", () => {
        const schema = SB.bigint;
        expect(schema.type).toBe("bigint");
    });

    test("creates an object schema", () => {
        const schema = SB.object;
        expect(schema.type).toBe("object");
    });

    test("creates an array schema", () => {
        const schema = SB.array;
        expect(schema.type).toBe("array");
    });
});
