/**
    *Jsert
    *(c) 2024 Joseph Morukhuladi
    *Licensed under MIT
*/

/**
 * Class for creating Jsert objects
 */
class Jsert {
    constructor() {
        this.tests = [];
        this.passed = [];
        this.failed = [];
        return this;
    }
    /**
     * Adds test to passed list
     * @param {object} test
     */
    pass(test) {
        console.log(`%cTest Passed: ${test['name']}`, this._green());
        this.passed.push(test['name']);
    }
    /**
     * Adds test to failed list
     * @param {object} test
     */
    fail(test) {
        console.log(`%cTest Failed: ${test['name']}`, this._red());
        this.failed.push(test['name']);
    }
    /**
     * Runs all tests added to the tests list
     */
    run() {
        console.log("Jsert Running Tests...");
        let label = "%cCompleted In";
        console.time(label);
        this.tests.forEach(function(t) { t.test() });
        console.log("Jsert Completed Running Tests");
        console.log("Loading summary...");
        this.summary();
        console.timeLog(label, this._green());
    }
    /**
     * Adds test to the tests list
     * @param {string} name
     * @param {Function} test
     */
    add(name, test) {
        this.tests.push({
            name,
            test
        });
    }
    /**
     * Prints a summary for all tests
     */
    summary() {
        let style = this._green();
        console.log(`%cTotal Tests Executed: ${ this.passed.length + this.failed.length }`, style);
        console.log(`%cTotal Tests Passed: ${ this.passed.length}`, style);
        console.log(`%cTotal Tests Failed: ${ this.failed.length}`, style);
    }
    _green() {
        return "color:#5f5;"
    }
    _red() {
        return "color:#f55;"
    }
    _blue() {
        return "color:#99f;"
    }
}