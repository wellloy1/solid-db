import { SB } from "../../sb.js";

describe("SB: create 'type' property", () => {
    test("1: creates a string type", () => {
        const schema = SB.string;
        expect(schema.type).toBe("string");
    });

    test("2: creates a number type", () => {
        const schema = SB.number;
        expect(schema.type).toBe("number");
    });

    test("3: creates a boolean type", () => {
        const schema = SB.boolean;
        expect(schema.type).toBe("boolean");
    });

    test("4: creates a bigint type", () => {
        const schema = SB.bigint;
        expect(schema.type).toBe("bigint");
    });

    test("5: creates an object type", () => {
        const schema = SB.object;
        expect(schema.type).toBe("object");
    });

    test("6: creates an array type", () => {
        const schema = SB.array;
        expect(schema.type).toBe("array");
    });
});
