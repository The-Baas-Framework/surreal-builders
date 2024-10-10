# Surreal Builders

## Overview

**Surreal Builders** is a collection of TypeScript libraries designed to work with SurrealDB. The goal is to provide an intuitive, composable TypeScript API for interacting with SurrealDB. This will also sever as the typescript sdk for all typescript supported client

### Surreal Query (current work)

One of the key libraries in this repo is **surreal-query**, a TypeScript API that allows you to build queries dynamically with a fluent interface.

Example usage:

```typescript
const queryBuilder = new SurrealQuery('person', queryParams, user)
  .filter('age', 30)
  .sort('name')
  .limit(10);
```

This simple example demonstrates how to build queries in a flexible, composable manner for SurrealDB.

### Key Features:
- **Composable Queries**: Easily chain methods to build complex SURREALQL queries.
- **TypeScript Support**: Fully typed API to ensure type safety and autocompletion.
- **Fluent Interface**: Build queries using a clear, easy-to-read syntax.

## Project Status

Surreal Builders is currently in active development. The first versions of these libraries, including surreal-query, are being refined and will be released soon. Stay tuned!

## Get Involved

If you'd like to contribute, feel free to fork the repository, open issues, or suggest improvements. Contributions are welcome and encouraged!
