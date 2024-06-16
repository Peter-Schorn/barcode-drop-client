

export function dateDifferenceFromNow(date) {

    const now = new Date();
    const then = new Date(date);  // date passed in
    const diffMilliseconds = now - then;
    let diff = Math.floor(diffMilliseconds / 1_000);
    console.log("diffMilliseconds: " + diffMilliseconds);
    console.log("diff: " + diff);
    console.log("now: " + now);
    console.log("then: " + then);

    // MARK: diff = difference in seconds

    if (diff <= 3) {
        return "Just now";
    }
    if (diff > 86_400 /* more than 1 day old */) {
        return `More than one day ago`;
    }

    // diff is between 4 and 86,400 seconds inclusive

    const hours = Math.floor(diff / 3600) % 24;
    diff -= hours * 3600;

    const minutes = Math.floor(diff / 60) % 60;
    diff -= minutes * 60;

    const seconds = diff % 60;
    diff -= seconds * 60;

    let diffComponents = [
        // hours,
        // minutes,
        // seconds
    ];

    let diffString = "";

    if (hours > 0) {
        const descriptor = hours > 1 ? "hours" : "hour";
        diffComponents.push(`${hours} ${descriptor}`);
    }
    if (minutes > 0) {
        const descriptor = minutes > 1 ? "minutes" : "minute";
        diffComponents.push(`${minutes} ${descriptor}`);
    }
    if (seconds > 0) {
        const descriptor = seconds > 1 ? "seconds" : "second";
        diffComponents.push(`${seconds} ${descriptor}`);
    }

    if (diffComponents.length === 0) {
        return "";
    }
    switch (diffComponents.length) {
        case 1:
            diffString = diffComponents[0];
            break;
        case 2:
            diffString = diffComponents.join(" and ");
            break;
        default:
            const lastComponent = diffComponents.pop();
            diffString = diffComponents.join(", ") + ", and " + lastComponent;
            break;
    }
    
    return diffString + " ago";
   
}

// MARK: setIntervalImmediately()
/**
 * Calls the function immediately, then calls it every `interval` milliseconds.
 * 
 * @param {Function} func The function to call.
 * @param {number} interval The interval in milliseconds.
 * @returns The interval ID. (The same value returned by `setInterval()`.)
 */
export function setIntervalImmediately(func, interval) {
    func();
    return setInterval(func, interval);
}

/**
 * Returns whether the platform is Apple. Apple platforms use the command key
 * as the platform modifier key, while other platforms use the control key.
 * 
 * @returns {boolean} `true` if the platform is Apple, `false` otherwise.
 */
export function isApplePlatform() {
    return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

KeyboardEvent.prototype.isPlatformModifierKey = function() {
    if (isApplePlatform()) {
        return this.metaKey;
    }
    return this.ctrlKey;
}
