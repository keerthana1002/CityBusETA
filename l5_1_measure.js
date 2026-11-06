
const { estimateArrivalTime } = require("./eta");
const fs = require("fs");

const testCases = [
    { id: "TC01", d: 10, s: 30, t: 5, expected: 25 },
    { id: "TC02", d: 10, s: 30, t: 0, expected: 20 },
    { id: "TC03", d: 0, s: 30, t: 0, expected: 0 },
    { id: "TC04", d: 15, s: 30, t: 5, expected: 35 },
    { id: "TC05", d: 10, s: 60, t: 5, expected: 15 },
    { id: "TC06", d: 10, s: 0, t: 0, expected: "Speed must be greater than zero" },
    { id: "TC07", d: -1, s: 30, t: 0, expected: "Invalid distance" },
    { id: "TC08", d: 10, s: 30, t: -5, expected: "Invalid traffic delay" },
    { id: "TC09", d: "ten", s: 30, t: 0, expected: "Invalid distance" },
    { id: "TC10", d: 10, s: "abc", t: 0, expected: "Speed must be greater than zero" }
];

const results = [];
let passed = 0;
let failed = 0;

for (let repeat = 1; repeat <= 5; repeat++) {
    for (const tc of testCases) {
        let actual;
        let status;

        try {
            actual = estimateArrivalTime(tc.d, tc.s, tc.t);
        } catch (error) {
            actual = error.message;
        }

        status = actual === tc.expected ? "PASS" : "FAIL";

        if (status === "PASS") {
            passed++;
        } else {
            failed++;
        }

        results.push({
            Run: repeat,
            TestCase: tc.id,
            Expected: tc.expected,
            Actual: actual,
            Status: status
        });

        console.log(
            `Run ${repeat} - ${tc.id}: ${status}`
        );
    }
}

const csv = [
    "Run,TestCase,Expected,Actual,Status",
    ...results.map(r =>
        `${r.Run},${r.TestCase},"${r.Expected}","${r.Actual}",${r.Status}`
    )
].join("\n");

fs.writeFileSync("l5_1_results.csv", csv);

const total = passed + failed;
const failureRate = (failed / total) * 100;

const source = fs.readFileSync("eta.js", "utf8");
const loc = source
    .split("\n")
    .filter(line => line.trim() !== "" && !line.trim().startsWith("//"))
    .length;

console.log("\n----- L5.1 SUMMARY -----");
console.log("Total executions:", total);
console.log("Passed:", passed);
console.log("Failed:", failed);
console.log("Failure rate:", failureRate.toFixed(2) + "%");
console.log("Source lines (approx.):", loc);
console.log("Results saved to l5_1_results.csv");
