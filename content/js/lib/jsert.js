/**
 * Jsert beta
 * (c) 2026 Joseph Morukhuladi
 * Licensed under MIT
 */

/** @constant {string} ESC - Escape character for terminal formatting */
const ESC = "\x1b"
/** @constant {string} RESET - Reset sequence for terminal formatting */
const RESET = `${ESC}[0m`

/**
 * Valid output targets for the library
 * @typedef {Object} JsertTargets
 * @property {string} console - Browser-style console styling
 * @property {string} terminal - ANSI escape code styling for terminals
 */
const JsertTargets = {
	console: "console",
	terminal: "terminal"
}

/**
 * ANSI Color codes for terminal output
 * @enum {number}
 */
const COLORS = {
	reset: 0,
	bold: 1,
	dim: 2,
	red: 31,
	green: 32,
	yellow: 33,
	blue: 34
}

/**
 * Configuration options for the Jsert instance
 * @typedef {Object} JsertOptions
 * @property {string} [group="Default Group"] - The name of the test suite group
 * @property {keyof JsertTargets} [target="console"] - The output format (console or terminal)
 */

/**
 * A lightweight, asynchronous assertion and testing library.
 */
class Jsert {
	/**
	 * Creates an instance of the Jsert class.
	 * @param {JsertOptions} options - Configuration for this instance.
	 */
	constructor(options = {}) {
		this.group = options.group || "Default Group"
		this.target = options.target || JsertTargets.console
		this.tests = []
		this.passed = []
		this.failed = []
	}

	/**
	 * Universal log method that handles target switching and tag grouping.
	 * @param {string} tag - The status tag (e.g., [PASS], [FAIL]).
	 * @param {string} message - The message to display.
	 * @param {keyof COLORS} colorKey - The key to the COLORS map.
	 * @private
	 */
	_log(tag, message, colorKey) {
		const line = `${this._pad(tag)} ${message}`

		if (this.target === JsertTargets.terminal) {
			const code = COLORS[colorKey] || COLORS.reset
			console.log(`${ESC}[${code}m${line}${RESET}`)
		} else {
			const css = this._getCss(colorKey)
			console.log(`%c${line}`, css)
		}
	}

	/**
	 * Returns CSS string for browser console formatting.
	 * @param {keyof COLORS} colorKey
	 * @returns {string}
	 * @private
	 */
	_getCss(colorKey) {
		const map = {
			green: "color:#5f5; font-weight:bold;",
			red: "color:#f55; font-weight:bold;",
			blue: "color:#99f;",
			yellow: "color:#ff5;"
		}
		return map[colorKey] || ""
	}

	/**
	 * Pads tags to maintain consistent alignment in logs.
	 * @param {string} val
	 * @returns {string}
	 * @private
	 */
	_pad(val) {
		return val.padEnd(5)
	}

	/**
	 * Records a passed test.
	 * @param {Object} test - The test object containing a name property.
	 */
	pass(test) {
		this._log("[PASS]", test.name, "green")
		this.passed.push(test.name)
	}

	/**
	 * Records a failed test.
	 * @param {Object} test - The test object containing a name property.
	 * @param {string} [reason] - Optional reason for failure.
	 */
	fail(test, reason = "") {
		const msg = reason ? `${test.name} (${reason})` : test.name
		this._log("[FAIL]", msg, "red")
		this.failed.push(test.name)
	}

	// --- ASSERTION LOGIC ---

	/**
	 * Standard strict equality assertion.
	 * @param {Object} test
	 * @param {boolean} condition
	 */
	passWhen(test, condition) {
		if (condition === true) this.pass(test)
		else this.fail(test)
	}

	/**
	 * Loose equality assertion (non-strict).
	 * @param {Object} test
	 * @param {*} condition
	 */
	passWhenWithoutStrict(test, condition) {
		if (condition == true) this.pass(test)
		else this.fail(test)
	}

	/**
	 * Asserts strict equality between two values.
	 * @param {Object} test
	 * @param {*} actual
	 * @param {*} expected
	 */
	passWhenEquals(test, actual, expected) {
		this.passWhen(test, actual === expected)
	}

	/**
	 * Asserts strict inequality between two values.
	 * @param {Object} test
	 * @param {*} actual
	 * @param {*} unexpected
	 */
	passWhenNotEquals(test, actual, unexpected) {
		this.passWhen(test, actual !== unexpected)
	}

	/**
	 * Asserts that a value is truthy.
	 * @param {Object} test
	 * @param {*} actual
	 */
	passWhenTruthy(test, actual) {
		this.passWhen(test, !!actual)
	}

	/**
	 * Asserts that a value is falsy.
	 * @param {Object} test
	 * @param {*} actual
	 */
	passWhenFalsy(test, actual) {
		this.passWhen(test, !actual)
	}

	/**
	 * Asserts that a value is exactly null.
	 * @param {Object} test
	 * @param {*} actual
	 */
	passWhenNull(test, actual) {
		this.passWhen(test, actual === null)
	}

