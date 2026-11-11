const { estimateArrivalTime } = require("./eta");
const { performance } = require("node:perf_hooks");
const fs = require("fs");

const INTERVAL = 60 * 1000; // 1 minute
const TOTAL_CHECKS = 10;
const ALERT_LIMIT = 5; // milliseconds

const results = [];

const logFile = "monitor-log.csv";

fs.writeFileSync(
    logFile,
    "Check,Timestamp,ResponseTime_ms,Status\n"
);

let count = 0;

console.log("CityBusETA Monitoring Started");
console.log("Checking every 1 minute for 10 minutes...");
console.log("Alert threshold: " + ALERT_LIMIT + " ms\n");

const timer = setInterval(() => {
    count++;

    const start = performance.now();

    try {
        // Check the existing ETA function
        estimateArrivalTime(10, 30, 5);

        const end = performance.now();
        const responseTime = end - start;

        const status =
            responseTime > ALERT_LIMIT ? "ALERT" : "NORMAL";

        const timestamp = new Date().toLocaleString();

        results.push({
            check: count,
            timestamp,
            responseTime
        });

        console.log(
            `Check ${count}: ${responseTime.toFixed(4)} ms - ${status}`
        );

        if (status === "ALERT") {
            console.log("WARNING: Response time exceeded the limit!");
        }

        fs.appendFileSync(
            logFile,
            `${count},"${timestamp}",${responseTime.toFixed(4)},${status}\n`
        );

    } catch (error) {
        console.log("Monitoring error:", error.message);
    }

    if (count === TOTAL_CHECKS) {
        clearInterval(timer);

        console.log("\nMonitoring completed!");
        console.log("Total checks: " + count);
        console.log("Log saved to: " + logFile);
    }

}, INTERVAL);