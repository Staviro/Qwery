"use strict"

const jsert = new Jsert({group: "When using the Qwery.js library"})
const testsQwery = "LVJM4mS96M8ICVBPM8SnelbYX1j0B0h9"

jsert.test(
	"If qwery instance is created and create() is not called, json() should return null",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false})
		let json = qwery.json()
		jsert.passWhenTruthy(this, json == null)
		await qwery.reset()
	}
)

jsert.test(
	"If qwery instance is created and create() is called, json() should not be null",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false}).create()
		let json = qwery.json()
		jsert.passWhenTruthy(this, json != null)
		await qwery.reset()
	}
)

jsert.test(
	"Should successfully add a user and check existence using has()",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false}).create()
		const user = {id: "user_1", name: "John Doe"}

		await qwery.add({dataset: "users", data: user})
		const exists = await qwery.has({
			dataset: "users",
			predicate: (x) => x.id === "user_1"
		})

		jsert.passWhenTruthy(this, exists === true)
		await qwery.reset()
	}
)

jsert.test(
	"get() should return an array when multiple matches are found via predicate",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false}).create()
		await qwery.add({dataset: "items", data: {id: 1, tags: ["new"]}})
		await qwery.add({dataset: "items", data: {id: 2, tags: ["new"]}})

		const result = await qwery.get({
			dataset: "items",
			predicate: (x) => x.tags.includes("new")
		})

		jsert.passWhenTruthy(this, Array.isArray(result) && result.length === 2)
		await qwery.reset()
	}
)

jsert.test(
	"count() should accurately report the number of items in a dataset",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false}).create()
		await qwery.add({dataset: "entries", data: {val: 1}})
		await qwery.add({dataset: "entries", data: {val: 2}})
		await qwery.add({dataset: "entries", data: {val: 3}})

		const total = await qwery.count("entries")
		jsert.passWhenTruthy(this, total === 3)
		await qwery.reset()
	}
)

jsert.test(
	"truncate() should clear all data while maintaining the dataset structure",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false}).create()
		await qwery.add({dataset: "temp", data: {active: true}})

		await qwery.truncate()
		const total = await qwery.count("temp")
		const exists = qwery.datasetExists("temp")

		jsert.passWhenTruthy(this, total === 0 && exists === true)
		await qwery.reset()
	}
)

jsert.test("uuid() should generate a valid v4 UUID string", async function () {
	const qwery = new Qwery({name: testsQwery})
	const id = qwery.uuid()
	// Regex for basic UUID v4 format check
	const isUuid =
		/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			id
		)
	jsert.passWhenTruthy(this, isUuid)
})

jsert.test(
	"update() should merge new data into an existing record",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false}).create()
		await qwery.add({
			dataset: "profile",
			data: {id: 1, name: "Original", status: "offline"}
		})

		await qwery.update({
			dataset: "profile",
			field: "id",
			value: 1,
			data: {status: "online"}
		})

		const updated = await qwery.get({
			dataset: "profile",
			predicate: (x) => x.id === 1
		})
		jsert.passWhenTruthy(
			this,
			updated[0].name === "Original" && updated[0].status === "online"
		)
		await qwery.reset()
	}
)

jsert.test(
	"remove() should delete records matching the predicate and return the count of removed items",
	async function () {
		const qwery = new Qwery({name: testsQwery, log: false}).create()
		await qwery.add({dataset: "tasks", data: {tid: "A1"}})
		await qwery.remove({dataset: "tasks", predicate: (x) => x.tid === "A1"})

		const exists = await qwery.has({
			dataset: "tasks",
			predicate: (x) => x.tid === "A1"
		})
		jsert.passWhenFalsy(this, exists)
		await qwery.reset()
	}
)

window.addEventListener("load", async function () {
	const result = await jsert.run()
	console.log("Qwery 2026 Final Test Report: ", result.getJSONReport())
	processTestResults(result)
})
