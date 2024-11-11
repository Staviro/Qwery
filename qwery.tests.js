'use strict';
const QweryDB = new Qwery({
    name: "QweryDB",
    log: true
});


let testsQwery = "LVJM4mS96M8ICVBPM8SnelbYX1j0B0h9";
//Configuration tests
consoleTester.tests.push({
    name: "If qwery instance is created and create() is not called, json() should return null",
    test: function() {
        let _ = this.name;
        const qwery = new Qwery({name: testsQwery, log: false });
        let json = qwery.json();
        if (json == null) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "If qwery instance is created and create() is called, json() should not be null",
    test: function() {
        let _ = this.name;
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let json = qwery.json();
        if (json != null) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "If qwery instance is created and create() is called, json() should not be null and after, reset() is called, json() should be null",
    test: function() {
        let _ = this.name;
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let result = true;
        if (qwery.json() == null) result = false;
        qwery.reset();
        if (qwery.json() != null) result = false;
        if (result) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "If qwery instance is created and users dataset is added, datasetExists() should return true",
    test: function() {
        let _ = this.name;
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        qwery.add({ dataset: "users", data: { id: 1 }});
        if (qwery.datasetExists("users") == true) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items",
    test: function() {
        let _ = this.name;
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        qwery.add({ dataset: "users" , data: { text: "" }});
        qwery.add({ dataset: "accounts" , data: { text: "" }});
        if (qwery.listDatasets().length == 2) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items & names should match",
    test: function() {
        let _ = this.name;
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        qwery.add({ dataset: "users" , data: { text: "" }});
        qwery.add({ dataset: "accounts" , data: { text: "" }});
        let datasets = qwery.listDatasets();
        if (datasets.length == 2 && datasets.includes('users') && datasets.includes('accounts')) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return successful response when adding a valid user",
    test: function() {
        let _ = this.name;
        let user = {
            id: 1,
            name: "Sam Good XII"
        }
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.add({ dataset: "users" , data: user});
        if (response.isSuccess) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return unsuccessful response when adding a user with no keys",
    test: function() {
        let _ = this.name;
        let user = {};
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.add({ dataset: "users" , data: user});
        if (response.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return unsuccessful response when adding a null user",
    test: function() {
        let _ = this.name;
        let user = null;
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.add({ dataset: "users" , data: user});
        if (response.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return unsuccessful response when adding a null undefined user",
    test: function() {
        let _ = this.name;
        let user = undefined;
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.add({ dataset: "users" , data: user});
        if (response.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return success response when adding valid multiple users",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users});
        if (response.isSuccess) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return success response and correct number of data items when adding 3 valid users",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let items = qwery.getAll({ dataset: "users" });
        if (response.isSuccess && items.length == users.length) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return success response and correct number of data items when filtering throught 2 user id's",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let items = qwery.getList({ dataset: "users", field: "id", values: [1, 2] });
        if (response.isSuccess && items.length == 2) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Items length should not match users length when using invalid id's",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let items = qwery.getList({ dataset: "users", field: "id", values: [1, 2, 4] });
        if (response.isSuccess && items.length != users.length) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Items length should match users length when using getAll()",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let items = qwery.getAll({ dataset: "users" });
        if (response.isSuccess && items.length == users.length) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should get correct user when filtering using the get() method",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        if (response.isSuccess && JSON.stringify(item) == JSON.stringify(users[1])) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should return null when filtering using non existent id",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 5 });
        if (response.isSuccess && item == null) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});


consoleTester.tests.push({
    name: "Should successfully get and update user when on update()",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        item.name = "Sam Gooder";
        let update = qwery.update({ dataset: "users", field: "id", value: item.id, data: item });
        let updatedItem = qwery.get({ dataset: "users", field: "id", value: 2 });
        if (response.isSuccess
            && update.isSuccess
            && updatedItem.name != users[2].name
            && item.name == updatedItem.name) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should successfully get new key after user update",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        item.dob = "1993/03/06";
        let update = qwery.update({ dataset: "users", field: "id", value: item.id, data: item });
        let updatedItem = qwery.get({ dataset: "users", field: "id", value: 2 });
        if (response.isSuccess
            && update.isSuccess
            && updatedItem.dob == item.dob) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail update when data key is null",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        let update = qwery.update({ dataset: "users", field: "id", value: item.id, data: null });
        if (update.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail update when data key is undefined",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        let update = qwery.update({ dataset: "users", field: "id", value: item.id, data: undefined });
        if (update.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail update when 'field' key is not specified",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        let update = qwery.update({ dataset: "users", value: item.id, data: item });
        if (update.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail update when 'value' key is not specified",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        let update = qwery.update({ dataset: "users", value: item.id, data: item });
        if (update.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail update when non existent id is used",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let item = qwery.get({ dataset: "users", field: "id", value: 2 });
        let update = qwery.update({ dataset: "users", value: 51, data: item });
        if (update.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should remove all items from users dataset if removeAll() method is called",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let result = qwery.removeAll({ dataset: "users" });
        let items = qwery.getAll({ dataset: "users" });
        if (result.isSuccess && items.length == 0) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail when non existent dataset is used in removeAll()",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let result = qwery.removeAll({ dataset: "users3ad434" });
        if (result.isSuccess == false) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should remove a single item when valid field and value are used with the remove() method",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let result = qwery.remove({ dataset: "users", field: "id", value: 2 });
        let exists = qwery.itemExists({ dataset: "users", field: "id", value: 2 });
        if (result.isSuccess && !exists) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "itemExists() method should be return false when non existent id is provided",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let exists = qwery.itemExists({ dataset: "users", field: "id", value: 5 });
        if (!exists) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "itemExists() method should be return true when existent id is provided",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let exists = qwery.itemExists({ dataset: "users", field: "id", value: 2 });
        if (exists) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail on remove if field key is null",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let result = qwery.remove({ dataset: "users", field: "id" });
        if (!result.isSuccess) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

consoleTester.tests.push({
    name: "Should fail on remove if value key is null",
    test: function() {
        let _ = this.name;
        let users = [{ id: 1, name: "Sam Good XII" }, { id: 2, name: "Sam Good XIII" }, { id: 3, name: "Sam Good XVI" }];
        const qwery = new Qwery({name: testsQwery, log: false}).create();
        let response = qwery.addList({ dataset: "users" , data: users });
        let result = qwery.remove({ dataset: "users", value: 2 });
        if (!result.isSuccess) consoleTester.pass(_);
        else consoleTester.fail(_);
        qwery.reset();
    }
});

window.addEventListener('load', function() {
    consoleTester.tests.forEach(function(t) { t.test(); });
    consoleTester.summary();
});