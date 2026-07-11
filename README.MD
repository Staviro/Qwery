# Qwery.js

Qwery.js is a lightweight JavaScript document database with a fluent query API and configurable storage providers.

It provides a simple way to store, query, and manage JSON documents using an in-memory cache for fast operations while automatically persisting changes to a storage provider such as `localStorage` or `sessionStorage`.

Qwery was designed to feel familiar to JavaScript developers by embracing callback-based querying rather than SQL-like syntax.

> **Note:** Qwery is intended for client-side application data. Do not store sensitive or confidential user information.

---

## Features

- Lightweight with zero dependencies
- Fluent, chainable query API
- In-memory caching for improved performance
- Automatic persistence to a configurable storage provider
- Supports `localStorage`, `sessionStorage`, or custom storage adapters
- Automatic dataset creation
- CRUD operations
- Ordering, filtering, paging, projections, and distinct queries
- MIT Licensed

---

## Information

| Property | Value |
|----------|-------|
| Author | Joseph Morukhuladi |
| License | MIT |
| Version | 2.0.0 |
| Year | 2026 |

---

# Getting Started

## Installation

Include the library.

```html
<script src="qwery.js"></script>
```

---

## Initialization

```javascript
const qwery = new Qwery({
    name: "myAppDatabase",
    log: true
});

qwery.create();
```

### Using Session Storage

```javascript
const qwery = new Qwery({
    name: "mySessionDatabase",
    storage: sessionStorage
});

qwery.create();
```

---

# CRUD Operations

## Add

```javascript
qwery
    .query("users")
    .add({
        id: qwery.uuid(),
        name: "John Doe",
        age: 28
    });
```

Add multiple records.

```javascript
qwery
    .query("users")
    .add([
        {
            id: 1,
            name: "John"
        },
        {
            id: 2,
            name: "Sarah"
        }
    ]);
```

---

## Find

Returns the first matching record.

```javascript
const user = qwery
    .query("users")
    .find(x => x.id === 1);
```

---

## Update

Updates all matching records.

```javascript
qwery
    .query("users")
    .update(
        x => x.id === 1,
        {
            online: true
        }
    );
```

---

## Delete

```javascript
qwery
    .query("users")
    .delete(x => x.id === 1);
```

---

## Clear a Dataset

```javascript
qwery
    .query("users")
    .clear();
```

---

# Query Examples

## Filter Records

```javascript
const adults = qwery
    .query("users")
    .where(x => x.age >= 18)
    .get();
```

---

## Order Results

```javascript
const users = qwery
    .query("users")
    .orderBy(x => x.age)
    .get();
```

Descending order.

```javascript
const users = qwery
    .query("users")
    .orderByDesc(x => x.age)
    .get();
```

---

## Select Specific Fields

```javascript
const users = qwery
    .query("users")
    .select(x => ({
        id: x.id,
        name: x.name
    }))
    .get();
```

---

## Distinct

```javascript
const countries = qwery
    .query("users")
    .distinct(x => x.country)
    .get();
```

---

## Paging

```javascript
const page = qwery
    .query("users")
    .page(2, 10)
    .get();
```

Equivalent to records 11–20.

---

## Skip / Take

```javascript
const users = qwery
    .query("users")
    .skip(10)
    .take(5)
    .get();
```

---

## First / Last

```javascript
const first = qwery
    .query("users")
    .first();

const last = qwery
    .query("users")
    .last();
```

---

## Count

```javascript
const count = qwery
    .query("users")
    .count();
```

---

## Any

```javascript
const hasUsers = qwery
    .query("users")
    .any();
```

---

## Empty

```javascript
const isEmpty = qwery
    .query("users")
    .empty();
```

---

# Database Functions

## Current Database

```javascript
const json = qwery.json();
```

---

## Check if a Dataset Exists

```javascript
const exists = qwery.datasetExists("users");
```

---

## Truncate Database

Removes all records from every dataset while preserving the database.

```javascript
qwery.truncate();
```

---

## Reset Database

Deletes the storage and clears the in-memory cache.

```javascript
qwery.reset();
```

---

## Generate UUID

```javascript
const id = qwery.uuid();
```

---

# Public API

## Qwery

| Method | Description |
|---------|-------------|
| `create()` | Initializes the database and loads it into memory. |
| `query(collection)` | Creates a new query builder for a dataset. |
| `json()` | Returns the in-memory database. |
| `truncate()` | Removes all records from every dataset. |
| `reset()` | Deletes the persisted database and clears memory. |
| `uuid()` | Generates a cryptographically secure UUID. |
| `datasetExists(name)` | Determines whether a dataset exists. |

---

## QueryBuilder

| Method | Description |
|---------|-------------|
| `add(data)` | Adds one or more records. |
| `where(predicate)` | Filters records. |
| `find(predicate)` | Returns the first matching record. |
| `update(predicate, data)` | Updates matching records. |
| `delete(predicate)` | Deletes matching records. |
| `clear()` | Removes every record from the dataset. |
| `orderBy(selector)` | Sorts ascending. |
| `orderByDesc(selector)` | Sorts descending. |
| `distinct(selector)` | Returns distinct records based on a selector. |
| `select(selector)` | Projects records into a new shape. |
| `skip(count)` | Skips records. |
| `take(count)` | Takes records. |
| `page(page, pageSize)` | Returns a page of results. |
| `first()` | Returns the first record. |
| `last()` | Returns the last record. |
| `get()` | Returns the current query results. |
| `count()` | Returns the number of records. |
| `any()` | Returns `true` if records exist. |
| `empty()` | Returns `true` if no records exist. |

---

# Storage Providers

By default, Qwery persists data to `localStorage`.

You can also provide any object that implements the Web Storage API.

```javascript
const qwery = new Qwery({
    name: "myDatabase",
    storage: sessionStorage
});
```

Custom storage providers must implement:

- `getItem(key)`
- `setItem(key, value)`
- `removeItem(key)`

---

# Links

- **GitHub:** https://github.com/Staviro/Qwery
- **Library:** https://github.com/Staviro/Qwery/blob/main/content/lib/qwery.js
- **Unit Tests:** https://github.com/Staviro/Qwery/blob/main/content/js/tests/qwery.tests.js
- **Documentation:** https://iomushub.co.za/lib/qwery