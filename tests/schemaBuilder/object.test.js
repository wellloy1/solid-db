describe.skip("SB object", () => {
    test("creates a string schema", () => {
        const schema = SB.string;
        expect(schema.type).toBe("string");
    });
});
