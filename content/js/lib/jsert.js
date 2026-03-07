/**
 * Jsert beta
 * (c) 2026 Joseph Morukhuladi
 * Licensed under MIT
 */

const ESC = "\x1b";
const RESET = `${ESC}[0m`;

const JsertTargets = {
  console: "console",
  terminal: "terminal",
};

const COLORS = {
  reset: 0,
  bold: 1,
  dim: 2,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
};

class Jsert {
  /**
   * Creates an instance of the Jsert class
   * @param {object} options
   */
  constructor(options = {}) {
    this.group = options.group || "Default Group";
    this.target = options.target || JsertTargets.console;
    this.tests = [];
    this.passed = [];
    this.failed = [];
  }

  /**
   * Universal log method that handles target switching and tag grouping
   */
  _log(tag, message, colorKey) {
    // Format the line with a consistent tag and colon
    const line = `${this._pad(tag)} ${message}`;

    if (this.target === JsertTargets.terminal) {
      const code = COLORS[colorKey] || COLORS.reset;
      console.log(`${ESC}[${code}m${line}${RESET}`);
    } else {
      const css = this._getCss(colorKey);
      console.log(`%c${line}`, css);
    }
  }

  _getCss(colorKey) {
    const map = {
      green: "color:#5f5; font-weight:bold;",
      red: "color:#f55; font-weight:bold;",
      blue: "color:#99f;",
      yellow: "color:#ff5;",
    };
    return map[colorKey] || "";
  }

  /**
   * Padded to a smaller length (8) to keep tags like [PASS] and [INFO] tight
   */
  _pad(val) {
    return val.padEnd(5);
  }

  pass(test) {
    this._log("[PASS]", test["name"], "green");
    this.passed.push(test["name"]);
  }

  fail(test) {
    this._log("[FAIL]", test["name"], "red");
    this.failed.push(test["name"]);
  }

  // --- ASSERTION LOGIC ---

  passWhen(test, condition) {
    if (condition === true) this.pass(test);
    else this.fail(test);
  }

  passWhenWithoutStrict(test, condition) {
    if (condition == true) this.pass(test);
    else this.fail(test);
  }

  passWhenEquals(test, actual, expected) {
    this.passWhen(test, actual === expected);
  }

  passWhenNotEquals(test, actual, unexpected) {
    this.passWhen(test, actual !== unexpected);
  }

  passWhenTruthy(test, actual) {
    this.passWhen(test, !!actual);
  }

  passWhenFalsy(test, actual) {
    this.passWhen(test, !actual);
  }

  passWhenNull(test, actual) {
    this.passWhen(test, actual === null);
  }

  passWhenNotNull(test, actual) {
    this.passWhen(test, actual !== null);
  }

  passWhenTypeIs(test, actual, expectedType) {
    if (expectedType.toLowerCase() === "array") {
      this.passWhen(test, Array.isArray(actual));
      return;
    }
    this.passWhen(test, typeof actual === expectedType);
  }

  passWhenHasLength(test, collection, expectedLength) {
    const condition = collection && collection.length === expectedLength;
    this.passWhen(test, condition);
  }

  passWhenIncludes(test, array, item) {
    const condition = Array.isArray(array) && array.includes(item);
    this.passWhen(test, condition);
  }

  passWhenEmpty(test, collection) {
    const condition = collection && collection.length === 0;
    this.passWhen(test, condition);
  }

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

  // --- EXECUTION & SUMMARY ---

  run() {
    const label = "[INFO] Time Taken";
    console.time(label);

    this._log("[INFO]", `Executing: ${this.group}`, "blue");

    for (const t of this.tests) {
      t.test();
    }

    this.summary();
    console.timeEnd(label);
    console.log();
    return this;
  }

  test(name, test) {
    this.tests.push({ name, test });
  }

  summary() {
    this._log("[INFO]", "Generating Summary", "reset");
    const total = this.passed.length + this.failed.length;

    this._log("[INFO]", `Tests Executed: ${total}`, "green");
    this._log("[INFO]", `Tests Passed  : ${this.passed.length}`, "green");

    const failColor = this.failed.length > 0 ? "red" : "green";
    this._log("[INFO]", `Tests Failed  : ${this.failed.length}`, failColor);
  }

  reset() {
    this.passed = [];
    this.failed = [];
    this.group = null;
    this.tests = [];
  }

  getJSONReport() {
    return {
      report: {
        group: this.group,
        totalTests: this.passed.length + this.failed.length,
        passed: this.passed.length,
        failed: this.failed.length,
      },
    };
  }
}
