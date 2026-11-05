function estimateArrivalTime(distance, speed, trafficDelay = 0) {

    if (!Number.isFinite(distance) || distance < 0) {
        throw new Error("Invalid distance");
    }

    if (!Number.isFinite(speed) || speed <= 0) {
        throw new Error("Speed must be greater than zero");
    }

    if (!Number.isFinite(trafficDelay) || trafficDelay < 0) {
        throw new Error("Invalid traffic delay");
    }

    const travelTime = (distance / speed) * 60;

    return Math.ceil(travelTime + trafficDelay);
}

console.log(estimateArrivalTime(10, 30, 5));