# surreal-query

A simple and flexible query builder library for surreal.

## Installation

To install the package, use npm or yarn:

```sh
npm install surreal-query
# or
yarn add surreal-query
```

### Currently supported features

-   Filter (with `AND` and `OR` where clause)
-   Sort
-   Limit
-   Table Creation Query

### Usage

Below is an example of how to use the `SurrealQuery` class.

`note docs for SurrealTable is coming soon`

```ts
import { SurrealQuery, SurrealTable } from "surreal-query";

// Define parameters
const queryParams = { namespace: "test", db_name: "test_db" };

// Create query builder
const queryBuilder = new SurrealQuery<any>("person")
	.setNamespaceAndDb("test_namespace", "test_db")
	.filter("age", 30) // Defaults to AND clause
	.filter("name", "John", "=", "OR") // OR clause
	.filter("status", "active");

// Get the query payload
const queryPayload = queryBuilder.getQueryPayload("SELECT");
console.log("Query payload:", queryPayload);
// "SELECT * FROM person WHERE age = '30' AND name = 'John' OR status = 'active'"

// You can now send `queryPayload` to your backend server via HTTP
await sendQueryToServer(queryPayload);

/**
 * Example function to send query payload to the server
 * @param {Object} payload - The payload containing the query, namespace, and db_name.
 * @param {string} url - The server URL to send the query to.
 * @returns {Promise<Object>} The response from the server.
 */
async function sendQueryToServer(payload, url) {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${payload.user?.token || ""}`, // Optional JWT token
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`Server error: ${response.statusText}`);
	}

	const result = await response.json();
	return result;
}
```

# License

This project is licensed under the MIT License. See the LICENSE file for details.
