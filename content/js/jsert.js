/**
 *Jsert beta
 *(c) 2026 Joseph Morukhuladi
 *Licensed under MIT
 */
class Jsert {
  /**
   * Creates an instance of the Jsert class
   * @param {string} group
   */
  constructor(group) {
    this.group = group;
    this.tests = [];
    this.passed = [];
    this.failed = [];
  }

  pass(test) {
    console.log(`%c${this._pad("Test Passed")}:${test["name"]}`, this._green());
    this.passed.push(test["name"]);
  }

  fail(test) {
    console.log(`%c${this._pad("Test Failed")}:${test["name"]}`, this._red());
    this.failed.push(test["name"]);
  }

  /**
   * Asserts that 'condition' is strictly equal
   */
  passWhen(test, condition) {
    if (condition === true) this.pass(test);
    else this.fail(test);
  }

  /**
   * Asserts that 'condition' is equal without stricly checking
   */
  passWhenWithoutStrict(test, condition) {
    if (condition == true) this.pass(test);
    else this.fail(test);
  }

  /**
   * Asserts that 'actual' and 'expected' are strictly equal (===).
   */
  passWhenEquals(test, actual, expected) {
    this.passWhen(test, actual === expected);
  }

  /**
   * Asserts that 'actual' and 'unexpected' are strictly NOT equal (!==).
   */
  passWhenNotEquals(test, actual, unexpected) {
    this.passWhen(test, actual !== unexpected);
  }

  /**
   * Asserts that 'actual' is truthy (evaluates to true).
   */
  passWhenTruthy(test, actual) {
    this.passWhen(test, !!actual);
  }

  /**
   * Asserts that 'actual' is falsy (evaluates to false).
   */
  passWhenFalsy(test, actual) {
    this.passWhen(test, !actual);
  }

  // --- NEW ASSERTION METHODS (Null, Undefined, and Type Checks) ---

  /**
   * Asserts that the value is strictly null.
   */
  passWhenNull(test, actual) {
    this.passWhen(test, actual === null);
  }

  /**
   * Asserts that the value is not null.
   */
  passWhenNotNull(test, actual) {
    this.passWhen(test, actual !== null);
  }

  /**
   * Asserts that the type of the 'actual' value matches the 'expectedType' string.
   */
  passWhenTypeIs(test, actual, expectedType) {
    // Special handling for Arrays since typeof array is 'object'
    if (expectedType.toLowerCase() === "array") {
      this.passWhen(test, Array.isArray(actual));
      return;
    }
    this.passWhen(test, typeof actual === expectedType);
  }

  /**
   * Asserts that the collection has the specified length.
   * Works for arrays and strings.
   */
  passWhenHasLength(test, collection, expectedLength) {
    // Ensure collection exists and has a length property
    const condition = collection && collection.length === expectedLength;
    this.passWhen(test, condition);
  }

  /**
   * Asserts that an array includes a specific item.
   */
  passWhenIncludes(test, array, item) {
    const condition = Array.isArray(array) && array.includes(item);
    this.passWhen(test, condition);
  }

  /**
   * Asserts that an array or string is empty (length of zero).
   */
  passWhenEmpty(test, collection) {
    const condition = collection && collection.length === 0;
    this.passWhen(test, condition);
  }

  /**
   * Asserts that 2 objects are a strict match
   */
  isMatch = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (Number.isNaN(obj1) && Number.isNaN(obj2)) return true;

    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 === null ||
      obj2 === null
    )
      return false;

    const isArray1 = Array.isArray(obj1);
    const isArray2 = Array.isArray(obj2);

    if (isArray1 !== isArray2) return false;
    if (isArray1) {
      if (obj1.length !== obj2.length) return false;
      for (let i = 0; i < obj1.length; i++) {
        if (!this.isMatch(obj1[i], obj2[i])) return false;
      }
      return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (
        !Object.prototype.hasOwnProperty.call(obj2, key) ||
        !this.isMatch(obj1[key], obj2[key])
      )
        return false;
    }

    return true;
  };

  passWhenMatch(test, obj1, obj2) {
    if (this.isMatch(obj1, obj2)) this.pass(test);
    else this.fail(test);
  }

  run() {
    let label = " ~ Completed In";
    let b = this._blue();
    console.time(label);
    console.log(`%c${this._pad(" ~ Executing")}:${this.group}`, b);
    for (const t of this.tests) {
      t.test();
    }
    this.summary();
    console.timeEnd(label, this._green());
    console.log();
    this.reset();
  }

  test(name, test) {
    this.tests.push({
      name,
      test,
    });
  }

  summary() {
    const style = this._green();
    console.log(" ~ Generating summary");
    console.log(
      `%c${this._pad("Tests Executed")}:${
        this.passed.length + this.failed.length
      }`,
      style,
    );
    console.log(`%c${this._pad("Tests Passed")}:${this.passed.length}`, style);
    console.log(
      `%c${this._pad("Tests Failed")}:${this.failed.length}`,
      this.failed.length > 0 ? this._red() : style,
    );
  }

  reset() {
    this.passed = [];
    this.failed = [];
    this.group = null;
    this.tests = [];
  }

  _green() {
    return "color:#5f5;";
  }
  _red() {
    return "color:#f55;";
  }
  _blue() {
    return "color:#99f;";
  }
  _pad(val) {
    return val.padEnd(16);
  }
}
