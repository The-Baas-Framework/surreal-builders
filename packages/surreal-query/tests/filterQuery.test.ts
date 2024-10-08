import { SurrealQuery } from "../src/surrealQuery";

describe("SurrealQuery Class - Filter with Operators and OR Clauses", () => {
	it("should build a SELECT query with an OR clause", () => {
		const query = new SurrealQuery<any>("person")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 30) // Defaults to AND clause
			.filter("name", "John", "=", "OR") // OR clause
			.filter("status", "active");

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM person WHERE age = '30' AND name = 'John' OR status = 'active'"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a SELECT query with greater-than operator", () => {
		const query = new SurrealQuery<any>("person")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 30, ">") // Greater-than operator
			.filter("status", "active");

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM person WHERE age > '30' AND status = 'active'"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a SELECT query with multiple operators and OR clause", () => {
		const query = new SurrealQuery<any>("person")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 30, ">=") // Greater than or equal operator
			.filter("name", "John", "=", "OR") // OR clause
			.filter("status", "active", "!="); // Not equal operator

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM person WHERE age >= '30' AND name = 'John' OR status != 'active'"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a SELECT query with multiple OR clause", () => {
		const query = new SurrealQuery<any>("person")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 30, ">=", "OR") // Greater than or equal operator
			.filter("name", "John", "=", "OR") // OR clause
			.filter("status", "active", "!="); // Not equal operator

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM person WHERE age >= '30' OR name = 'John' OR status != 'active'"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a SELECT query with less-than operator and AND clauses", () => {
		const query = new SurrealQuery<any>("person")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 25, "<") // Less-than operator
			.filter("status", "single");

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM person WHERE age < '25' AND status = 'single'"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a SELECT query with OR clause without initial AND", () => {
		const query = new SurrealQuery<any>("person")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 30, ">", "OR")
			.filter("name", "John", "=");

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM person WHERE age > '30' OR name = 'John'"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should throw an error if an empty field is provided for filtering", () => {
		const query = new SurrealQuery<any>("person").setNamespaceAndDb(
			"test_namespace",
			"test_db"
		);

		expect(() => query.filter("" as keyof any, 30)).toThrowError(
			"Field for filtering cannot be empty"
		);
	});
});
