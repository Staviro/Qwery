'use strict';
/**
    *Qwery JS
    *(c) 2024 Joseph Morukhuladi
    *Licensed under MIT
*/

/**
 * Class for creating Qwery objects
 */
class Qwery {
    /**
     * Constructor for new Qwery object
     * @param {object} config
     * @returns {Qwery} Currenty Qwery object
     */
    constructor(config) {
        this.configuration.name = config.name;
        this.configuration.log = config.log == undefined ? false: config.log;
        return this;
    }

    /**
     * Defines the configuration for the object
     */
    configuration = {
        name: "",
        log: false
    }

    /**
     * Resets all information about the object
     * @returns {Qwery}
     */
    reset() {
        localStorage.removeItem(this._qweryKey());
        if(this.configuration.log) console.log("Qwery reset completed");
        return this;
    }

    /**
     * Creates new Qwery in local storage
     * @returns {Qwery}
     */
    create() {
        let exists = localStorage.getItem(this._qweryKey()) == null ? false : true;
        if (!exists) {
            localStorage.setItem(this._qweryKey(), JSON.stringify(this._createBaseJSON()));
            if(this.configuration.log) console.log('New Qwery added');
        } else {
            if(this.configuration.log) console.log("Qwery key already exists");
        }
        return this;
    }

    /**
     * Gets current Qwery in JSON format
     * @returns {object}
     */
    json() {
        return JSON.parse(localStorage.getItem(this._qweryKey()));
    }

    /**
     * Gets a list of all datasets in current Qwery object
     * @returns {Array}
     */
    listDatasets() {
        if (!this._qweryExists()) return this._noQweryError();
        return this.json().datasets.map((x) => {
            return x.dataset
        });
    }

    /**
     * Adds a single item into the specified datasets. Creates dataset if it does not exist
     * @param {object} properties
     * @returns {object} { isSuccess: Boolean, message: String }
     */
    add(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        let result = this._updateResult(true, "Successfully added item");
        try {
            if (this.isNullOrUndefinedOrEmpty(properties.data) || this.isEmptyObject(properties.data)) return this._updateResult(false, "data key cannot be null");
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset)) {
                let newSet = {
                    dataset: properties.dataset,
                    data: []
                }
                json.datasets.push(newSet);
                dataset = newSet;
            }