	/**
	 * Asserts that a value is not null.
	 * @param {Object} test
	 * @param {*} actual
	 */
	passWhenNotNull(test, actual) {
		this.passWhen(test, actual !== null)
	}

	/**
	 * Asserts the type of a value.
	 * @param {Object} test
	 * @param {*} actual
	 * @param {string} expectedType - e.g., 'string', 'number', 'array'.
	 */
	passWhenTypeIs(test, actual, expectedType) {
		if (expectedType.toLowerCase() === "array") {
			this.passWhen(test, Array.isArray(actual))
			return
		}
		this.passWhen(test, typeof actual === expectedType)
	}

	/**
	 * Asserts that a collection has a specific length.
	 * @param {Object} test
	 * @param {Array|string} collection
	 * @param {number} expectedLength
	 */
	passWhenHasLength(test, collection, expectedLength) {
		const condition = collection && collection.length === expectedLength
		this.passWhen(test, !!condition)
	}

	/**
	 * Asserts that an array includes a specific item.
	 * @param {Object} test
	 * @param {Array} array
	 * @param {*} item
	 */
	passWhenIncludes(test, array, item) {
		const condition = Array.isArray(array) && array.includes(item)
		this.passWhen(test, condition)
	}

	/**
	 * Asserts that a collection is empty.
	 * @param {Object} test
	 * @param {Array|string} collection
	 */
	passWhenEmpty(test, collection) {
		const condition = collection && collection.length === 0
		this.passWhen(test, !!condition)
	}

	/**
	 * Deep equality check for objects and arrays.
	 * @param {*} obj1
	 * @param {*} obj2
	 * @returns {boolean}
	 */
	isMatch(obj1, obj2) {
		if (obj1 === obj2) return true
		if (Number.isNaN(obj1) && Number.isNaN(obj2)) return true
		if (
			typeof obj1 !== "object" ||
			typeof obj2 !== "object" ||
			obj1 === null ||
			obj2 === null
		)
			return false

		const isArray1 = Array.isArray(obj1)
		const isArray2 = Array.isArray(obj2)
		if (isArray1 !== isArray2) return false

		if (isArray1) {
			if (obj1.length !== obj2.length) return false
			for (let i = 0; i < obj1.length; i++) {
				if (!this.isMatch(obj1[i], obj2[i])) return false
			}
			return true
		}

		const keys1 = Object.keys(obj1)
		const keys2 = Object.keys(obj2)
		if (keys1.length !== keys2.length) return false

		for (const key of keys1) {
			if (
				!Object.prototype.hasOwnProperty.call(obj2, key) ||
				!this.isMatch(obj1[key], obj2[key])
			)
				return false
		}
		return true
	}

	/**
	 * Asserts deep equality between two objects or arrays.
	 * @param {Object} test
	 * @param {*} obj1
	 * @param {*} obj2
	 */
	passWhenMatch(test, obj1, obj2) {
		if (this.isMatch(obj1, obj2)) this.pass(test)
		else this.fail(test)
	}

	// --- EXECUTION & SUMMARY ---

	/**
	 * Executes all queued tests asynchronously.
	 * Includes error handling for thrown exceptions within test functions.
	 * @async
	 * @returns {Promise<Jsert>} - Returns the instance for chaining.
	 */
	async run() {
		const label = "[INFO] Time Taken"
		console.time(label)

		this._log("[INFO]", `Executing: ${this.group}`, "blue")

		for (const t of this.tests) {
			try {
				// Await the test in case it is an async function or returns a promise
				await t.test()
			} catch (err) {
				// If the test function throws, catch it and mark as failed
				this.fail(t, err.message)
			}
		}

		this.summary()
		console.timeEnd(label)
		console.log()
		return this
	}

	/**
	 * Adds a test case to the queue.
	 * @param {string} name - Name of the test.
	 * @param {Function} test - Function containing the test logic.
	 */
	test(name, test) {
		this.tests.push({name, test})
	}

	/**
	 * Prints the summary of test results to the console.
	 */
	summary() {
		this._log("[INFO]", "Generating Summary", "reset")
		const total = this.passed.length + this.failed.length

		this._log("[INFO]", `Tests Executed: ${total}`, "green")
		this._log("[INFO]", `Tests Passed  : ${this.passed.length}`, "green")

		const failColor = this.failed.length > 0 ? "red" : "green"
		this._log("[INFO]", `Tests Failed  : ${this.failed.length}`, failColor)
	}

	/**
	 * Resets the instance state, clearing results and tests.
	 */
	reset() {
		this.passed = []
		this.failed = []
		this.group = "Default Group"
		this.tests = []
	}

	/**
	 * Returns a JSON-formatted report of the test group results.
	 * @returns {Object}
	 */
	getJSONReport() {
		return {
			report: {
				group: this.group,
				totalTests: this.passed.length + this.failed.length,
				passed: this.passed.length,
				failed: this.failed.length,
				tests: this.tests
			}
		}
	}
}
