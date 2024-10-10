import SurrealTable from "../src/surrealTables";

describe("SurrealTable SDK", () => {
	let sdk: SurrealTable;

	beforeEach(() => {
		sdk = new SurrealTable({
			namespace: "my_namespace",
			database: "my_database",
		});
	});

	it("should generate a valid query for a simple table", () => {
		const query = sdk
			.create("users")
			.defineSchema({
				name: "string",
				age: "int",
				email: "string",
			})
			.generateQuery();

		expect(query).toBe(
			"DEFINE TABLE my_namespace.my_database.users SCHEMAFULL FIELDS name: string, age: int, email: string;"
		);
	});

	it("should throw an error for invalid record type format", () => {
		expect(() => {
			sdk.create("users").defineSchema({
				name: "string",
				company: "record()", // Invalid format
			});
		}).toThrow(
			"Invalid record type format for field 'company'. Expected 'record(tableName)'."
		);
	});

	it("should generate a query with complex types", () => {
		const query = sdk
			.create("users")
			.defineSchema({
				profile: "object",
				friends: "array",
				company: "record(companies)", // Valid record format
			})
			.generateQuery();

		expect(query).toBe(
			"DEFINE TABLE my_namespace.my_database.users SCHEMAFULL FIELDS profile: object, friends: array, company: record(companies);"
		);
	});
});
