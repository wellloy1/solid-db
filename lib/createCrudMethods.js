export function createCrudMethods({ storeTable, signals, schema, validate }) {
    return {
        ...createInsert({ storeTable, signals, schema, validate }),
        ...createRemove({ storeTable, signals, schema, validate }),
        ...createUpdate({ storeTable, signals, schema, validate }),
        ...createGet({ storeTable, signals, schema, validate }),
    };
}
