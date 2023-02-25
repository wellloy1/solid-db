describe.skip("SB array", () => {
    test("creates a string schema", () => {
        const schema = SB.string;
        expect(schema.type).toBe("string");
    });
});
