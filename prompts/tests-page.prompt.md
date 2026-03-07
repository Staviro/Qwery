## JS Library: Qwery

I am building a local storage language called Qwery. It is mainly a JS library that users can use to query the Local Storage API with ease.

---

I currently have unit tests that run to test the functionality of the website but the data currently is only logged in the console of the browser. I want a visual representation of the tests so that when users run the project, they can see the results of the tests.

Here is the criteria for building the UI

- The site should be modern and professional, with a strong impression of the unit tests
- Use the DM Sans google font
- Do not use any frontend frameworks
- Use vanilla JS, HTML and CSS
- You may use Tailwind to assist with styling
- The theme should be bright
- The website should have a nav bar. Showing only the brand name (Qwery) and the current version (Beta)
- You may use Chart.js to render summarised info.

## Functionality

- Write me a function that will process a specific `testResult` object
- Render all tests individually in a vertical list
- Add indicators for tests that passed and tests that failed
- Show the group name of the test
- Ignore the target key

## Data

Here is a sample of the `testResult` that will be passed into the function

```json
{
  "group": "When using the Qwery.js library",
  "target": "console",
  "tests": [
    {
      "name": "If qwery instance is created and create() is not called, json() should return null"
    },
    {
      "name": "If qwery instance is created and create() is called, json() should not be null"
    },
    {
      "name": "If qwery instance is created and create() is called, json() should not be null and after, reset() is called, json() should be null"
    },
    {
      "name": "If qwery instance is created and users dataset is added, datasetExists() should return true"
    },
    {
      "name": "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items"
    },
    {
      "name": "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items & names should match"
    },
    {
      "name": "Should return successful response when adding a valid user"
    },
    {
      "name": "Should return unsuccessful response when adding a user with no keys"
    },
    {
      "name": "Should return unsuccessful response when adding a null user"
    },
    {
      "name": "Should return unsuccessful response when adding a null undefined user"
    },
    {
      "name": "Should return success response when adding valid multiple users"
    },
    {
      "name": "Should return success response and correct number of data items when adding 3 valid users"
    },
    {
      "name": "Should return success response and correct number of data items when filtering throught 2 user id's"
    },
    {
      "name": "Items length should not match users length when using invalid id's"
    },
    {
      "name": "Items length should match users length when using getAll()"
    },
    {
      "name": "Should get correct user when filtering using the get() method"
    },
    {
      "name": "Should return null when filtering using non existent id"
    },
    {
      "name": "Should successfully get and update user when on update()"
    },
    {
      "name": "Should successfully get new key after user update"
    },
    {
      "name": "Should fail update when data key is null"
    },
    {
      "name": "Should fail update when data key is undefined"
    },
    {
      "name": "Should fail update when 'field' key is not specified"
    },
    {
      "name": "Should fail update when 'value' key is not specified"
    },
    {
      "name": "Should fail update when non existent id is used"
    },
    {
      "name": "Should remove all items from users dataset if removeAll() method is called"
    },
    {
      "name": "Should fail when non existent dataset is used in removeAll()"
    },
    {
      "name": "Should remove a single item when valid field and value are used with the remove() method"
    },
    {
      "name": "itemExists() method should be return false when non existent id is provided"
    },
    {
      "name": "itemExists() method should be return true when existent id is provided"
    },
    {
      "name": "Should fail on remove if field key is null"
    },
    {
      "name": "Should fail on remove if value key is null"
    },
    {
      "name": "Should pass on remove when removing user with id 1"
    },
    {
      "name": "Generate 50 unique ids"
    },
    {
      "name": "Should remove a dataset called 'users'"
    },
    {
      "name": "Should remove a dataset called 'users' and leave 'test'"
    },
    {
      "name": "Should fail when data key is missing on add method"
    },
    {
      "name": "Should fail when dataset key is missing on add method"
    },
    {
      "name": "createdDateTime should starts with todays UTC YYYY-MM-DD data"
    },
    {
      "name": "Should generate a 36 character unique key"
    },
    {
      "name": "Should generate a 36 character GUID"
    },
    {
      "name": "Should return success response and correct number of data items when adding 3 valid users and encode option is true"
    },
    {
      "name": "Should return a failure when value key is null when using itemExists()"
    },
    {
      "name": "Should return a failure when field is null when using itemExists()"
    }
  ],
  "passed": [
    "If qwery instance is created and create() is not called, json() should return null",
    "If qwery instance is created and create() is called, json() should not be null",
    "If qwery instance is created and create() is called, json() should not be null and after, reset() is called, json() should be null",
    "If qwery instance is created and users dataset is added, datasetExists() should return true",
    "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items",
    "If 2 datasets called users and accounts are created, listDatasets() should return an array of 2 items & names should match",
    "Should return successful response when adding a valid user",
    "Should return unsuccessful response when adding a user with no keys",
    "Should return unsuccessful response when adding a null user",
    "Should return unsuccessful response when adding a null undefined user",
    "Should return success response when adding valid multiple users",
    "Should return success response and correct number of data items when adding 3 valid users",
    "Should return success response and correct number of data items when filtering throught 2 user id's",
    "Items length should not match users length when using invalid id's",
    "Items length should match users length when using getAll()",
    "Should get correct user when filtering using the get() method",
    "Should return null when filtering using non existent id",
    "Should successfully get and update user when on update()",
    "Should successfully get new key after user update",
    "Should fail update when data key is null",
    "Should fail update when data key is undefined",
    "Should fail update when 'field' key is not specified",
    "Should fail update when 'value' key is not specified",
    "Should fail update when non existent id is used",
    "Should remove all items from users dataset if removeAll() method is called",
    "Should fail when non existent dataset is used in removeAll()",
    "Should remove a single item when valid field and value are used with the remove() method",
    "itemExists() method should be return false when non existent id is provided",
    "itemExists() method should be return true when existent id is provided",
    "Should fail on remove if field key is null",
    "Should fail on remove if value key is null",
    "Should pass on remove when removing user with id 1",
    "Generate 50 unique ids",
    "Should remove a dataset called 'users'",
    "Should fail when data key is missing on add method",
    "Should fail when dataset key is missing on add method",
    "createdDateTime should starts with todays UTC YYYY-MM-DD data",
    "Should generate a 36 character unique key",
    "Should generate a 36 character GUID",
    "Should return success response and correct number of data items when adding 3 valid users and encode option is true",
    "Should return a failure when value key is null when using itemExists()",
    "Should return a failure when field is null when using itemExists()"
  ],
  "failed": ["Should remove a dataset called 'users' and leave 'test'"]
}
```

Build me this website
