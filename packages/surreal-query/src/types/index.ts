export interface QueryParams {
    namespace?: string;
    db_name?: string;
  }
  
  export type FilterOperator = "=" | ">" | "<" | ">=" | "<=" | "!=";
  
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