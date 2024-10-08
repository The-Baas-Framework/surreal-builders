# surreal-query

A simple and flexible query builder library for surreal.

## Installation

To install the package, use npm or yarn:

```sh
npm install surreal-query
# or
yarn add surreal-query
```

### Usage

Below is an example of how to use the `SurrealQuery` class.

```ts
import { SurrealQuery } from "surreal-query";

// Define parameters
const queryParams = { namespace: "test", db_name: "test_db" };

// Create query builder
const queryBuilder = new SurrealQuery("person", queryParams, user)
	.filter("age", 30)
	.sort("name")
	.limit(10);

// Get the query payload
const queryPayload = queryBuilder.getQueryPayload("SELECT");
console.log("Query payload:", queryPayload);

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
