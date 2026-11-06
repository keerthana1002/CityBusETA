
const { Builder, By } = require('selenium-webdriver');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

const testCases = [
    { id: 'TC01', d: '10', s: '30', t: '5', expected: '25 minutes' },
    { id: 'TC02', d: '10', s: '30', t: '0', expected: '20 minutes' },
    { id: 'TC03', d: '0', s: '30', t: '0', expected: '0 minutes' },
    { id: 'TC04', d: '15', s: '30', t: '5', expected: '35 minutes' },
    { id: 'TC05', d: '10', s: '60', t: '5', expected: '15 minutes' },
    { id: 'TC06', d: '10', s: '0', t: '0', expected: 'Error:' },
    { id: 'TC07', d: '-1', s: '30', t: '0', expected: 'Error:' },
    { id: 'TC08', d: '10', s: '30', t: '-5', expected: 'Error:' },
    { id: 'TC09', d: 'ten', s: '30', t: '0', expected: 'Please enter valid values!' },
    { id: 'TC10', d: '10', s: 'abc', t: '0', expected: 'Please enter valid values!' }
];

async function runTests() {
    const driver = await new Builder().forBrowser('chrome').build();

    const results = [];

    try {
        const page = pathToFileURL(
            path.resolve(__dirname, 'index.html')
        ).href;

        await driver.get(page);

        for (let run = 1; run <= 5; run++) {
            console.log(`\n========== RUN ${run} ==========`);

            const start = process.hrtime.bigint();

            for (const test of testCases) {
                const distance = await driver.findElement(By.id('distance'));
                const speed = await driver.findElement(By.id('speed'));
                const delay = await driver.findElement(By.id('delay'));
                const button = await driver.findElement(
                    By.xpath("//button[contains(text(),'Calculate ETA')]")
                );

                await distance.clear();
                await speed.clear();
                await delay.clear();

                await distance.sendKeys(test.d);
                await speed.sendKeys(test.s);
                await delay.sendKeys(test.t);

                await button.click();

                const actual = await driver.findElement(
                    By.id('result')
                ).getText();

                const passed = actual.includes(test.expected);

                console.log(
                    `${test.id}: ${passed ? 'PASS' : 'FAIL'} | ${actual}`
                );

                results.push({
                    run,
                    test: test.id,
                    status: passed ? 'PASS' : 'FAIL',
                    actual
                });
            }

            const end = process.hrtime.bigint();
            const elapsed = Number(end - start) / 1e9;

            console.log(`Run ${run} total time: ${elapsed.toFixed(3)} seconds`);

            results.push({
                run,
                test: 'TOTAL',
                status: 'TIME',
                actual: elapsed.toFixed(3)
            });
        }

        const summary = results
            .filter(r => r.test === 'TOTAL');

        const average = summary.reduce(
            (sum, r) => sum + Number(r.actual), 0
        ) / summary.length;

        console.log('\n========== FINAL SUMMARY ==========');
        console.log('Total test executions:', 50);
        console.log('Average execution time:', average.toFixed(3), 'seconds');

        fs.writeFileSync(
            'selenium-results.json',
            JSON.stringify(results, null, 2)
        );

    } finally {
        await driver.quit();
    }
}

runTests().catch(error => {
    console.error('Automation failed:', error);
    process.exitCode = 1;
});
