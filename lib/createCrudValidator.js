// The schema should come pre-validated to this function
export function createCrudValidator(schema) {
    const props = schema.props;
    const pk = schema.pk;
    const additional = schema.additional;

    for (const prop in props) {
        propsMap[prop] = props[prop];
    }
}

function createInsertValidator() {}

function createGetValidator() {}

function createRemoveValidator() {}

function createUpdateValidator() {}

// Note:
//
// String/Number/Bigint/Boolean/Object/Array:
// default
// null
// fn
// if
//
// String:
// regexp
//
// Number/Bigint:
// increment
// decrement
//
// Boolean:
// toggle
//
// Object:
// props
//
// Array:
// items

// function insertValidator(_row) {
//     const row = { ..._row };
//     const filteredRow = {};
//     const props = this.#schema.props;
//     const additional = this.#schema.additional ?? true;
//     for (const name in props) {
//         const auto = props[name].auto;
//         const fn = props[name].fn;
//         const def = props[name].default;
//         const type = props[name].type;
//         const exists = Object.hasOwn(row, name);
//         const value = row[name];
//         const rule = props[name].rule;
//         if (exists && value !== undefined) {
//             if (type) {
//                 const propType = typeof value;
//                 if (propType !== type) {
//                     console.error(
//                         `Object key "${name}" should be a type of "${type}". Provided:`
//                     );
//                     console.error({
//                         [name]: value,
//                         propType,
//                     });
//                     throw Error(`Insert validation error: Invalid value type.`);
//                 }
//             }
//             if (rule && !rule(value)) {
//                 if (def) filteredRow[name] = def;
//                 else {
//                     console.error(
//                         `Object key "${name}" value doesn't match the rule. Provided:`
//                     );
//                     console.error({
//                         [name]: value,
//                         rule: rule.toString(),
//                     });
//                     throw Error(`Insert validation error: Not match the rule.`);
//                 }
//             } else filteredRow[name] = value;
//         } else if (fn) {
//             filteredRow[name] = fn();
//         } else if (auto && type === "number") {
//             filteredRow[name] = this.#table.data.length;
//         } else if (def !== undefined) {
//             filteredRow[name] = def;
//         } else {
//             console.error(
//                 `Object key "${name}" is required, but has not been provided. Provided:`
//             );
//             console.info({
//                 [name]: value,
//                 insertionData: row,
//             });
//             throw Error(`Insert validation error: Missed required value.`);
//         }
//         delete row[name];
//     }
//     if (additional) return { ...filteredRow, ...row };
//     else {
//         return { ...filteredRow };
//     }
// }
