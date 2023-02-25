# SolidJS reactive database

It is like a NoSQL DB at the frontend side, but reactive, for projects which use SolidJS.

[About](./docs/ABOUT.md)

## Getting started

At your SolidJS project:

```bash
npm i solid-db
```

Now you need to create a schema. Let assume we creating a table of SVG objects added to canvas.

`./src/schemas/objects.js`:

```js
import { uuid } from "../lib";

export const objects = {
  props: {
    id: {
      type: "string",
      rule: (val) => val.trim().length > 0,
    },
    type: {
      type: "string",
      rule: (val) => val.trim().length > 0,
    },
    x: {
      type: "number",
      rule: (val) => Number.isFinite(val),
    },
    y: {
      type: "number",
      rule: (val) => Number.isFinite(val),
    },
    width: {
      type: "number",
      rule: (val) => Number.isFinite(val),
    },
    height: {
      type: "number",
      rule: (val) => Number.isFinite(val),
    },
    fill: {
      type: "string",
      rule: (val) => val.trim().length > 0,
    },
  },
  additional: false,
  pk: ["id"],
};
```
