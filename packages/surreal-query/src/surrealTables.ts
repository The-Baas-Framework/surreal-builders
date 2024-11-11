enum TABLETYPE {
	SCHEMAFULL = "SCHEMAFULL",
	SCHEMALESS = "SCHEMALESS",
}

/**
 * Type definitions for different field types and options.
 */
export const fieldType = {
	/**
	 * Defines an ID field, optionally referencing another table.
	 * @param {string} [refTable] - The table that the ID references.
	 * @returns {FieldDefinition} - The field definition for an ID field.
	 */
	id: (refTable?: string) => ({ type: "id", refTable }),

	/**
	 * Defines a string field.
	 * @returns {FieldDefinition} - The field definition for a string field.
	 */
	string: () => ({ type: "string" }),

	/**
	 * Defines a number field.
	 * @returns {FieldDefinition} - The field definition for a number field.
	 */
	number: () => ({ type: "number" }),

	/**
	 * Defines a boolean field.
	 * @returns {FieldDefinition} - The field definition for a boolean field.
	 */
	boolean: () => ({ type: "boolean" }),

	/**
	 * Defines an array field with a specified item type.
	 * @param {FieldDefinition} itemType - The type of items in the array.
	 * @returns {FieldDefinition} - The field definition for an array field.
	 */
	array: (itemType: any) => ({ type: "array", itemType }),

	/**
	 * Defines an object field with optional flexibility.
	 * @param {boolean} [flexible=false] - Whether the object type should be flexible.
	 * @returns {FieldDefinition} - The field definition for an object field.
	 */
	object: (flexible: boolean = false) => ({ type: "object", flexible }),

	/**
	 * Marks a field as optional.
	 * @param {FieldDefinition} field - The field definition to make optional.
	 * @returns {FieldDefinition} - The modified field definition with optional flag.
	 */
	optional: (field: any) => ({ ...field, optional: true }),
};

type FieldDefinition = {
	type: string;
	refTable?: string;
	optional?: boolean;
	itemType?: any;
	flexible?: boolean;
};
type TableDefinition = { [fieldName: string]: FieldDefinition };

/**
 * Class for building a table definition with fields and indexes.
 */
class TableBuilder {
	private fields: string[] = [];
	private indexes: string[] = [];
	private table: string;
	private type: TABLETYPE;

	/**
	 * Initializes a TableBuilder with a table name and fields.
	 * @param {string} table - The name of the table to define.
	 * @param {TableDefinition} fields - The fields for the table.
	 */
	constructor(table: string, type: TABLETYPE, fields: TableDefinition) {
		this.table = table;
		this.type = type;
		this.buildFields(fields);
	}

	/**
	 * Processes the fields and prepares field definitions.
	 * @param {TableDefinition} fields - The fields for the table.
	 */
	private buildFields(fields: TableDefinition) {
		for (const [name, field] of Object.entries(fields)) {
			let type = field.type.trimEnd();
			if (field.optional) type = `option<${type.trimEnd()}>`;
			if (field.type === "array" && field.itemType) {
				type = `array<${field.itemType.type.trimEnd()}>`;
			}

			const ref = field.refTable
				? ` REFERENCES TABLE ${field.refTable}`
				: "";
			const flexibleType = field.flexible
				? "FLEXIBLE TYPE object"
				: type.trimEnd();
			this.fields.push(
				`DEFINE FIELD ${name} ON TABLE ${this.table} TYPE ${
					field.type === "object"
						? flexibleType.trimEnd()
						: type.trimEnd()
				}${ref.trimEnd()};`
			);
		}
	}

	/**
	 * Adds an index on a specific field of the table.
	 * @param {string} indexName - The name of the index.
	 * @param {string | [string]} fields - The field(s) to index.
	 * @param {boolean} [unique=false] - Specifies if the index is unique.
	 * @returns {this} - The TableBuilder instance for chaining.
	 *
	 * @example
	 * defineTable("users", { userId: v.id() })
	 *     .index("userId_index", "userId")
	 *     .index("unique_email", ["email", "sys"], true)
	 *     .generate();
	 */
	index(
		indexName: string,
		fields: string | string[],
		unique: boolean = false
	): this {
		const fieldList = Array.isArray(fields)
			? fields.join(", ")
			: fields.trimEnd();
		const uniqueStr = unique ? " UNIQUE" : "";
		this.indexes.push(
			`DEFINE INDEX ${indexName} ON TABLE ${this.table} FIELDS ${fieldList}${uniqueStr};`
		);
		return this;
	}

	/**
	 * Generates the full SurrealDB table definition query.
	 * @returns {string} - The generated query string.
	 */
	generate(): string {
		return `DEFINE TABLE IF NOT EXISTS ${this.table} ${
			this.type
		};\n${this.fields
			.map((field) => field.trim())
			.join("\n")}\n${this.indexes
			.map((index) => index.trim())
			.join("\n")}`;
	}
}

/**
 * Function to create a new TableBuilder instance for defining a table.
 *
 * @param {string} table - The name of the table to define.
 * @param {TABLETYPE} schemaType - The type of schema for the table.
 * @param {TableDefinition} fields - An object representing the fields and their types.
 * @returns {TableBuilder} - A new TableBuilder instance.
 *
 * @example
 * const query = defineSchema("users", TABLETYPE.SCHEMAFULL, {
 *     userId: fieldType.id("users"),
 *     firstName: fieldType.string(),
 *     lastName: fieldType.string(),
 *     downline: fieldType.array(fieldType.id("downlines")),
 *     upline: fieldType.id("customers"),
 *     bankName: fieldType.string(),
 *     accountName: fieldType.string(),
 *     accountNumber: fieldType.string(),
 *     metadata: fieldType.object(true), // Flexible object field
 *     payments: fieldType.array(fieldType.id("payments")),
 *     orders: fieldType.array(fieldType.id("orders")),
 *     earning: fieldType.number(),
 *     active: fieldType.boolean(),
 *     products: fieldType.optional(fieldType.array(fieldType.id("products"))),
 * })
 * .index("userId_index", "userId", true)
 * .index("products_index", ["products", "active"])
 * .generate();
 *
 * console.log(query);
 */
export function defineSchema(
	table: string,
	schemaType: TABLETYPE = TABLETYPE.SCHEMALESS,
	fields: TableDefinition
): TableBuilder {
	return new TableBuilder(table, schemaType, fields);
}
