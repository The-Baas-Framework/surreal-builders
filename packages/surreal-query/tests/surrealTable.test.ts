import { defineSchema, fieldType } from "../src/surrealTables";
import { TABLETYPE } from "../src/types";

describe("SurrealTable Schema SDK", () => {
	it("should generate a valid query for a simple table", () => {
		const query = defineSchema("users", TABLETYPE.SCHEMAFULL, {
			userId: fieldType.id("users"),
			firstName: fieldType.string(),
			lastName: fieldType.string(),
			downline: fieldType.array(fieldType.id("downlines")),
			upline: fieldType.id("customers"),
			bankName: fieldType.string(),
			accountName: fieldType.string(),
			accountNumber: fieldType.string(),
			metadata: fieldType.object(true), // Flexible object field
			payments: fieldType.array(fieldType.id("payments")),
			orders: fieldType.array(fieldType.id("orders")),
			earning: fieldType.number(),
			active: fieldType.boolean(),
			products: fieldType.optional(
				fieldType.array(fieldType.id("products"))
			),
		})
			.index("userId_index", "userId", true)
			.index("products_index", ["products", "active"])
			.generate();

		// console.log(query);

		// expect(query).toContain(
		// 	`DEFINE TABLE IF NOT EXISTS users SCHEMAFULL;
		// DEFINE FIELD userId ON TABLE users TYPE id REFERENCES TABLE users;
		// DEFINE FIELD firstName ON TABLE users TYPE string;
		// DEFINE FIELD lastName ON TABLE users TYPE string;
		// DEFINE FIELD downline ON TABLE users TYPE array<id>;
		// DEFINE FIELD upline ON TABLE users TYPE id REFERENCES TABLE customers;
		// DEFINE FIELD bankName ON TABLE users TYPE string;
		// DEFINE FIELD accountName ON TABLE users TYPE string;
		// DEFINE FIELD accountNumber ON TABLE users TYPE string;
		// DEFINE FIELD metadata ON TABLE users TYPE FLEXIBLE TYPE object;
		// DEFINE FIELD payments ON TABLE users TYPE array<id>;
		// DEFINE FIELD orders ON TABLE users TYPE array<id>;
		// DEFINE FIELD earning ON TABLE users TYPE number;
		// DEFINE FIELD active ON TABLE users TYPE boolean;
		// DEFINE FIELD products ON TABLE users TYPE array<id>;
		// DEFINE INDEX userId_index ON TABLE users FIELDS userId UNIQUE;
		// DEFINE INDEX products_index ON TABLE users FIELDS products, active;`
		// );
		expect(query).toContain("DEFINE TABLE IF NOT EXISTS users SCHEMAFULL;");
	});
});
