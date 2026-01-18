"use strict";

const jsert = new Jsert("Library tests");
const testsQwery = "LVJM4mS96M8ICVBPM8SnelbYX1j0B0h9";

jsert.test(
  "If qwery instance is created and create() is not called, json() should return null",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false });
    let json = qwery.json();
    jsert.passWhenTruthy(this, json == null);
    qwery.reset();
  },
);

jsert.test(
  "If qwery instance is created and create() is called, json() should not be null",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let json = qwery.json();
    jsert.passWhenTruthy(this, json != null);
    qwery.reset();
  },
);

jsert.test(
  "If qwery instance is created and create() is called, json() should not be null and after, reset() is called, json() should be null",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let result = true;
    if (qwery.json() == null) result = false;
    qwery.reset();
    if (qwery.json() != null) result = false;
    if (result) jsert.pass(this);
    else jsert.fail(this);
    qwery.reset();
  },
);

jsert.test(
  "If qwery instance is created and users dataset is added, datasetExists() should return true",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    qwery.add({ dataset: "users", data: { id: 1 } });
    jsert.passWhenTruthy(this, qwery.datasetExists("users"));
    qwery.reset();
  },
);

jsert.test(
  "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    qwery.add({ dataset: "users", data: { text: "" } });
    qwery.add({ dataset: "accounts", data: { text: "" } });
    jsert.passWhenTruthy(this, qwery.listDatasets().length == 2);
    qwery.reset();
  },
);

jsert.test(
  "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items & names should match",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    qwery.add({ dataset: "users", data: { text: "" } });
    qwery.add({ dataset: "accounts", data: { text: "" } });
    let datasets = qwery.listDatasets();
    jsert.passWhenTruthy(
      this,
      datasets.length == 2 &&
        qwery.datasetExists("users") &&
        qwery.datasetExists("accounts"),
    );
    qwery.reset();
  },
);

jsert.test(
  "Should return successful response when adding a valid user",
  function () {
    let user = {
      id: 1,
      name: "Sam Good XII",
    };
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.add({ dataset: "users", data: user });
    jsert.passWhenTruthy(this, response.isSuccess);
    qwery.reset();
  },
);

jsert.test(
  "Should return unsuccessful response when adding a user with no keys",
  function () {
    let user = {};
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.add({ dataset: "users", data: user });
    jsert.passWhenFalsy(this, response.isSuccess);
    qwery.reset();
  },
);

jsert.test(
  "Should return unsuccessful response when adding a null user",
  function () {
    let user = null;
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.add({ dataset: "users", data: user });
    jsert.passWhenFalsy(this, response.isSuccess);
    qwery.reset();
  },
);

jsert.test(
  "Should return unsuccessful response when adding a null undefined user",
  function () {
    let user = undefined;
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.add({ dataset: "users", data: user });
    jsert.passWhenFalsy(this, response.isSuccess);
    qwery.reset();
  },
);

jsert.test(
  "Should return success response when adding valid multiple users",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    jsert.passWhenTruthy(this, response.isSuccess);
    qwery.reset();
  },
);

jsert.test(
  "Should return success response and correct number of data items when adding 3 valid users",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    let items = qwery.getAll({ dataset: "users" });
    jsert.passWhenTruthy(this, response.isSuccess && items.length === 3);
    qwery.reset();
  },
);

jsert.test(
  "Should return success response and correct number of data items when filtering throught 2 user id's",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    let items = qwery.getList({
      dataset: "users",
      field: "id",
      values: [1, 2],
    });
    jsert.passWhenTruthy(this, response.isSuccess && items.length === 2);
    qwery.reset();
  },
);

jsert.test(
  "Items length should not match users length when using invalid id's",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    let items = qwery.getList({
      dataset: "users",
      field: "id",
      values: [1, 2, 4],
    });
    jsert.passWhenTruthy(
      this,
      response.isSuccess && items.length !== users.length,
    );
    qwery.reset();
  },
);

jsert.test(
  "Items length should match users length when using getAll()",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    let items = qwery.getAll({ dataset: "users" });
    jsert.passWhenTruthy(
      this,
      response.isSuccess && items.length === users.length,
    );
    qwery.reset();
  },
);

jsert.test(
  "Should get correct user when filtering using the get() method",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    let item = qwery.get({ dataset: "users", field: "id", value: 2 });
    jsert.passWhenTruthy(
      this,
      response.isSuccess && JSON.stringify(item) === JSON.stringify(users[1]),
    );
    qwery.reset();
  },
);