            dataset.data.push(properties.data);
            json.datasets.filter(x => x.dataset == properties.dataset)[0] = dataset;
            localStorage.setItem(this._qweryKey(), JSON.stringify(json));
            this._reportUpdate(1);
            return result;
        } catch(e) {
            this._reportUpdate(0);
            console.error('Qwery error: ', e);
            return this._updateResult(false, e.message);
        }
    }

    /**
     * Adds a list of items to a dataset. Creates dataset if it does not exist
     * @param {object} properties
     * @returns {object} { isSuccess: Boolean, message: String }
     */
    addList(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        let result = this._updateResult(true, "Successfully added all items");
        try {
            if (this.isNullOrUndefinedOrEmpty(properties.data) || this.isEmptyObject(properties.data)) return this._updateResult(false, "data key cannot be null");
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset)) {
                let newDataset = {
                    dataset: properties.dataset,
                    data: []
                }
                json.datasets.push(newDataset);
                dataset = newDataset;
            }
            let records = 0;
            for (let i = 0; i < properties.data.length; i++) {
                dataset.data.push(properties.data[i]);
                records++;
            }

            json.datasets.filter(x => x.dataset == properties.dataset)[0] = dataset;
            localStorage.setItem(this._qweryKey(), JSON.stringify(json));
            this._reportUpdate(records);
            return result;
        } catch(e) {
            this._reportUpdate(0);
            console.error('Qwery error: ', e);
            return this._updateResult(false, e.message);
        }
    }

    /**
     * Gets an item from a dataset. Accepts field and value properties as filters or returns first item in dataset by default
     * @param {object} properties
     * @returns {object | null}
     */
    get(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        try {
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset) || this.isEmptyObject(dataset)) {
                return null;
            } else {
                let hasField = properties.field == undefined ? false : true;
                let hasValue = properties.value == undefined ? false : true;
                let result;
                if (hasField && hasValue) {
                    result = dataset.data.filter((x) => x[properties.field] == properties.value)[0];
                } else {
                    result = dataset.data[0];
                }
                this._reportGet(result == undefined ? 0 : 1);
                return result == undefined ? null : result;
            }
        } catch(e) {
            this._reportGet(0);
            console.error('Qwery error: ', e);
            return null;
        }
    }

    /**
     * Gets a list of data based off filters
     * @param {object} properties
     * @returns {Array}
     */
    getList(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        try {
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset) || this.isEmptyObject(dataset)) {
                this._reportGet(0);
                return null;
            } else {
                let result = [];
                let records = 0;
                for (let i = 0; i < properties.values.length; i++) {
                    let item = dataset.data.filter((x) => x[properties.field] == properties.values[i])[0];
                    if (item != undefined) {
                        result.push(item);
                    }
                    records++;
                }
                this._reportGet(result == undefined ? 0 : records);
                return result == undefined ? [] : result;
            }
        } catch(e) {
            this._reportGet(0);
            console.error('Qwery error: ', e);
            return [];
        }
    }

    /**
     * Gets all data from a dataset
     * @param {object} properties
     * @returns {Array}
     */
    getAll(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        try {
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset) || this.isEmptyObject(dataset)) {
                this._reportGet(0);
                return [];
            } else {
                this._reportGet(dataset.data.length);
                return dataset.data;
            }
        } catch(e) {
            this._reportGet(0);
            console.error('Qwery error: ', e);
            return [];
        }
    }

    /**
     * Updates an item in a dataset
     * @param {object} properties
     * @returns {object} { isSuccess: Boolean, message: String }
     */
    update(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        if (this.isNullOrUndefinedOrEmpty(properties.data) || this.isEmptyObject(properties.data)) return this._updateResult(false, "data key cannot be null");
        let result = this._updateResult(true, "Successfully updated item")
        try {
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset)) {
                this._reportUpdate(0);
                return this._updateResult(false, "Could not find table");
            } else {
                let hasFieldLookup = properties.field == undefined ? false : true;
                let hasValueLookup = properties.value == undefined ? false : true;
                if (!hasFieldLookup) return this._updateResult(false, "field key cannot be null");
                if (!hasValueLookup) return this._updateResult(false, "value key cannot be null");
                let lookupItem = {};
                lookupItem = dataset.data.filter((item) => item[properties.field] == properties.value)[0];
                if (!this.isNullOrUndefinedOrEmpty(lookupItem)) {
                    let index = dataset.data.findIndex((item) => item[properties.field] == properties.value);
                    if (index != -1) {
                        let propertiesToUpdate = Object.getOwnPropertyNames(properties.data);
                        for (let i = 0; i < propertiesToUpdate.length; i++) {
                            dataset.data[index][propertiesToUpdate[i]] = properties.data[propertiesToUpdate[i]];
                        }
                        json.datasets.filter(x => x.dataset == properties.dataset)[0] = dataset;
                        localStorage.setItem(this._qweryKey(), JSON.stringify(json));
                        this._reportUpdate(1);
                    } else {
                        this._reportUpdate(0);
                        return this._updateResult(false, "Could not find entry in dataset data.");
                    }
                    return result;
                } else {
                    this._reportUpdate(0);
                    return this._updateResult(false, "Could not find entry in dataset data.");
                }
            }
        } catch(e) {
            this._reportUpdate(0);
            console.error('Qwery error: ', e);
            return this._updateResult(false, e.message);
        }
    }

    /**
     * Removes an item from a dataset
     * @param {object} properties
     * @returns {object} { isSuccess: Boolean, message: String }
     */
    remove(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        if (this.isNullOrUndefinedOrEmpty(properties) || this.isEmptyObject(properties)) return this._updateResult(false, "data field cannot be null");
        let result = this._updateResult(true, "Successfully removed item");
        try {
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset)) {
                this._reportUpdate(0);
                return this._updateResult(false, "Could not find entry in table data");
            } else {
                let hasFieldLookup = properties.field == undefined ? false : true;
                let hasValueLookup = properties.value == undefined ? false : true;
                if (!hasFieldLookup) return this._updateResult(false, "field key cannot be null");
                if (!hasValueLookup) return this._updateResult(false, "value key cannot be null");
                let lookupItem = null;
                lookupItem = dataset.data.filter((item) => item[properties.field] == properties.value)[0];
                if (!this.isNullOrUndefinedOrEmpty(lookupItem)) {
                    let index = dataset.data.findIndex((item) => item[properties.field] == properties.value);
                    if (index != -1) {
                        dataset.data.splice(index, 1);
                        json.datasets.filter(x => x.dataset == properties.dataset)[0] = dataset;
                        localStorage.setItem(this._qweryKey(), JSON.stringify(json));
                        this._reportUpdate(1);
                        return result;
                    } else {
                        this._reportUpdate(0);
                        return this._updateResult(false, "Could not find entry in dataset data.");
                    }
                }
                else {
                    this._reportUpdate(0);
                    return this._updateResult(false, "Could not find entry in dataset data");
                }
            }
        } catch (e) {
            this._reportUpdate(0);
            console.error('Qwery error: ', e);
            return this._updateResult(false, e.message);
        }
    }

    /**
     * Removes all items from a dataset
     * @param {object} properties
     * @returns {object}
     */
    removeAll(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        let result = this._updateResult(true, "Successfully removed all items");
        try {
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            if (this.isNullOrUndefinedOrEmpty(dataset) || this.isEmptyObject(dataset)) {
                return this._updateResult(false, "Could not find dataset");
            } else {
                this._reportUpdate(json.datasets.filter(x => x.dataset == properties.dataset)[0].data.length);
                json.datasets.filter(x => x.dataset == properties.dataset)[0].data = [];
                localStorage.setItem(this._qweryKey(), JSON.stringify(json));
                return result;
            }
        } catch(e) {
            this._reportUpdate(0);
            console.error('Qwery error: ', e);
            return this._updateResult(false, e.message);
        }
    }

    /**
     * Checks if an item exists in a dataset
     * @param {object} properties
     * @returns {boolean}
     */
    itemExists(properties) {
        if (!this._qweryExists()) return this._noQweryError();
        try {
            let json = this.json();
            let dataset = json.datasets.filter(x => x.dataset == properties.dataset)[0];
            let result;
            if (this.isNullOrUndefinedOrEmpty(dataset) || this.isEmptyObject(dataset)) {
                return null;
            } else {
                result = dataset.data.filter((x) => x[properties.field] == properties.value)[0];
                return result == undefined ? false : true;
            }
        } catch(e) {
            console.error('Qwery error: ', e);
            return false;
        }
    }

    /**
     * Checks whether a dataset exists in the current Qwery object
     * @param {string} name
     * @returns {boolean}
     */
    datasetExists(name) {
        if (!this._qweryExists()) return this._noQweryError();
        let datasets = this.listDatasets();
        return datasets.includes(name);
    }

    /**
     * Checks whether a value is null, undefined or empty
     * @param {object} value
     * @returns {boolean}
     */
    isNullOrUndefinedOrEmpty(value) {
        if (value === undefined || typeof(value) === "undefined" || value === null || value === "null" || value === "" || value.length == 0) return true;
        else return false;
    }

    /**
     * Checks whether an object is empty
     * @param {object} value
     * @returns {boolean}
     */
    isEmptyObject(value) {
        if (Object.keys(value).length == 0) return true;
        else return false;
    }

    /**
     * Generates a unique key
     * @returns {string}
     */
    newUniqueKey() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz_-';
        let key = "";
        for (let i = 0; i < 32; i++) {
            if (i == 0) key = key + letters[Math.floor(Math.random() * letters.length)];
            else key = key + characters[Math.floor(Math.random() * characters.length)];
        }
        return key;
    }

    /**
     * Logs the number of records updated
     * @param {number} records
     * @private
     */
    _reportUpdate(records) {
        if (this.configuration.log) console.log(`${records} item(s) updated.`);
    }

    /**
     * Logs the number of records fetched
     * @param {number} records
     * @private
     */
    _reportGet(records) {
        if (this.configuration.log) console.log(`${records} item(s) fetched.`);
    }

    /**
     * Creates new result object
     * @returns {object}
     * @private
     */
    _updateResult(isSuccess, message) {
        return {
            isSuccess, message
        }
    }

    /**
     * Gets key for current Qwery key object
     * @returns {string}
     */
    _qweryKey() {
        return "qwery." + this.configuration.name;
    }

    /**
     * Creates a base JSON object for Qwery
     * @returns {object}
     * @private
     */
    _createBaseJSON() {
        let date = new Date();
        let utcDate = `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getMinutes()}`
        let json = {
            datasets: [],
            createdDateTime: utcDate
        };
        return json;
    }

    /**
     * Checks if Qwery object exists
     * @returns { boolean }
     * @private
     */
    _qweryExists() {
        return this.json() == null ? false : true;
    }

    /**
     * Throws error when Qwery object has not created
     * @returns { object }
     */
    _noQweryError() {
        console.warn('Qwery object has not been created. Please use the create() method to create add Qwery item to local storage');
        return this;
    }

    /**
     * Gets size of localstorage for current domain in KiB
     * @returns { Number }
     */
    currentSizeInKB() {
        let keys = Object.keys(localStorage);
        let length = 0;
        keys.forEach(x => {
            length += localStorage[x].length;
        })
        return Number((length / 1024).toFixed(2));
    }
}
