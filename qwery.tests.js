
const QweryDB = new Qwery({
    name: "Test",
    log: true
});

//This is a test
let keys = [];
function checkForDuplicates() {
    let loop = 0;
    while (loop < 36) {
        let newKey = QweryDB.newUniqueKey();
        if (keys.includes(newKey)) {
            console.log('Found duplicate');
        } else {
            console.log('No duplicate')
            keys.push(newKey);
        }
        loop++;
    }
}
checkForDuplicates();

//test 2
//adding a dataset
function addUserDataset() {
    let dataset = "users";
    let data = [
        {
            _id: 1,
            name: "Joseph Morukkhuladi",
        },
        {
            _id: 2,
            name: "Test User"
        },
        {
            _id: 3,
            name: "No Name"
        }
    ];
    QweryDB.add({ dataset, data: data[2] });
}

//test 3
//adding a list of items to a dataset
function addListToUserDataset() {
    let dataset = "users";
    let data = [
        {
            _id: 1,
            name: "Joseph Morukkhuladi",
        },
        {
            _id: 2,
            name: "Test User"
        },
        {
            _id: 3,
            name: "No Name"
        }
    ];
    QweryDB.addList({ dataset, data: data });
}


//test 4
//updating an existing record
function updateUserItemWithId2() {
    let dataset = 'users';
    let field = "_id";
    let value = 2;
    let data = {
        gender: 'male',
        dob: '2024/05/21',
        name: "Micheal Angelow"
    }
    let result = QweryDB.update({ dataset, field, value, data });
    console.log('result: ', result);
}

//test 5
//updating an existing record
function updateUserItemWithId3() {
    let dataset = 'users';
    let field = "_id";
    let value = 3;
    let data = {
        name: "User 3"
    }
    let result = QweryDB.update({ dataset, field, value, data });
    console.log('result: ', result);
}

//test 6
//updating a non existent record
function updateUserItemWithId100000() {
    let dataset = 'users';
    let field = "_id";
    let value = 100000;
    let data = {
        gender: 'male',
        dob: '2024/05/21',
        name: "Micheal Angelow"
    }
    let result = QweryDB.update({ dataset, field, value, data });
    console.log('result: ', result);
}

//test 7
//removing an existing
function removeUserWithId2() {
    let dataset = 'users';
    let field = "_id";
    let value = 2;
    let result = QweryDB.remove({ dataset, field, value });
    console.log('result: ', result);
}


//test 8
//removing a non existing item
function removeUserWithId100000() {
    let dataset = 'users';
    let field = "_id";
    let value = 100000;
    let result = QweryDB.remove({ dataset, field, value });
    console.log('result: ', result);
}

//test 9
//removing 3 items;
function removeMultipleUsers() {
    let dataset = 'users';
    let field = "_id";
    let values = [1, 2, 3];
    for (let i of values) {
        let result = QweryDB.remove({ dataset, field, value: i });
        console.log('result: ', result);
    }
}

//test 10
//Check if added item exists
function itemExists() {
    let result = QweryDB.itemExists( { dataset: 'users' , field: "_id", value:  3});
    console.log('result: ', result);
}

//test 11
//Check if non existent item exists
function itemDoesNotExist() {
    let result = QweryDB.itemExists( { dataset: 'users' , field: "_id", value:  100000 });
    console.log('result: ', result);
}