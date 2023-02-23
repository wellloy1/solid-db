# SolidJS store database

It is like a NoSQL DB at the frontend side, but reactive.  
It uses SolidJS store inside to keep data.

# About

With StoreDB you can work with SolidJS store like you work with NoSQL database.  
If your application needs to store, populate. update and read some data collections at the frontend side it might be very useful for you.  
You can create a simple set of queries directly to your store (CRUD).
Then you can get reactive action in your component by reading a chunks of data from you collection, or using 'update' handlers.

This library does not invent anything new. Ryan and his team have done an excellent job. The reactivity in Solid.js is truly impressive. The library uses native SolidJS primitives for reactive synchronization, simply making working with an ordered set of data more convenient and secure.

On this matter, more details will be provided below.

# Reactivity

Solid-storedb (hereafter referred to as StoreDB) uses createStore under the hood. As you use [store] from instantiated read/write tuple to update component state, you can use StoreDB methods with descriptive names to update component state or invoke side-effects.

`.list()` - returns the whole table data as list (Array) of values;  
`.json()` - returns the whole table data in JSON format;  
`.count()` - returns a count of rows of table data;  
`.index()` - returns a index map of current table;

# Update handlers

StoreDB also provides a set of clear methods that work as createEffect (using createEffect internally). Each method acts as an event handler, calling back the callback function you passed in when your data collection has been changed.

`.onChange()` - triggers when any changes occur in the table;  
`.onInsert()` - triggers after insertions;  
`.onUpdate()` - triggers after row updates;  
`.onRemove()` - triggers after removing rows;  
`.onGet()` - triggers after a component reads a certain amount of data from the table;