jsert.test(
  "Should return null when filtering using non existent id",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    let item = qwery.get({ dataset: "users", field: "id", value: 5 });
    jsert.passWhenTruthy(this, response.isSuccess && item === null);
    qwery.reset();
  },
);

jsert.test(
  "Should successfully get and update user when on update()",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let response = qwery.addList({ dataset: "users", data: users });
    let item = qwery.get({ dataset: "users", field: "id", value: 2 });
    item.name = "Sam Gooder";
    let update = qwery.update({
      dataset: "users",
      field: "id",
      value: item.id,
      data: item,
    });
    let updatedItem = qwery.get({ dataset: "users", field: "id", value: 2 });
    jsert.passWhenTruthy(
      this,
      response.isSuccess &&
        update.isSuccess &&
        updatedItem.name !== users[2].name &&
        item.name === updatedItem.name,
    );
    qwery.reset();
  },
);

jsert.test("Should successfully get new key after user update", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  let response = qwery.addList({ dataset: "users", data: users });
  let item = qwery.get({ dataset: "users", field: "id", value: 2 });
  item.dob = "1993/03/06";
  let update = qwery.update({
    dataset: "users",
    field: "id",
    value: item.id,
    data: item,
  });
  let updatedItem = qwery.get({ dataset: "users", field: "id", value: 2 });
  jsert.passWhenTruthy(
    this,
    response.isSuccess && update.isSuccess && updatedItem.dob == item.dob,
  );
  qwery.reset();
});

jsert.test("Should fail update when data key is null", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let item = qwery.get({ dataset: "users", field: "id", value: 2 });
  let update = qwery.update({
    dataset: "users",
    field: "id",
    value: item.id,
    data: null,
  });
  jsert.passWhenFalsy(this, update.isSuccess);
  qwery.reset();
});

jsert.test("Should fail update when data key is undefined", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let item = qwery.get({ dataset: "users", field: "id", value: 2 });
  let update = qwery.update({
    dataset: "users",
    field: "id",
    value: item.id,
    data: undefined,
  });
  jsert.passWhenFalsy(this, update.isSuccess);
  qwery.reset();
});

jsert.test("Should fail update when 'field' key is not specified", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let item = qwery.get({ dataset: "users", field: "id", value: 2 });
  let update = qwery.update({ dataset: "users", value: item.id, data: item });
  jsert.passWhenFalsy(this, update.isSuccess);
  qwery.reset();
});

jsert.test("Should fail update when 'value' key is not specified", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let item = qwery.get({ dataset: "users", field: "id", value: 2 });
  let update = qwery.update({ dataset: "users", value: item.id, data: item });
  jsert.passWhenFalsy(this, update.isSuccess);
  qwery.reset();
});

jsert.test("Should fail update when non existent id is used", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let item = qwery.get({ dataset: "users", field: "id", value: 2 });
  let update = qwery.update({ dataset: "users", value: 51, data: item });
  jsert.passWhenFalsy(this, update.isSuccess);
  qwery.reset();
});

jsert.test(
  "Should remove all items from users dataset if removeAll() method is called",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    qwery.addList({ dataset: "users", data: users });
    let result = qwery.removeAll({ dataset: "users" });
    let items = qwery.getAll({ dataset: "users" });
    jsert.passWhenTruthy(this, result.isSuccess && items.length === 0);
    qwery.reset();
  },
);

jsert.test(
  "Should fail when non existent dataset is used in removeAll()",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let result = qwery.removeAll({ dataset: "users3ad434" });
    jsert.passWhenFalsy(this, result.isSuccess);
    qwery.reset();
  },
);

jsert.test(
  "Should remove a single item when valid field and value are used with the remove() method",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    qwery.addList({ dataset: "users", data: users });
    let result = qwery.remove({ dataset: "users", field: "id", value: 2 });
    let exists = qwery.itemExists({ dataset: "users", field: "id", value: 2 });
    jsert.passWhenTruthy(this, result.isSuccess && !exists);
    qwery.reset();
  },
);

jsert.test(
  "itemExists() method should be return false when non existent id is provided",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    qwery.addList({ dataset: "users", data: users });
    let exists = qwery.itemExists({ dataset: "users", field: "id", value: 5 });
    jsert.passWhenFalsy(this, exists);
    qwery.reset();
  },
);

