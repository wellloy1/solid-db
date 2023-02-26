import { SchemaBuilder as SB } from "./sb.js";

const data = {
    x: SB.boolean,
    y: SB.number,
    width: SB.number,
    height: SB.number,
};

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

export const schema2 = SB.createSchema((schema) => {
    schema.number("id").fn(Date.now);
    schema.boolean("registered");
    schema.string("comment").default("No comment");
    schema.object("data").props({
        id: SB.number.fn(Date.now),
    });
});

console.log(schema1);
console.log(schema2);
