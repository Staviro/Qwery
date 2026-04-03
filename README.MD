# Qwery.js

Qwery.js is a JavaScript library that allows a developer to add, get and update JSON data in a structured way on local storage. Qwery.js was built to be a simple NoSQL storage system for developers to use. It utilizes a memory cache to manage data operations and persists the state to LocalStorage.

---

## Information

- Author: Joseph Morukhuladi
- License: MIT
- Year: 2026

Note: Do not use qwery.js to store sensitive user information.

---

## Initialization Example

To start using Qwery, initialize the instance with a configuration object and call the asynchronous create() method to load the storage into memory.

```javascript
const qwery = new Qwery({
	name: "myAppDatabase",
	log: true // Enables console logging for operations
})

await qwery.create()
```

---

## Usage Examples

The following examples demonstrate how to use the core functions based on the library test suite.

### Adding Data

Add an object to a specific dataset. If the dataset does not exist, it is created automatically.

```javascript
const user = {id: "user_1", name: "John Doe"}

await qwery.add({
	dataset: "users",
	data: user
})
```

### Updating Data

Update existing records by matching a specific field and merging new data properties into the object.

```javascript
await qwery.update({
	dataset: "profile",
	field: "id",
	value: 1,
	data: {status: "online"} // This merges into the existing record
})
```

### Removing Data

Remove a specific record from a dataset based on a field value.

```javascript
await qwery.remove({
	dataset: "tasks",
	field: "tid",
	value: "A1"
})
```

---

## Public Functions

- create(): Initializes the storage and primes the memory cache from LocalStorage.
- json(): Returns the current state of the database from memory as an object.
- add(properties): Adds a single data object to a specified dataset. Requires 'dataset' and 'data'.
- get(properties): Retrieves data based on a filter function (predicate). Requires 'dataset' and 'predicate'.
- update(properties): Updates a record by merging new data into a matching item. Requires 'dataset', 'field', 'value', and 'data'.
- remove(properties): Deletes a specific record from a dataset. Requires 'dataset', 'field', and 'value'.
- removeAll(properties): Clears all data within a specific dataset but maintains the dataset entry. Requires 'dataset'.
- count(datasetName): Returns the number of records currently in a dataset.
- has(properties): Checks if a record exists in a dataset based on a field and value.
- truncate(): Clears all data across all datasets in the instance.
- reset(): Deletes the storage key from LocalStorage and clears the memory cache.
- uuid(): Generates a cryptographically secure UUID string.
- datasetExists(name): Checks if a dataset with the given name exists in storage.

---

## Links

- Library Code: [https://github.com/Staviro/Qwery/blob/main/content/lib/qwery.js](https://github.com/Staviro/Qwery/blob/main/content/lib/qwery.js)
- Unit Tests / Examples: [https://github.com/Staviro/Qwery/blob/main/content/js/tests/qwery.tests.js](https://github.com/Staviro/Qwery/blob/main/content/js/tests/qwery.tests.js)
- Public site: [https://iomushub.co.za/lib/qwery](https://iomushub.co.za/lib/qwery)
