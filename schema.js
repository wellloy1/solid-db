import { SchemaBuilder as SB } from "./lib/schemaBuilder.js";

export const schema1 = {
    props: {
        id: SB.number.fn(Date.now),
        registered: SB.boolean,
        comment: SB.string.default("No comment"),
        data: SB.object.props({
            id: SB.number.fn(Date.now),
        }),
    },
    pk: "id",
    extra: true,
};

export const schema2 = SB.table({
    id: SB.number.fn(Date.now),
    registered: SB.boolean,
    comment: SB.string.default("No comment"),
    data: SB.object.props({
        id: SB.number.fn(Date.now),
    }),
});

console.log(schema1);
console.log(schema2);
