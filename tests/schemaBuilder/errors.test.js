import { SchemaBuilder as SB } from "../../lib/schemaBuilder.js";
import { errorMessage } from "../../lib/schemaErrorMessage.js";

describe("SB: expect to get an errors", () => {
    // should throw an error if/when:

    describe("If an option has collision with previous one", () => {
        it("1: increment", () => {
            expect(() => {
                SB.number.decrement().increment();
            }).toThrow(errorMessage.for.decrement.when.decrementAdded);
        });
        it("2: decrement", () => {
            expect(() => {
                SB.number.increment().decrement();
            }).toThrow(errorMessage.for.decrement.when.incrementAdded);
        });
        it("3: null", () => {
            expect(() => {
                SB.string.default().null();
            }).toThrow(errorMessage.for.null.when.defaultAdded);
        });
        it("4: default", () => {
            expect(() => {
                SB.string.null().default();
            }).toThrow(errorMessage.for.default.when.nullAdded);
        });
    });

    describe("If an option is not applicable for the current type", () => {
        it("1: regexp", () => {
            expect(() => {
                SB.number.regexp(/.^/).regexp(/.^/);
            }).toThrow(errorMessage.for.regexp.when.notApplicable);
        });
        it("2: toggle", () => {
            expect(() => {
                SB.string.toggle().toggle();
            }).toThrow(errorMessage.for.toggle.when.notApplicable);
        });
        it("3: increment", () => {
            expect(() => {
                SB.object.increment().increment();
            }).toThrow(errorMessage.for.increment.when.notApplicable);
        });
        it("4: decrement", () => {
            expect(() => {
                SB.array.decrement().decrement();
            }).toThrow(errorMessage.for.decrement.when.notApplicable);
        });
        it("5: props", () => {
            expect(() => {
                SB.string
                    .props({ id: { type: "string" } })
                    .props({ id: { type: "string" } });
            }).toThrow(errorMessage.for.props.when.notApplicable);
        });
        it("6: items", () => {
            expect(() => {
                SB.number.items(true).items(true);
            }).toThrow(errorMessage.for.items.when.notApplicable);
        });
    });

    describe("If an option has already been added", () => {
        it("1: null", () => {
            expect(() => {
                SB.string.null().null();
            }).toThrow(errorMessage.for.null.when.alreadyAdded);
        });
        it("2: default", () => {
            expect(() => {
                SB.string.default().default();
            }).toThrow(errorMessage.for.default.when.alreadyAdded);
        });
        it("3: fn", () => {
            expect(() => {
                SB.string.fn(Date.now).fn(Date.now);
            }).toThrow(errorMessage.for.fn.when.alreadyAdded);
        });
        it("4: rule", () => {
            expect(() => {
                SB.string.rule(Date.now).rule(Date.now);
            }).toThrow(errorMessage.for.rule.when.alreadyAdded);
        });
        it("5: regexp", () => {
            expect(() => {
                SB.string.regexp(/.^/).regexp(/.^/);
            }).toThrow(errorMessage.for.regexp.when.alreadyAdded);
        });
        it("6: toggle", () => {
            expect(() => {
                SB.boolean.toggle().toggle();
            }).toThrow(errorMessage.for.toggle.when.alreadyAdded);
        });
        it("7: increment", () => {
            expect(() => {
                SB.number.increment().increment();
            }).toThrow(errorMessage.for.increment.when.alreadyAdded);
        });
        it("8: decrement", () => {
            expect(() => {
                SB.number.decrement().decrement();
            }).toThrow(errorMessage.for.decrement.when.alreadyAdded);
        });
        it("9: props", () => {
            expect(() => {
                SB.object
                    .props({ id: { type: "string" } })
                    .props({ id: { type: "string" } });
            }).toThrow(errorMessage.for.props.when.alreadyAdded);
        });
        it("10: items", () => {
            expect(() => {
                SB.array
                    .items({ id: { type: "string" } })
                    .items({ id: { type: "string" } });
            }).toThrow(errorMessage.for.items.when.alreadyAdded);
        });
    });

    describe("If an argument passed to option has an invalid value type", () => {
        it("1: default", () => {
            expect(() => {
                SB.string.default(5);
            }).toThrow(errorMessage.for.default.when.invalidValue);
        });
        it("2: fn", () => {
            expect(() => {
                SB.string.fn(5);
            }).toThrow(errorMessage.for.fn.when.invalidValue);
        });
        it("3: rule", () => {
            expect(() => {
                SB.string.rule("hello");
            }).toThrow(errorMessage.for.rule.when.invalidValue);
        });
        it("4: props", () => {
            expect(() => {
                SB.object.props(42);
            }).toThrow(errorMessage.for.props.when.invalidValue);
        });
        it("5: items", () => {
            expect(() => {
                SB.array.items(42);
            }).toThrow(errorMessage.for.items.when.invalidValue);
        });
    });

    describe("If an argument passed to option with required 1 argument is undefined", () => {
        it("1: fn", () => {
            expect(() => {
                SB.number.fn();
            }).toThrow(errorMessage.for.fn.when.undefinedValue);
        });
        it("2: rule", () => {
            expect(() => {
                SB.string.rule();
            }).toThrow(errorMessage.for.rule.when.undefinedValue);
        });
        it("3: regexp", () => {
            expect(() => {
                SB.string.regexp();
            }).toThrow(errorMessage.for.regexp.when.undefinedValue);
        });
        it("4: props", () => {
            expect(() => {
                SB.object.props();
            }).toThrow(errorMessage.for.props.when.undefinedValue);
        });
        it("5: items", () => {
            expect(() => {
                SB.array.items();
            }).toThrow(errorMessage.for.items.when.undefinedValue);
        });
    });
});
