import { sendQueryToServer, SurrealQuery } from "./surrealQuery.js";
import SurrealTable from "./surrealTables.js";

export { sendQueryToServer, SurrealQuery, SurrealTable };

export type {
	QueryPayload,
	QueryParams,
	FilterOperator,
	FilterCondition,
} from "./types/index.ts";

// workinging
