describe.skip("SB string", () => {
    test("creates a string schema", () => {
        const schema = SB.string;
        expect(schema.type).toBe("string");
    });
});