jsert.test(
  "itemExists() method should be return true when existent id is provided",
  function () {
    let users = [
      { id: 1, name: "Sam Good XII" },
      { id: 2, name: "Sam Good XIII" },
      { id: 3, name: "Sam Good XVI" },
    ];
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    qwery.addList({ dataset: "users", data: users });
    let exists = qwery.itemExists({ dataset: "users", field: "id", value: 2 });
    jsert.passWhenTruthy(this, exists);
    qwery.reset();
  },
);

jsert.test("Should fail on remove if field key is null", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let result = qwery.remove({ dataset: "users", field: "id" });
  jsert.passWhenFalsy(this, result.isSuccess);
  qwery.reset();
});

jsert.test("Should fail on remove if value key is null", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let result = qwery.remove({ dataset: "users", value: 2 });
  jsert.passWhenFalsy(this, result.isSuccess);
  qwery.reset();
});

jsert.test("Should pass on remove when removing user with id 1", function () {
  let users = [
    { id: 1, name: "Sam Good XII" },
    { id: 2, name: "Sam Good XIII" },
    { id: 3, name: "Sam Good XVI" },
  ];
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  qwery.addList({ dataset: "users", data: users });
  let result = qwery.remove({ dataset: "users", field: "id", value: 1 });
  let get = qwery.get({ dataset: "users", field: "id", value: 1 });
  jsert.passWhenTruthy(this, result.isSuccess && get === null);
  qwery.reset();
});

jsert.test("Generate 50 unique ids", function () {
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  const ids = [];
  for (let i = 0; i < 50; i++) {
    ids.push(qwery.newUniqueKey());
  }
  let result = qwery.addList({ dataset: "uniqueIds", data: ids });
  let getAll = qwery.getAll({ dataset: "uniqueIds" });
  let hasDuplicate = false;
  let iteration = 0;

  while (iteration < getAll.length) {
    for (let i = 0; i < getAll.length; i++) {
      if (i != iteration && getAll[i] == getAll[iteration]) {
        hasDuplicate = true;
      }
    }
    iteration++;
  }

  jsert.passWhenTruthy(
    this,
    result.isSuccess && getAll.length != 0 && !hasDuplicate,
  );
  qwery.reset();
});

jsert.test("Should remove a dataset called 'users'", function () {
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  let dataset = "users";
  let data = { userId: 123, name: "John" };
  qwery.add({ dataset, data });
  let result = qwery.removeDataset(dataset);
  let exists = qwery.datasetExists(dataset);
  jsert.passWhenTruthy(this, result.isSuccess && !exists);
  qwery.reset();
});

jsert.test(
  "Should remove a dataset called 'users' and leave 'test'",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let dataset = "users";
    let data = { userId: 123, name: "John" };
    qwery.add({ dataset, data });
    qwery.add({ dataset: "test", data: { sample: true } });
    let result = qwery.removeDataset(dataset);
    let exists = qwery.datasetExists(dataset);
    let datasets = qwery.listDatasets();
    jsert.passWhenTruthy(
      this,
      result.isSuccess && !exists && datasets.length === 1,
    );
    qwery.reset();
  },
);

jsert.test("Should fail when data key is missing on add method", function () {
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  let result = qwery.add({ dataset: "test" });
  if (result.message === qwery.messages.dataRequired) jsert.pass(this);
  else jsert.fail(this);
  qwery.reset();
});

jsert.test(
  "Should fail when dataset key is missing on add method",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    let result = qwery.add({ data: "test" });
    jsert.passWhenTruthy(
      this,
      result.message === qwery.messages.datasetRequired,
    );
    qwery.reset();
  },
);

jsert.test(
  "createdDateTime should starts with todays UTC YYYY-MM-DD data",
  function () {
    const qwery = new Qwery({ name: testsQwery, log: false }).create();
    const json = qwery.json();
    const now = new Date();
    const stringDate = `${now.getUTCFullYear()}-${(now.getUTCMonth() + 1).toString().padStart(2, "0")}-${now.getUTCDate().toString().padStart(2, "0")}`;
    jsert.passWhenTruthy(this, json.createdDateTime.startsWith(stringDate));
    qwery.reset();
  },
);

jsert.test("Should generate a 32 character unique key", function () {
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  const uniqueKey = qwery.newUniqueKey();
  jsert.passWhenTruthy(this, uniqueKey.length === 32);
  qwery.reset();
});

jsert.test("Should generate a 36 character GUID", function () {
  const qwery = new Qwery({ name: testsQwery, log: false }).create();
  const newGuid = qwery.newGuid();
  jsert.passWhenTruthy(this, newGuid.length === 36);
  qwery.reset();
});

window.addEventListener("load", function () {
  jsert.run();
});
