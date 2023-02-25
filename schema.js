import { SB } from "./sb.js";

const data = {
    x: SB.boolean,
    y: SB.number,
    width: SB.number,
    height: SB.number,
};

export const schema = {
    id: SB.string,
    age: SB.number,
    registered: SB.boolean,

    // data: SB.object.props(data),
};

// console.log(schema);
