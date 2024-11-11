const consoleTester = {
    pass(name) {
        let style = "color:#5f5; font-size:16px;";
        console.log(`%cTest Passed: ${name}`, style);
        consoleTester.passed.push(name);
    },
    fail(name) {
        let style = "color:#f55; font-size:16px;";
        console.log(`%cTest Failed: ${name}`, style);
        consoleTester.failed.push(name);
    },
    summary() {
        let style = "color:#5f5; font-size:16px;";
        console.log('%cLogging summary....', "color:#55f; font-size:16px;");
        console.log(`%cTotal Tests Executed: ${ consoleTester.passed.length + consoleTester.failed.length }`, style);
        console.log(`%cTotal Tests Passed: ${ consoleTester.passed.length}`, style);
        console.log(`%cTotal Tests Failed: ${ consoleTester.failed.length}`, style);
    },
    passed: [],
    failed: [],
    tests: []
}