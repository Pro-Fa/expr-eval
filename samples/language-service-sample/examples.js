// Example cases for the language service sample
const exampleCases = [
    {
        id: 'math',
        title: 'Mathematical Expression',
        description: 'Basic math operations with variables',
        expression: '(x + y) * multiplier + sqrt(16)',
        context: {
            x: 10,
            y: 5,
            multiplier: 3
        }
    },
    {
        id: 'arrays',
        title: 'Working with Arrays',
        description: 'Array functions like sum, min, max',
        expression: 'sum(numbers) + max(numbers) - min(numbers)',
        context: {
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            values: [15, 25, 35]
        }
    },
    {
        id: 'objects',
        title: 'Object Manipulation',
        description: 'Access nested object properties',
        expression: 'user.profile.score * level.multiplier + bonus.points',
        context: {
            user: {
                name: "Alice",
                profile: {
                    score: 85,
                    rank: "Gold"
                }
            },
            level: {
                current: 5,
                multiplier: 1.5
            },
            bonus: {
                points: 100,
                active: true
            }
        }
    },
    {
        id: 'map-filter',
        title: 'Map and Filter Functions',
        description: 'Transform and filter data with callbacks',
        expression: 'sum(\n  map(\n    f(x) = x * 2, \n    filter(\n      f(i) = i > threshold, \n      items\n    )\n  )\n) / length(items)',
        context: {
            items: [1, 2, 3, 4, 5, 6, 7, 8],
            threshold: 3
        }
    },
    {
        id: 'complex',
        title: 'Complex Objects',
        description: 'Work with deeply nested data structures',
        expression: 'length(company.departments[0].employees) * company.settings.bonusRate + sum(map(f(d) = d.budget, company.departments))',
        context: {
            company: {
                name: "TechCorp",
                departments: [
                    {
                        name: "Engineering",
                        budget: 500000,
                        employees: ["John", "Jane", "Bob"]
                    },
                    {
                        name: "Marketing",
                        budget: 200000,
                        employees: ["Alice", "Carol"]
                    }
                ],
                settings: {
                    bonusRate: 0.15,
                    fiscalYear: 2024
                }
            }
        }
    },
    {
        id: 'data-transform',
        title: 'Data Transformation',
        description: 'Flatten nested objects and transform rows',
        expression: "map(f(row) = {_id: row.rowId} + flatten(row.data, ''), $event)",
        context: {
            "$event": [
                {"rowId": 1, "state": "saved", "data": { "InventoryId": 1256, "Description": "Bal", "Weight": { "Unit": "g", "Amount": 120 } }},
                {"rowId": 2, "state": "new", "data": { "InventoryId": 2344, "Description": "Basket", "Weight": { "Unit": "g", "Amount": 300 } }},
                {"rowId": 3, "state": "unchanged", "data": { "InventoryId": 9362, "Description": "Wood", "Weight": { "Unit": "kg", "Amount": 18 } }}
            ]
        }
    },
    {
        id: 'diagnostics-demo',
        title: 'Diagnostics Demo',
        description: 'Shows error highlighting for incorrect function arguments',
        expression: '// Try functions with wrong argument counts:\n// pow() needs 2 args, random() needs 0-1 args\npow(2) + random(1, 2, 3)',
        context: {
            x: 5,
            y: 10
        }
    }
];
