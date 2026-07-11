"use strict"
/**
 * Qwery JS v2.0.0
 * (c) 2026 Joseph Morukhuladi
 * Licensed under MIT
 */

/**
 * Class for creating and managing a lightweight JSON document store with in-memory caching.
 */
class Qwery {
	/**
	 * Constructor for new Qwery object.
	 * @param {Object} config - The configuration settings.
	 * @param {string} config.name - The unique name of the storage instance.
	 * @param {boolean} [config.log=false] - Whether to enable console logging for operations.
	 */
	constructor(config) {
		this.configuration = {
			name: config.name,
			log: config.log ?? false,
			storage: config.storage ?? localStorage
		}
		/** @private */
		this._db = null
	}

	/**
	 * Initializes the Qwery storage and primes the memory cache.
	 * @returns {Qwery} The current Qwery instance.
	 */
	create() {
		const key = this._qweryKey()

		try {
			const raw = this.configuration.storage.getItem(key)
			if (raw === null) {
				this._db = {
					datasets: [],
					createdDateTime: new Date().toISOString()
				}
				this._persist()
				this._log("New Qwery storage created")
			} else {
				this._db = JSON.parse(raw)
				this._log("Qwery storage loaded into memory")
			}
			return this
		} catch (e) {
			console.error("Qwery: Initialization failed", e);
			this.configuration.storage.removeItem(key);
			this._db = {
				datasets: [],
				createdDateTime: new Date().toISOString()
			};
			this._persist();
			return this
		}
	}

	_getDataset(name) {
		if (!this._db) return null;
		return this._db.datasets.find((x) => x.dataset === name)
	}

	/**
	 * Returns the current state of the database from memory.
	 * @returns {Object|null}
	 */
	json() {
		return this._db
	}

	/**
	 * Deletes the storage key from LocalStorage and clears memory.
	 * @returns {Promise<Qwery>}
	 */
	reset() {
		this.configuration.storage.removeItem(this._qweryKey())
		this._db = null
		this._log("Storage reset and memory cleared")
		return this
	}

	/**
	 * Generates a cryptographically secure UUID.
	 * @returns {string}
	 */
	uuid() {
		return crypto.randomUUID()
	}

	/**
	 * Checks if a dataset exists in storage.
	 * @param {string} name
	 * @returns {boolean}
	 */
	datasetExists(name) {
		if (!this._db) return false
		return this._db.datasets.some((x) => x.dataset === name)
	}

	/** @private */
	_log(msg) {
		if (this.configuration.log)
			console.log(`Qwery [${this.configuration.name}]: ${msg}`)
	}

	/** @private */
	_persist() {
		try {
			this.configuration.storage.setItem(this._qweryKey(), JSON.stringify(this._db))
		} catch (e) {
			console.error("Qwery: Persist to LocalStorage failed", e)
		}
	}

	/** @private */
	_qweryKey() {
		return "qwery." + this.configuration.name
	}

	/**
	 * Creates a new QueryBuilder for the specified collection.
	 * @param {string | Array<any>} collection
	 * @returns {QueryBuilder}
	 */
	query(collection) {
		if (!this._db)
			throw new Error("Call create() before querying.");

		return new QueryBuilder(this, collection);
	}

	/**
	 * Clears all data across all datasets but maintains the instance.
	 */
	truncate() {
		if (!this._db) return
		this._db.datasets.forEach((ds) => (ds.data = []))
		this._persist()
		this._log("Truncated all datasets")
	}

}


/**
 * QueryBuilder class for building queries
 * @private
 */
class QueryBuilder {
	constructor(qwery, collection) {
		this._qwery = qwery;
		this._collection = collection;
		this._data = this._getCollection(collection);
	}

	_getCollection(collection) {
		if (typeof collection === "string") {
			const dataset = this._qwery._db.datasets.find(
				x => x.dataset === collection
			);

			this._data = [...(dataset?.data ?? [])];
			return this._data;
		}

		if (Array.isArray(collection)) {
			this._data = [...collection];
			return this._data;
		}

		return [];
	}

	where(func) {
		this._data = this._data?.filter(func) ?? [];
		return this;
	}

	find(func) {
		return this._data.find(func) ?? null;
	}

	delete(func) {
		const before = this._data.length;
		this._data = this._data?.filter(x => !func(x)) ?? [];
		const dataset = this._qwery._getDataset(this._collection);
		if (dataset) {
			dataset.data = this._data;
		}
		this._qwery._persist();
		return {
			affectedRows: before - this._data.length,
			qwery: this._qwery
		};
	}

	update(predicate, updatedData) {
		let affected = 0;
		this._data = this._data.map(item => {
			if (!predicate(item))
				return item;
			affected++;
			return {
				...item,
				...updatedData
			};
		});

		const dataset = this._qwery._getDataset(this._collection);
		if (dataset)
			dataset.data = this._data;
		this._qwery._persist();
		return {
			affectedRows: affected,
			qwery: this._qwery
		};
	}

	add(data) {
		const dataset = this._qwery._getDataset(this._collection);
		if (dataset) {
			if (Array.isArray(data)) {
				dataset.data.push(...data);
			}
			else {
				dataset.data.push(data);
			}
		}
		else {
			this._qwery._db.datasets.push({
				dataset: this._collection,
				data: Array.isArray(data) ? data : [data]
			});
		}
		const affected = Array.isArray(data)
			? data.length
			: 1;

		this._qwery._persist();
		return {
			affectedRows: affected,
			qwery: this._qwery
		};
	}

	orderBy(selector) {
		this._data.sort((a, b) => {
			const left = selector(a);
			const right = selector(b);

			if (left < right) return -1;
			if (left > right) return 1;
			return 0;
		});

		return this;
	}

	orderByDesc(selector) {
		this._data.sort((a, b) => {
			const left = selector(a);
			const right = selector(b);
			if (left < right) return 1;
			if (left > right) return -1;
			return 0;
		});

		return this;
	}

	distinct(selector) {
		const seen = new Set();
		this._data = this._data.filter(item => {
			const key = selector(item);
			if (seen.has(key))
				return false;
			seen.add(key);
			return true;
		});
		return this;
	}

	take(count) {
		this._data = this._data.slice(0, count);
		return this;
	}

	skip(count) {
		this._data = this._data.slice(count);
		return this;
	}

	page(page, pageSize) {
		const start = (page - 1) * pageSize;
		const end = start + pageSize;
		this._data = this._data.slice(start, end);
		return this;
	}

	select(func) {
		this._data = this._data.map(func);
		return this;
	}

	first() {
		return this._data[0] ?? null;
	}

	last() {
		return this._data[this._data.length - 1] ?? null;
	}

	get() {
		return this._data;
	}

	count() {
		return this._data.length;
	}

	any() {
		return this._data.length > 0;
	}

	empty() {
		return this._data.length === 0;
	}

	clear() {
		this._data = [];
		const dataset = this._qwery._getDataset(this._collection);
		let count = 0;
		if (dataset) {
			count = dataset.data.length;
			dataset.data = this._data;
		}
		this._qwery._persist();
		return {
			affectedRows: count,
			qwery: this._qwery
		};
	}
}