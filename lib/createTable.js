// import { createEffect, createStore, produce } from "./solidjs-imports.js";

import { createEffect } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { createCRUDMethods } from "./lib/createCRUDMethods.js";

export const [_store, _updateStore] = createStore({
    // We need to set unique initial state (1) to avoid first createEffect call
    signals: {
        get: [1],
        insert: [1],
        update: [1],
        remove: [1],
        change: [1],
    },
    tables: {},
});

const _PKHASH_DELIMETER = "_pkd2ca03103ae0_";

// Helpers:
function _validateSchema(schema) {}

function _updateSignal(signal) {
    const [currentValue] = _store[signal];
    const updatedValue = !currentValue;
    const updateFn = updatedValue
        ? produce((signal) => signal.pop())
        : produce((signal) => signal.push(true));
    _updateStore(signal, updateFn);
}

function _createMethodUpdateHandler(signal) {
    return (fn) => {
        createEffect(() => {
            if (_store.signals[signal][0] === 1) return;
            fn();
        });
    };
}

function _createFunctionValidateUpdate() {
    return (_fields) => {
        // const props = this.#schema.props;
        // const fields = {};
        // const additionalFields = {};
        // const additional = this.#schema.additional ?? true;
        // for (const name in _fields) {
        //     const existsInProps = Object.hasOwn(props, name);
        //     const value = _fields[name];
        //     const type = props[name].type;
        //     if (existsInProps && type) {
        //         const propType = typeof value;
        //         if (propType !== type) {
        //             console.error(
        //                 `Object key "${name}" should be a type of "${type}". Provided:`
        //             );
        //             console.error({
        //                 [name]: value,
        //                 propType,
        //             });
        //             throw Error(`Update validation error: Invalid value type.`);
        //         }
        //         fields[name] = value;
        //     } else additionalFields[name] = value;
        // }
        // if (additional) return { ...fields, ...additionalFields };
        // else {
        //     return { ...fields };
        // }
    };
}

function _createFunctionValidate() {
    return (_row) => {
        // const row = { ..._row };
        // const filteredRow = {};
        // const props = this.#schema.props;
        // const additional = this.#schema.additional ?? true;
        // for (const name in props) {
        //     const auto = props[name].auto;
        //     const fn = props[name].fn;
        //     const def = props[name].default;
        //     const type = props[name].type;
        //     const exists = Object.hasOwn(row, name);
        //     const value = row[name];
        //     const rule = props[name].rule;
        //     if (exists && value !== undefined) {
        //         if (type) {
        //             const propType = typeof value;
        //             if (propType !== type) {
        //                 console.error(
        //                     `Object key "${name}" should be a type of "${type}". Provided:`
        //                 );
        //                 console.error({
        //                     [name]: value,
        //                     propType,
        //                 });
        //                 throw Error(
        //                     `Insert validation error: Invalid value type.`
        //                 );
        //             }
        //         }
        //         if (rule && !rule(value)) {
        //             if (def) filteredRow[name] = def;
        //             else {
        //                 console.error(
        //                     `Object key "${name}" value doesn't match the rule. Provided:`
        //                 );
        //                 console.error({
        //                     [name]: value,
        //                     rule: rule.toString(),
        //                 });
        //                 throw Error(
        //                     `Insert validation error: Not match the rule.`
        //                 );
        //             }
        //         } else filteredRow[name] = value;
        //     } else if (fn) {
        //         filteredRow[name] = fn();
        //     } else if (auto && type === "number") {
        //         filteredRow[name] = this.#table.data.length;
        //     } else if (def !== undefined) {
        //         filteredRow[name] = def;
        //     } else {
        //         console.error(
        //             `Object key "${name}" is required, but has not been provided. Provided:`
        //         );
        //         console.info({
        //             [name]: value,
        //             insertionData: row,
        //         });
        //         throw Error(`Insert validation error: Missed required value.`);
        //     }
        //     delete row[name];
        // }
        // if (additional) return { ...filteredRow, ...row };
        // else {
        //     return { ...filteredRow };
        // }
    };
}

export function createTable(name, schema, { data, validate }) {
    validate = !!validate;

    _updateStore(name, { name, data, indexes: {} });

    const storeTable = _store.tables[name];
    const signals = _store.signals;
    return {
        // CRUD methods
        ...createCRUDMethods({ storeTable, signals, schema, validate }),

        // CRUD handlers methods
        onInsert(fn) {
            createEffect(() => {
                if (signals.insert[0] === null) return;
                fn();
            });
        },

        onUpdate(fn) {
            createEffect(() => {
                if (signals.update[0] === 1) return;
                fn();
            });
        },

        onRemove(fn) {
            createEffect(() => {
                if (signals.remove[0] === 1) return;
                fn();
            });
        },

        onGet(fn) {
            createEffect(() => {
                if (signals.get[0] === 1) return;
                fn();
            });
        },

        onChange(fn) {
            createEffect(() => {
                if (signals.change[0] === 1) return;
                fn();
            });
        },

        // Store state return methods
        store() {
            return storeTable;
        },

        list() {
            signals.change[0];
            return storeTable.data;
        },
        index() {
            signals.change[0];
            return storeTable.indexes;
        },

        json() {
            signals.change[0];
            return JSON.stringify(storeTable.data);
        },

        keys() {
            signals.change[0];
            return Object.keys(storeTable.indexes);
        },

        count() {
            signals.change[0];
            return storeTable.data.length;
        },
    };
}
