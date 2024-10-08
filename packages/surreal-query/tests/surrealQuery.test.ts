import { SurrealQuery, sendQueryToServer } from "../src/surrealQuery";
import fetchMock from "fetch-mock";

describe("SurrealQuery Class", () => {
	afterEach(() => {
		fetchMock.restore();
	});

	it("should build a SELECT query with filters, sorting, and limits", () => {
		const query = new SurrealQuery<any>("any")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 30)
			.filter("name", "John Doe")
			.sort("name")
			.limit(10);

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM any WHERE age = '30' AND name = 'John Doe' ORDER BY name LIMIT 10"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a SELECT query with filters, sorting, and limits", () => {
		const query = new SurrealQuery<any>("any")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("age", 30)
			.sort("name")
			.limit(10);

		const queryPayload = query.getQueryPayload("SELECT");

		expect(queryPayload.query).toBe(
			"SELECT * FROM any WHERE age = '30' ORDER BY name LIMIT 10"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a CREATE query with data", () => {
		const query = new SurrealQuery("any")
			.setNamespaceAndDb("test_namespace", "test_db")
			.setData({ name: "John Doe", age: 30 });

		const queryPayload = query.getQueryPayload("CREATE");

		expect(queryPayload.query).toBe(
			'CREATE any CONTENT {"name":"John Doe","age":30}'
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build an UPDATE query with filters", () => {
		const query = new SurrealQuery<any>("any")
			.setNamespaceAndDb("test_namespace", "test_db")
			.setData({ age: 31 })
			.filter("id", "any123");

		const queryPayload = query.getQueryPayload("UPDATE");

		expect(queryPayload.query).toBe(
			"UPDATE any CONTENT {\"age\":31} WHERE id = 'any123'"
		);
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});

	it("should build a DELETE query with filters", () => {
		const query = new SurrealQuery<any>("any")
			.setNamespaceAndDb("test_namespace", "test_db")
			.filter("id", "any123");

		const queryPayload = query.getQueryPayload("DELETE");

		expect(queryPayload.query).toBe("DELETE FROM any WHERE id = 'any123'");
		expect(queryPayload.namespace).toBe("test_namespace");
		expect(queryPayload.db_name).toBe("test_db");
	});
});

describe("sendQueryToServer Function", () => {
	beforeEach(() => {
		fetchMock.restore();
	});

	it("should send the query to the server and return a result", async () => {
		// Mocking the response from the server
		const mockResult = {
			data: [{ id: "any123", name: "John Doe", age: 30 }],
		};

		fetchMock.post("https://example.com/api/run-query", {
			body: mockResult,
			headers: { "Content-Type": "application/json" },
		});

		// Prepare the query payload
		const queryPayload = {
			namespace: "test_namespace",
			db_name: "test_db",
			query: "SELECT * FROM any WHERE age = '30'",
		};

		// Send the query
		const result = await sendQueryToServer(
			queryPayload,
			"https://example.com/api/run-query"
		);

		// Validate the result
		expect(result).toEqual(mockResult);

		// Ensure the request was made with the correct payload and headers
		const lastCall = fetchMock.lastCall(
			"https://example.com/api/run-query"
		);

		if (!lastCall) {
			throw new Error("No request was made to the server");
		}

		expect(lastCall[1]?.headers).toEqual({
			"Content-Type": "application/json",
			Authorization: "Bearer ", // No token in this case
		});
		expect(lastCall[1]?.body).toBe(JSON.stringify(queryPayload));
	});

	it("should throw an error if the server returns a bad response", async () => {
		fetchMock.post("https://example.com/api/run-query", 500);

		const queryPayload = {
			namespace: "test_namespace",
			db_name: "test_db",
			query: "SELECT * FROM any WHERE age = '30'",
		};

		await expect(
			sendQueryToServer(queryPayload, "https://example.com/api/run-query")
		).rejects.toThrow("Server error: Internal Server Error");
	});
});
