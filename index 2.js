// export { SB } from "./sb.js";
// export { createTable } from "./lib/createTable.js";

// export class Table {
//     constructor(props) {
//         return createTable(props);
//     }
// }

import { schema } from "./schema.js";
import { createCrudValidator } from "./lib/createCrudValidator.js";

createCrudValidator(schema);
