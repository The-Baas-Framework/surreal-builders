import { SurrealFieldTypes } from "./types/index.js";

/**
 * Class to create a SurrealDB table query with schema definition and validation.
 *
 * @example
 * // Initialize SurrealTable SDK
 * const sdk = new SurrealTable({ namespace: 'my_namespace', database: 'my_database' });
 *
 * // Define a new table with schema
 * const query = sdk.create('users')
 *   .defineSchema({
 *     name: 'string',
 *     email: 'string',
 *     age: 'int',
 *     company: 'record(companies)',
 *     friends: 'array',
 *   })
 *   .generateQuery();
 *
 * console.log(query);
 * // Outputs: DEFINE TABLE my_namespace.my_database.users SCHEMAFULL FIELDS name: string, email: string, age: int, company: record(companies), friends: array;
 */
class SurrealTable {
	private namespace: string;
	private database: string;

	/**
	 * Initializes the SurrealTable SDK.
	 *
	 * @param {Object} options - The options for namespace and database.
	 * @param {string} options.namespace - The namespace to be used for the table.
	 * @param {string} options.database - The database to be used for the table.
	 */
	constructor({
		namespace,
		database,
	}: {
		namespace: string;
		database: string;
	}) {
		this.namespace = namespace;
		this.database = database;
	}

	/**
	 * Creates a new table query.
	 *
	 * @param {string} tableName - The name of the table to be created.
	 * @returns {TableQuery} - Returns an instance of TableQuery to define the schema.
	 */
	create(tableName: string) {
		return new TableQuery(this.namespace, this.database, tableName);
	}
}

/**
 * Class to define and validate a table schema for SurrealDB.
 * Initializes the TableQuery.
 *
 * @param {string} namespace - The namespace to be used for the table.
 * @param {string} database - The database to be used for the table.
 * @param {string} tableName - The name of the table being defined.
 */

export class TableQuery {
	private namespace: string;
	private database: string;
	private tableName: string;
	private schemaFields: string[] = [];

	/**
	 * Initializes the TableQuery.
	 *
	 * @param {string} namespace - The namespace to be used for the table.
	 * @param {string} database - The database to be used for the table.
	 * @param {string} tableName - The name of the table being defined.
	 */
	constructor(namespace: string, database: string, tableName: string) {
		this.namespace = namespace;
		this.database = database;
		this.tableName = tableName;
	}

	/**
	 * Define the schema for the table with validation.
	 *
	 * @param {Record<string, SurrealFieldTypes>} fields - An object that maps field names to their SurrealDB field types.
	 * @returns {TableQuery} - Returns the instance of TableQuery to allow chaining.
	 *
	 * @throws {Error} - Throws an error if a `record` type is incorrectly formatted.
	 *
	 * @example
	 * const tableQuery = sdk.create('users')
	 *   .defineSchema({
	 *     name: 'string',
	 *     email: 'string',
	 *     company: 'record(companies)',  // Valid record syntax
	 *   })
	 *   .generateQuery();
	 */
	defineSchema(fields: Record<string, SurrealFieldTypes>) {
		Object.entries(fields).forEach(([key, type]) => {
			// Validation for `record` type to ensure it includes the correct format
			if (type.startsWith("record")) {
				if (!/^record\(\w+\)$/.test(type)) {
					throw new Error(
						`Invalid record type format for field '${key}'. Expected 'record(tableName)'.`
					);
				}
			}

			// Add the valid field to the schema
			this.schemaFields.push(`${key}: ${type}`);
		});
		return this;
	}

	/**
	 * Generate the query string for the defined schema.
	 *
	 * @returns {string} - The query string to be sent to SurrealDB.
	 *
	 * @example
	 * const query = sdk.create('users')
	 *   .defineSchema({
	 *     name: 'string',
	 *     email: 'string',
	 *     age: 'int',
	 *   })
	 *   .generateQuery();
	 *
	 * console.log(query);
	 * // Outputs: DEFINE TABLE my_namespace.my_database.users SCHEMAFULL FIELDS name: string, email: string, age: int;
	 */
	generateQuery() {
		const schema = this.schemaFields.join(", ");
		return `DEFINE TABLE ${this.namespace}.${this.database}.${this.tableName} SCHEMAFULL FIELDS ${schema};`;
	}
}

export default SurrealTable;
