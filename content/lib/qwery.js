"use strict"
/**
 * Qwery JS v1.0.0
 * (c) 2026 Joseph Morukhuladi
 * Licensed under MIT
 */

/**
 * Class for creating and managing a lightweight JSON storage in LocalStorage with memory caching.
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
			log: config.log ?? false
		}
		/** @private */
		this._db = null
	}

	/**
	 * Internal library messages.
	 * @private
	 */
	messages = {
		dataRequired: "'data' key is required",
		datasetRequired: "'dataset' key is required",
		notCreated: "Qwery object has not been created. Run create() first.",
		notFound: "Record not found in the dataset."
	}

	/**
	 * Initializes the Qwery storage and primes the memory cache.
	 * @returns {Promise<Qwery>} The current Qwery instance.
	 */
	async create() {
		try {
			const key = this._qweryKey()
			const raw = localStorage.getItem(key)
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
			console.error("Qwery: Initialization failed", e)
			return this
		}
	}

	/**
	 * Returns the current state of the database from memory.
	 * @returns {Object|null}
	 */
	json() {
		return this._db
	}

	/**
	 * Adds a single item to a dataset. Creates the dataset if it doesn't exist.
	 * @param {Object} properties
	 * @param {string} properties.dataset - The name of the target dataset.
	 * @param {Object} properties.data - The data object to add.
	 * @returns {Promise<{isSuccess: boolean, message: string}>}
	 */
	async add(properties) {
		try {
			if (!this._db) throw new Error(this.messages.notCreated)
			if (!properties.data || Object.keys(properties.data).length === 0)
				return {isSuccess: false, message: this.messages.dataRequired}
			if (!properties.dataset)
				return {isSuccess: false, message: this.messages.datasetRequired}

			let dataset = this._db.datasets.find(
				(x) => x.dataset === properties.dataset
			)
			if (!dataset) {
				dataset = {dataset: properties.dataset, data: []}
				this._db.datasets.push(dataset)
			}

			dataset.data.push(properties.data)
			this._persist()
			this._log(`1 item added to ${properties.dataset}`)
			return {isSuccess: true, message: "Successfully added item"}
		} catch (e) {
			return {isSuccess: false, message: e.message}
		}
	}

	/**
	 * Retrieves data based on a filter function.
	 * Returns an array if multiple matches are found.
	 * @param {Object} properties
	 * @param {string} properties.dataset - The name of the dataset to search.
	 * @param {Function} [properties.predicate] - A filter function: (item) => boolean.
	 * @returns {Promise<Object|Array|null>}
	 */
	async get(properties) {
		try {
			if (!this._db) return null
			const dataset = this._db.datasets.find(
				(x) => x.dataset === properties.dataset
			)
			if (!dataset) return null

			let results = properties.predicate
				? dataset.data.filter(properties.predicate)
				: dataset.data

			this._log(`${results.length} item(s) fetched from ${properties.dataset}`)

			if (results.length === 0) return null
			return results
		} catch (e) {
			console.error("Qwery: Get operation failed", e)
			return null
		}
	}

	/**
	 * Updates a record in a dataset by merging new data.
	 * @param {Object} properties
	 * @param {string} properties.dataset - Target dataset.
	 * @param {string} properties.field - The key used to find the record.
	 * @param {any} properties.value - The value to match for the field.
	 * @param {Object} properties.data - The new data to merge into the record.
	 * @returns {Promise<{isSuccess: boolean, message: string}>}
	 */
	async update(properties) {
		try {
			if (!this._db) throw new Error(this.messages.notCreated)
			const dataset = this._db.datasets.find(
				(x) => x.dataset === properties.dataset
			)
			if (!dataset) return {isSuccess: false, message: "Dataset not found"}

			const index = dataset.data.findIndex(
				(item) => item[properties.field] === properties.value
			)
			if (index === -1)
				return {isSuccess: false, message: this.messages.notFound}

			dataset.data[index] = {...dataset.data[index], ...properties.data}
			this._persist()
			this._log(`Updated record in ${properties.dataset}`)
			return {isSuccess: true, message: "Successfully updated item"}
		} catch (e) {
			return {isSuccess: false, message: e.message}
		}
	}

	/**
	 * Removes a record from a dataset.
	 * @param {Object} properties
	 * @param {string} properties.dataset
	 * @param {string} properties.field
	 * @param {any} properties.value
	 * @returns {Promise<{isSuccess: boolean, message: string}>}
	 */
	async remove(properties) {
		try {
			if (!this._db) throw new Error(this.messages.notCreated)
			const dataset = this._db.datasets.find(
				(x) => x.dataset === properties.dataset
			)
			if (!dataset) return {isSuccess: false, message: "Dataset not found"}

			const index = dataset.data.findIndex(
				(item) => item[properties.field] === properties.value
			)
			if (index === -1)
				return {isSuccess: false, message: this.messages.notFound}

			dataset.data.splice(index, 1)
			this._persist()
			this._log(`Removed record from ${properties.dataset}`)
			return {isSuccess: true, message: "Successfully removed item"}
		} catch (e) {
			return {isSuccess: false, message: e.message}
		}
	}

	/**
	 * Clears all data within a specific dataset but keeps the dataset entry.
	 * @param {Object} properties
	 * @param {string} properties.dataset
	 * @returns {Promise<{isSuccess: boolean, message: string}>}
	 */
	async removeAll(properties) {
		try {
			if (!this._db) throw new Error(this.messages.notCreated)
			const dataset = this._db.datasets.find(
				(x) => x.dataset === properties.dataset
			)
			if (!dataset) return {isSuccess: false, message: "Dataset not found"}

			dataset.data = []
			this._persist()
			this._log(`Cleared all data in ${properties.dataset}`)
			return {isSuccess: true, message: "Successfully removed all items"}
		} catch (e) {
			return {isSuccess: false, message: e.message}
		}
	}

	/**
	 * Returns the number of records in a dataset.
	 * @param {string} datasetName
	 * @returns {Promise<number>}
	 */
	async count(datasetName) {
		if (!this._db) return 0
		const dataset = this._db.datasets.find((x) => x.dataset === datasetName)
		return dataset ? dataset.data.length : 0
	}

	/**
	 * Checks if a record exists in a dataset.
	 * @param {Object} properties
	 * @param {string} properties.dataset
	 * @param {string} properties.field
	 * @param {any} properties.value
	 * @returns {Promise<boolean>}
	 */
	async has(properties) {
		const item = await this.get({
			dataset: properties.dataset,
			predicate: (x) => x[properties.field] === properties.value
		})
		return item !== null
	}

	/**
	 * Clears all data across all datasets but maintains the instance.
	 * @returns {Promise<void>}
	 */
	async truncate() {
		if (!this._db) return
		this._db.datasets.forEach((ds) => (ds.data = []))
		this._persist()
		this._log("Truncated all datasets")
	}

	/**
	 * Deletes the storage key from LocalStorage and clears memory.
	 * @returns {Promise<Qwery>}
	 */
	async reset() {
		localStorage.removeItem(this._qweryKey())
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
			localStorage.setItem(this._qweryKey(), JSON.stringify(this._db))
		} catch (e) {
			console.error("Qwery: Persist to LocalStorage failed", e)
		}
	}

	/** @private */
	_qweryKey() {
		return "qwery." + this.configuration.name
	}
}
