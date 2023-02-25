import { SB } from "./sb.js";

const data = {
    x: SB.boolean,
    y: SB.number,
    width: SB.number,
    height: SB.number,
};

export const schema = {
    id: SB.number.fn(Date.now),
    registered: SB.boolean,
    comment: SB.string.default("No comment"),
    data: SB.object.props({
        id: SB.number.fn(Date.now),
    }),
};

console.log(schema);
