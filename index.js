import { createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
export { SchemaBuilder } from "./lib/schemaBuilder.js";

const [_store, _updateStore] = createStore({});

// We need to set unique initial state (1) to avoid first createEffect call
const __signalGet = createSignal([1]);
const __signalInsert = createSignal([1]);
const __signalUpdate = createSignal([1]);
const __signalRemove = createSignal([1]);
const __signalChange = createSignal([1]);

const PKHASH_DELIMETER = "_pkd2ca03103ae0_";

export class Table {
    #name = null;
    #table = null;
    #schema = null;
    #validate = this.#_validate;

    constructor(name, schema, data = []) {
        this.#createTable(name, schema, data);
        this.#name = name;
        this.#table = _store[name];
        this.#schema = schema;
    }

    #updateSignal(signal) {
        console.log("on:", signal);

        const actions = {
            true: () => signals[signal][1](() => []),
            false: () => signals[signal][1](() => [true]),
        };
        const signals = {
            __signalGet,
            __signalInsert,
            __signalUpdate,
            __signalRemove,
            __signalChange,
        };
        const flag = !!signals[signal][0];
        actions[flag]();
    }

    #createTable(name, schema, data) {
        _updateStore(name, { name, data, indexes: {} });
    }

    onGet(fn) {
        createEffect(() => {
            if (__signalGet[0] === 1) return;
            fn();
        });
    }

    onChange(fn) {
        createEffect(() => {
            if (__signalChange[0] === 1) return;
            fn();
        });
    }

    onUpdate(fn) {
        createEffect(() => {
            if (__signalUpdate[0] === 1) return;
            fn();
        }, [__signalUpdate]);
    }

    onRemove(fn) {
        createEffect(() => {
            if (__signalRemove[0] === 1) return;
            fn();
        });
    }

    onInsert(fn) {
        createEffect(() => {
            if (__signalInsert[0] === 1) return;
            fn();
        });
    }

    // Store state return methods
    store() {
        return this.#table;
    }

    list() {
        __signalUpdate[0];
        return this.#table.data;
    }

    index() {
        __signalUpdate[0];
        return this.#table.indexes;
    }

    json() {
        __signalUpdate[0];
        return JSON.stringify(this.#table.data);
    }

    keys() {
        __signalUpdate[0];
        return Object.keys(this.#table.indexes);
    }

    count() {
        __signalUpdate[0];
        return this.#table.data.length;
    }

    // Helper methods
    #validateUpdate(_fields) {
        const props = this.#schema.props;
        const fields = {};
        const additionalFields = {};
        const additional = this.#schema.additional ?? true;
        for (const name in _fields) {
            const existsInProps = Object.hasOwn(props, name);
            const value = _fields[name];
            const type = props[name].type;
            if (existsInProps && type) {
                const propType = typeof value;
                if (propType !== type) {
                    console.error(
                        `Object key "${name}" should be a type of "${type}". Provided:`
                    );
                    console.error({
                        [name]: value,
                        propType,
                    });
                    throw Error(`Update validation error: Invalid value type.`);
                }
                fields[name] = value;
            } else additionalFields[name] = value;
        }
        if (additional) return { ...fields, ...additionalFields };
        else {
            return { ...fields };
        }
    }

    #_validate(_row) {
        const row = { ..._row };
        const filteredRow = {};
        const props = this.#schema.props;
        const additional = this.#schema.additional ?? true;
        for (const name in props) {
            const auto = props[name].auto;
            const fn = props[name].fn;
            const def = props[name].default;
            const type = props[name].type;
            const exists = Object.hasOwn(row, name);
            const value = row[name];
            const rule = props[name].rule;
            if (exists && value !== undefined) {
                if (type) {
                    const propType = typeof value;
                    if (propType !== type) {
                        console.error(
                            `Object key "${name}" should be a type of "${type}". Provided:`
                        );
                        console.error({
                            [name]: value,
                            propType,
                        });
                        throw Error(
                            `Insert validation error: Invalid value type.`
                        );
                    }
                }
                if (rule && !rule(value)) {
                    if (def) filteredRow[name] = def;
                    else {
                        console.error(
                            `Object key "${name}" value doesn't match the rule. Provided:`
                        );
                        console.error({
                            [name]: value,
                            rule: rule.toString(),
                        });
                        throw Error(
                            `Insert validation error: Not match the rule.`
                        );
                    }
                } else filteredRow[name] = value;
            } else if (fn) {
                filteredRow[name] = fn();
            } else if (auto && type === "number") {
                filteredRow[name] = this.#table.data.length;
            } else if (def !== undefined) {
                filteredRow[name] = def;
            } else {
                console.error(
                    `Object key "${name}" is required, but has not been provided. Provided:`
                );
                console.info({
                    [name]: value,
                    insertionData: row,
                });
                throw Error(`Insert validation error: Missed required value.`);
            }
            delete row[name];
        }
        if (additional) return { ...filteredRow, ...row };
        else {
            return { ...filteredRow };
        }
    }

    #updateTable(...args) {
        _updateStore(this.#name, ...args);
    }

    insertOne(row) {
        const filteredRow = this.#validate(row);
        let primaryKeys = [];
        for (const key of this.#schema.pk) {
            let stringifiedValue;
            switch (typeof filteredRow[key]) {
                case "string":
                    stringifiedValue = filteredRow[key];
                    break;
                default:
                    stringifiedValue = JSON.stringify(filteredRow[key]);
                    break;
            }
            primaryKeys.push(stringifiedValue);
        }
        const primaryHash = primaryKeys.join(PKHASH_DELIMETER);

        if (typeof this.#table.indexes[primaryHash] === "number") {
            console.error(
                `Row with primary key "[${primaryKeys.toString()}]" is already exists. Provided:`
            );
            console.error({ insertionData: row });
            throw Error(`Insertion error: Illegal primary key duplication try`);
        }

        this.#updateTable("indexes", (indexes) => ({
            ...indexes,
            [primaryHash]: this.count(),
        }));
        this.#updateTable("data", (rows) => [...rows, filteredRow]);
        this.#updateSignal("__signalInsert");
        this.#updateSignal("__signalChange");
        return filteredRow;
    }

    insert(rows) {
        const newRows = [];
        for (const row of rows) {
            const newRow = this.insertOne(row);
            newRows.push(newRow);
        }
        return newRows;
    }

    /**
    Removes a record from a data source by primary key.
    @param {Object} primaryKey - An object with one or more keys that uniquely identify the record to remove.
    @returns {boolean} - Returns true if the record was successfully removed, or false otherwise.
*/
    remove(rows) {
        for (const item of rows) {
            this.removeOne(item.id);
        }
    }

    removeOne(...primaryKey) {
        let primaryKeys = [];
        for (const val of primaryKey) {
            let stringifiedValue;
            switch (typeof val) {
                case "string":
                    stringifiedValue = val;
                    break;
                default:
                    stringifiedValue = JSON.stringify(val);
                    break;
            }
            primaryKeys.push(stringifiedValue);
        }
        const primaryHash = primaryKeys.join(PKHASH_DELIMETER);

        const index = this.#table.indexes[primaryHash];

        if (typeof index === "number") {
            this.#updateTable(
                "indexes",
                produce((indexes) => {
                    delete indexes[primaryHash];
                    for (const key in indexes) {
                        const i = indexes[key];
                        if (i > index) indexes[key] -= 1;
                    }
                })
            );
            this.#updateTable("data", (_rows) => [
                ..._rows.slice(0, index),
                ..._rows.slice(index + 1),
            ]);
            this.#updateSignal("__signalRemove");
            this.#updateSignal("__signalChange");
            return true;
        }
        return false;
    }

    getOne(...primaryKey) {
        let primaryKeys = [];
        for (const val of primaryKey) {
            let stringifiedValue;
            switch (typeof val) {
                case "string":
                    stringifiedValue = val;
                    break;
                default:
                    stringifiedValue = JSON.stringify(val);
                    break;
            }
            primaryKeys.push(stringifiedValue);
        }
        const primaryHash = primaryKeys.join(PKHASH_DELIMETER);
        const index = this.#table.indexes[primaryHash];

        if (typeof index === "number") {
            // this.#updateSignal("__signalGet");
            return this.#table.data[index];
        } else return undefined;
    }

    updateOne(...args) {
        if (args.length < 2) {
            throw new Error(
                `Update method requires 2 arguments at least, where the last one is object with new properties.`
            );
        }
        const fields = args.pop();
        const primaryKey = args;
        let primaryKeys = [];
        for (const val of primaryKey) {
            let stringifiedValue;
            switch (typeof val) {
                case "string":
                    stringifiedValue = val;
                    break;
                default:
                    stringifiedValue = JSON.stringify(val);
                    break;
            }
            primaryKeys.push(stringifiedValue);
        }
        const primaryHash = primaryKeys.join(PKHASH_DELIMETER);
        const index = this.#table.indexes[primaryHash];

        if (typeof index === "number") {
            const filteredFields = this.#validateUpdate(fields);
            // this.#updateTable("data", index, (fields) => {
            //   console.log(fields);
            // });
            this.#updateTable(
                "data",
                index,
                produce((fields) => {
                    Object.assign(fields, filteredFields);
                })
            );

            this.#updateSignal("__signalUpdate");
            this.#updateSignal("__signalChange");
            return true;
        } else return false;
    }
}
