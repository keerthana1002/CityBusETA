const test = require('node:test');
const assert = require('node:assert/strict');
const { estimateArrivalTime } = require('./eta');

test('ETA with traffic delay', () => {
    assert.equal(estimateArrivalTime(10, 30, 5), 25);
});

test('ETA without traffic delay', () => {
    assert.equal(estimateArrivalTime(10, 30), 20);
});

test('Zero distance', () => {
    assert.equal(estimateArrivalTime(0, 30), 0);
});

test('Round up ETA', () => {
    assert.equal(estimateArrivalTime(1, 60), 1);
});

test('Zero speed', () => {
    assert.throws(() => estimateArrivalTime(10, 0));
});

test('Negative distance', () => {
    assert.throws(() => estimateArrivalTime(-1, 30));
});

test('Negative traffic delay', () => {
    assert.throws(() => estimateArrivalTime(10, 30, -1));
});

test('Text instead of distance', () => {
    assert.throws(() => estimateArrivalTime('ten', 30));
});