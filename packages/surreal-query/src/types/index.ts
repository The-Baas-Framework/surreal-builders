export interface QueryParams {
	namespace?: string;
	db_name?: string;
}

export type FilterOperator = "=" | ">" | "<" | ">=" | "<=" | "!=";

export enum FieldAssert {
	REQUIRED_EMAIL = "ASSERT string::is::email($value);", // Ensures a valid email format
	POSITIVE_NUMBER = "ASSERT $value > 0;", // Asserts a number is positive
	NON_EMPTY_ARRAY = "ASSERT array::len($value) > 0;", // Ensures array is not empty
	ISO_COUNTRY_CODE = "ASSERT $value = /[A-Z]{3}/;", // ISO 3166 country code format
	MIN_LENGTH = "ASSERT string::len($value) >= 5;", // Example for minimum length requirement
	MAX_LENGTH = "ASSERT string::len($value) <= 255;", // Example for maximum length requirement
	ONLY_ALLOWED_VALUES = "ASSERT $value ALLINSIDE ['create', 'read', 'update', 'delete'];", // Restrict values to specific options
	REQUIRED_STRING = "ASSERT $value != NONE;", // Ensures a field is not empty or NONE
}

/**
 * Enum for specifying the database table type.
 */
export enum TABLETYPE {
	SCHEMAFULL = "SCHEMAFULL",
	SCHEMALESS = "SCHEMALESS",
}

export interface FilterCondition<T> {
	field: keyof T;
	operator?: FilterOperator;
	value: any;
	logicalOperator?: "AND" | "OR"; // Logical operator to combine conditions (AND by default)
}

export interface QueryPayload {
	namespace: string;
	db_name: string;
	query: string;
}

/**
 * TypeScript type representing the valid field types for SurrealDB schema.
 *
 * @typedef {('string' | 'int' | 'float' | 'bool' | 'datetime' | 'array' | 'object' | `record(${string})`)} SurrealFieldTypes
 */
export type SurrealFieldTypes =
	| "string"
	| "int"
	| "float"
	| "bool"
	| "datetime"
	| "array"
	| "object"
	| `record(${string})`;
