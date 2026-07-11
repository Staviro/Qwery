"use strict"

const jsert = new Jsert({group: "When using the Qwery.js library v2"})
const testsQwery = "v2-tests"

jsert.test("When using the where method | With a static collection | It should filter data correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    const result = store.query(collection).where(x => x.age > 25).get();
    jsert.passWhen(this, result.length === 2);
    store.reset();
});

jsert.test("When using the where method | With data from the qwery instance | It should filter data correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    collection.forEach(x => store.query('users').add(x));
    const result = store.query('users').where(x => x.age > 25).get();
    jsert.passWhen(this, result.length === 2);

    store.reset();
});

jsert.test("When using the find method | With data from the qwery instance | It should find data correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    collection.forEach(x => store.query('users').add(x));
    const result = store.query('users').find(x => x.id === 2);
    jsert.passWhen(this, result.name === "Jane");

    store.reset();
});

jsert.test("When using the find method | With a static collection | It should find data correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    const result = store.query(collection).find(x => x.id === 2);
    jsert.passWhen(this, result.name === "Jane");

    store.reset();
});

jsert.test("When using the find method | With a static collection | It should return null when no match is found", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    const result = store.query(collection).find(x => x.id === 4);
    jsert.passWhenNull(this, result);

    store.reset();
});

jsert.test("When using the find method | With a static collection | It should return the first match when multiple matches exist", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    const result = store.query(collection).find(x => x.age > 25);
    jsert.passWhen(this, result.name === "John");

    store.reset();
});

jsert.test("When using the where method | With a qwery instance | It should return an empty array when no dataset is found", async function () {
    const store = new Qwery({name: testsQwery, log: false}).create();
    const result = store.query('nonexistent').where(x => x.age > 25).get();
    jsert.passWhen(this, result.length === 0);
    store.reset();
});

jsert.test("When using the delete method | With a qwery instance | It should delete data correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const result = store.query('users').delete(x => x.id === 2);
    const get = store.query('users').get();
    jsert.passWhen(this, result.affectedRows === 1);
    jsert.passWhen(this, get.length === 2);
    store.reset();
});


jsert.test("When using the delete method | With a qwery instance | It should delete many records correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const result = store.query('users').delete(x => x.age > 25);
    const get = store.query('users').get();
    jsert.passWhen(this, result.affectedRows === 2);
    jsert.passWhen(this, get.length === 1);
    store.reset();
});

jsert.test("When using the update method | With a qwery instance | It should update data correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const result = store.query('users').update(x => x.id === 2, { age: 26 });
    const get = store.query('users').get();
    jsert.passWhen(this, result.affectedRows === 1);
    jsert.passWhen(this, store.query(get).find(x => x.id === 2).age === 26);
    store.reset();
});

jsert.test("When using the update method | With a qwery instance | It should update many records correctly", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const result = store.query('users').update(x => x.age > 25, { age: 36 });
    const get = store.query('users').get();
    jsert.passWhen(this, result.affectedRows === 2);
    jsert.passWhen(this, store.query(get).find(x => x.id === 1).age === 36);
    jsert.passWhen(this, store.query(get).find(x => x.id === 3).age === 36);
    store.reset();
});

jsert.test("When using the count method | With a qwery instance | It should return the correct count", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const count = store.query('users').count();
    jsert.passWhen(this, count === 3);
    store.reset();
});

jsert.test("When using the clear method | With a qwery instance | It should clear all data", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const clear = store.query('users').clear();
    const count = store.query('users').count();
    jsert.passWhen(this, clear.affectedRows === 3);
    jsert.passWhen(this, count === 0);
    store.reset();
});

jsert.test("When using the any method | With a qwery instance | It should return true if there are records", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const any = store.query('users').any();
    jsert.passWhenTruthy(this, any);
    store.reset();
});

jsert.test("When using the any method | With a qwery instance | It should return false if there are no records", async function () {
    const store = new Qwery({name: testsQwery, log: false}).create();
    const any = store.query('users').any();
    jsert.passWhenFalsy(this, any);
    store.reset();
});

jsert.test("When using the empty method | With a qwery instance | It should return true if there are no records", async function () {
    const store = new Qwery({name: testsQwery, log: false}).create();
    const empty = store.query('users').empty();
    jsert.passWhenTruthy(this, empty);
    store.reset();
});

jsert.test("When using the empty method | With a qwery instance | It should return false if there are records", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const empty = store.query('users').empty();
    jsert.passWhenFalsy(this, empty);
    store.reset();
});

jsert.test("When using the take method | With a qwery instance | It should return the first n records", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const take = store.query('users').take(2).get();
    jsert.passWhen(this, take.length === 2);
    store.reset();
});

jsert.test("When using the skip method | With a qwery instance | It should return the records after the skip count", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const skip = store.query('users').skip(1).get();
    jsert.passWhen(this, skip.length === 2);
    store.reset();
});

jsert.test("When using the page method | With a qwery instance | It should return the records for the specified page", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const page = store.query('users').page(1, 2).get();
    jsert.passWhen(this, page.length === 2);
    store.reset();
});

jsert.test("When using the distinct method | With a qwery instance | It should return unique objects based on the provided function", async function () {
    const collection = [
        { id: 1, name: "John", category: "A" },
        { id: 2, name: "Jane", category: "B" },
        { id: 3, name: "Bob", category: "A" }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const distinct = store.query('users').distinct((x) => x.category).select(x => x.category).get();
    jsert.passWhen(this, distinct.length === 2 && distinct.includes("A") && distinct.includes("B"));
    store.reset();
}); 

jsert.test("When using the first method | With a qwery instance | It should return the first record", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const first = store.query('users').first();
    jsert.passWhen(this, first.name === "John");
    store.reset();
});

jsert.test("When using the last method | With a qwery instance | It should return the last record", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const last = store.query('users').last();
    jsert.passWhen(this, last.name === "Bob");
    store.reset();
});

jsert.test("When using the select method | With a qwery instance | It should return the selected as strings", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const selected = store.query('users').select(x => x.name).get();
    jsert.passWhen(this, selected.length === 3 && selected.includes("John") && selected.includes("Jane") && selected.includes("Bob"));
    store.reset();
});

jsert.test("When using the select method | With a qwery instance | It should return the selected as objects", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const selected = store.query('users').select(x => ({ name: x.name, age: x.age })).get();
    jsert.passWhen(this, selected.length === 3 && selected[0].name === "John" && selected[1].name === "Jane" && selected[2].name === "Bob" && selected[2].id === undefined);
    store.reset();
});

jsert.test("When using the orderBy method | With a qwery instance | It should return the records sorted", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const orderBy = store.query('users').orderBy(x => x.age).get();
    jsert.passWhen(this, orderBy[0].age === 25);
    store.reset();
});

jsert.test("When using the orderByDesc method | With a qwery instance | It should return the records sorted", async function () {
    const collection = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "Bob", age: 35 }
    ];
    const store = new Qwery({name: testsQwery, log: false}).create();
    store.query('users').add(collection);
    const orderByDesc = store.query('users').orderByDesc(x => x.age).get();
    jsert.passWhen(this, orderByDesc[0].age === 35);
    store.reset();
});


window.addEventListener("load", async function () {
	const result = await jsert.run()
	console.log("Qwery 2026 Final Test Report: ", result.getJSONReport())
	processTestResults(result)
})
