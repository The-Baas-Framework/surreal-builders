import { sendQueryToServer, SurrealQuery } from "./surrealQuery.js";
import {defineSchema} from "./surrealTables.js";

export { sendQueryToServer, SurrealQuery, defineSchema };

export type {
	QueryPayload,
	QueryParams,
	FilterOperator,
	FilterCondition,
	TABLETYPE
} from "./types/index.ts";

// workinging
