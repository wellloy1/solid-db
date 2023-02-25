// Helper methods



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
const primaryHash = primaryKeys.join(_PKHASH_DELIMETER);

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
this.#updateSignal("_signalInsert");
this.#updateSignal("_signalChange");
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
const primaryHash = primaryKeys.join(_PKHASH_DELIMETER);

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
    this.#updateSignal("_signalRemove");
    this.#updateSignal("_signalChange");
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
const primaryHash = primaryKeys.join(_PKHASH_DELIMETER);
const index = this.#table.indexes[primaryHash];

if (typeof index === "number") {
    this.#updateSignal("_signalGet");
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
const primaryHash = primaryKeys.join(_PKHASH_DELIMETER);
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

    this.#updateSignal("_signalUpdate");
    this.#updateSignal("_signalChange");
    return true;
} else return false;
}
