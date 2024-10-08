import { QueryParams, FilterOperator, QueryPayload } from "./types/index.js";

/**
 * Example usage of SurrealQuery class.
 *
 * @example
 * // Define parameters
 * const queryParams = { namespace: 'test', db_name: 'test_db' };
 *
 * // Create query builder
 * const queryBuilder = new SurrealQuery('person', queryParams, user)
 *     .filter('age', 30)
 *     .sort('name')
 *     .limit(10);
 *
 * // Get the query payload
 * const queryPayload = queryBuilder.getQueryPayload('SELECT');
 * console.log('Query payload:', queryPayload);
 *
 * // You can now send `queryPayload` to your backend server via HTTP
 * await sendQueryToServer(queryPayload);
 *
 * @param {Object} payload - The payload containing the query, namespace, and db_name.
 * @returns {Promise<Object>} The response from the server.
 *
 * @example
 * // Example function to send query payload to the server
 * async function sendQueryToServer(payload, url) {
 *     const response = await fetch(url, {
 *         method: 'POST',
 *         headers: {
 *             'Content-Type': 'application/json',
 *             Authorization: `Bearer ${payload.user?.token || ''}`, // Optional JWT token
 *         },
 *         body: JSON.stringify(payload),
 *     });
 *
 *     if (!response.ok) {
 *         throw new Error(`Server error: ${response.statusText}`);
 *     }
 *
 *     const result = await response.json();
 *     return result;
 * }
 */
export class SurrealQuery<T> {
  private table: string;
  private filters: string[] = [];
  private sortField?: string;
  private limitCount?: number;
  private namespace?: string;
  private db_name?: string;
  private data?: Partial<T>;
  /**
   * Creates a new instance of SurrealQuery.
   *
   * @param {string} table - The name of the table to query.
   * @param {QueryParams} [params] - The namespace and database name.
   */
  constructor(table: string, { namespace, db_name }: QueryParams = {}) {
    if (!table) throw new Error("Table name cannot be empty");

    this.table = table;
    this.namespace = namespace;
    this.db_name = db_name;
  }

  /**
   * Set or update the namespace and database name dynamically.
   *
   * @param {string} namespace - The namespace of the database.
   * @param {string} db_name - The name of the database.
   * @returns {SurrealQuery} The current instance for chaining.
   */
  setNamespaceAndDb(namespace: string, db_name: string): this {
    if (!namespace) throw new Error("Namespace cannot be empty");
    if (!db_name) throw new Error("Database name cannot be empty");
    this.namespace = namespace;
    this.db_name = db_name;
    return this;
  }

  /**
   * Set or update the database name dynamically.
   *
   * @param {string} db_name - The name of the database.
   * @returns {SurrealQuery} The current instance for chaining.
   */
  setDb(db_name: string): this {
    if (!db_name) throw new Error("Database name cannot be empty");
    this.db_name = db_name;
    return this;
  }

  /**
   * Set or update the namespace dynamically.
   *
   * @param {string} namespace - The name of the database.
   * @returns {SurrealQuery} The current instance for chaining.
   */
  setNamespace(namespace: string): this {
    if (!namespace) throw new Error("Namespace cannot be empty");
    this.namespace = namespace;
    return this;
  }

  /**
   * Add a filter condition to the query.
   *
   * @param {keyof T} field - The field to filter by.
   * @param {*} value - The value to match for the filter.
   * @param {FilterOperator} [operator='='] - The operator to use (default is '=').
   * @param {string} [logicalOperator='AND'] - The logical operator (AND/OR) to use between conditions.
   * @returns {SurrealQuery} The current instance for chaining.
   */
  filter(
    field: keyof T,
    value: any,
    operator: FilterOperator = "=",
    logicalOperator?: "AND" | "OR"
  ): this {
    if (!field) throw new Error("Field for filtering cannot be empty");

    if (logicalOperator) {
      this.filters.push(
        `${String(field)} ${operator} '${value}' ${logicalOperator}`
      );
    } else {
      this.filters.push(`${String(field)} ${operator} '${value}' AND`);
    }

    return this;
  }

