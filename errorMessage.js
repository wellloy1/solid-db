export const errorMessage = {
    for: {
        null: {
            when: {
                alreadyAdded: `You have been already added a 'null' option`,
                defaultAdded: `You have specified a 'default' option. You cannot use 'null' and 'default' together.`,
            },
        },
        default: {
            when: {
                alreadyAdded: `You have been already added a 'default' option`,
                nullAdded: `You have specified a 'null' option. You cannot use 'default' and 'null' together.`,
                invalidValue: `Type of the value passed to 'default' option doesn't match the 'type'.`,
            },
        },
        fn: {
            when: {
                alreadyAdded: `You have been already added an 'fn' option`,
                undefinedValue: `Option 'fn' required one argument which is a function returning a value of a specified 'type'.`,
                invalidValue: `Argument for the 'fn' option should be a 'function'.`,
            },
        },
        rule: {
            when: {
                alreadyAdded: `You have been already added a 'rule' option`,
                undefinedValue: `Option 'rule' required one argument which is a function returning true or false.`,
                invalidValue: `Argument for the 'rule' option should be a 'function'.`,
            },
        },
        regexp: {
            when: {
                notApplicable: `The 'regexp' option is applicable for the 'string' type.`,
                alreadyAdded: `You have been already added a 'regexp' option`,
                undefinedValue: `Option 'regexp' required one argument which is a valid RegExp expression.`,
                invalidValue: `You have been provided an invalid RegExp expression for the 'regexp' option.`,
            },
        },
        toggle: {
            when: {
                notApplicable: `The 'toggle' option is applicable for the 'boolean' type.`,
                alreadyAdded: `You have been already added a 'toggle' option`,
            },
        },
        increment: {
            when: {
                notApplicable: `The 'increment' option is applicable for the 'number'/'bigint' type.`,
                alreadyAdded: `You have been already added an 'increment' option`,
                decrementAdded: `You have specified a 'decrement' option. You cannot use 'increment' and 'decrement' together.`,
            },
        },
        decrement: {
            when: {
                notApplicable: `The 'decrement' option is applicable for the 'number'/'bigint' type.`,
                alreadyAdded: `You have been already added a 'decrement' option`,
                incrementAdded: `You have specified a 'increment' option. You cannot use 'decrement' and 'increment' together.`,
            },
        },
        props: {
            when: {
                notApplicable: `The 'props' option is applicable for the 'object' type.`,
                alreadyAdded: `You have been already added a 'props' option`,
                undefinedValue: `Option 'props' required one argument which is a valid SB.object schema.`,
                invalidValue: `The 'props' option must be a type of 'object' which is a valid SB schema.`,
            },
        },
        items: {
            when: {
                notApplicable: `The 'items' option is applicable for the 'array' type.`,
                alreadyAdded: `You have been already added a 'items' option`,
                undefinedValue: `Option 'items' required one argument which is a valid SB schema.`,
                invalidValue: `The 'items' option must be a type of 'object' which is a valid SB schema.`,
            },
        },
        pk: {
            when: {
                notApplicable: `The 'pk' option is applicable for the 'schema' type.`,
                alreadyAdded: `You have been already added a 'pk' option`,
                undefinedValue: `Option 'pk' required one argument which is an 'array' of keys or 'string' with keys separated by spaces.`,
                invalidValue: `The 'pk' option must be an 'array' of keys or 'string' with keys separated by spaces.`,
                invalidKey: (key) =>
                    `The primary key ('${key}') that you specified does not exist in the current schema.`,
            },
        },
        extra: {
            when: {
                notApplicable: `The 'extra' option is applicable for the 'schema' type.`,
                alreadyAdded: `You have been already added an 'extra' option`,
            },
        },
    },
};