  /**
   * Add a sort condition to the query.
   *
   * @param {keyof T} field - The field to sort by.
   * @returns {SurrealQuery} The current instance for chaining.
   */
  sort(field: keyof T): this {
    if (!field) throw new Error("Field for sorting cannot be empty");
    this.sortField = `${String(field)}`;
    return this;
  }

  /**
   * Set a limit for the query results.
   *
   * @param {number} count - The maximum number of results to return.
   * @returns {SurrealQuery} The current instance for chaining.
   */
  limit(count: number): this {
    if (count <= 0) throw new Error("Limit must be greater than zero");
    this.limitCount = count;
    return this;
  }

  /**
   * Set the data for CREATE or UPDATE operations.
   *
   * @param {Partial<T>} data - The data to insert or update.
   * @returns {SurrealQuery} The current instance for chaining.
   */
  setData(data: Partial<T>): this {
    this.data = data;
    return this;
  }

  private cleanFilters(filter: string) {
    // Use regular expression to find the last occurrence of "AND" or "OR"
    const match = filter.match(/(AND|OR)$/);

    if (match) {
      // If found, remove the last "AND" or "OR"
      return filter.slice(0, -match[0].length).trimEnd();
    }

    return filter;
  }

  /**
   * Build the query based on the specified operation.
   *
   * @param {'SELECT' | 'CREATE' | 'UPDATE' | 'DELETE'} operation - The type of operation.
   * @returns {string} The built SurrealQL query.
   */
  buildQuery(operation: "SELECT" | "CREATE" | "UPDATE" | "DELETE"): string {
    if (!this.namespace || !this.db_name) {
      throw new Error(
        "Namespace and Database must be provided before building a query"
      );
    }

    let query = "";

    switch (operation) {
      case "SELECT":
        query = `SELECT * FROM ${this.table}`;
        if (this.filters.length > 0) {
          let q = ` WHERE ${this.filters.join(" ")}`;
          query += this.cleanFilters(q);
        }
        if (this.sortField) {
          query += ` ORDER BY ${this.sortField}`;
        }
        if (this.limitCount) {
          query += ` LIMIT ${this.limitCount}`;
        }
        break;

      case "CREATE":
        if (!this.data)
          throw new Error("No data provided for CREATE operation");
        query = `CREATE ${this.table} CONTENT ${JSON.stringify(this.data)}`;
        break;

      case "UPDATE":
        if (!this.data)
          throw new Error("No data provided for UPDATE operation");
        query = `UPDATE ${this.table} CONTENT ${JSON.stringify(this.data)}`;
        if (this.filters.length > 0) {
          let q = ` WHERE ${this.filters.join(" ")}`;
          query += this.cleanFilters(q);
        }
        break;

      case "DELETE":
        query = `DELETE FROM ${this.table}`;
        if (this.filters.length > 0) {
          let q = ` WHERE ${this.filters.join(" ")}`;
          query += this.cleanFilters(q);
        }
        break;

      default:
        throw new Error("Invalid operation");
    }

    return query;
  }

  /**
   * Return the full query payload with namespace, and database name.
   *
   * @param {'SELECT' | 'CREATE' | 'UPDATE' | 'DELETE'} operation - The type of operation.
   * @returns {QueryPayload} The payload containing the query, namespace, and db_name.
   */
  getQueryPayload(
    operation: "SELECT" | "CREATE" | "UPDATE" | "DELETE"
  ): QueryPayload {
    const query = this.buildQuery(operation);

    if (!this.namespace || !this.db_name) {
      throw new Error(
        "Namespace and Database must be provided before building a query"
      );
    }

    return {
      namespace: this.namespace,
      db_name: this.db_name,
      query,
    };
  }
}

/**
 * Sends a query payload to the backend server.
 *
 * @param {Object} payload - The payload containing the query, namespace, and db_name.
 * @param {string} url - The URL of the backend server.
 * @returns {Promise<Object>} The response from the server.
 */
export async function sendQueryToServer(
  payload: any,
  url: string
): Promise<any> {
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
