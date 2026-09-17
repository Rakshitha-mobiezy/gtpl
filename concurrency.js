/**
 * Runs `worker(item, index)` over every item in `items`, but never more than
 * `limit` at the same time. This is what lets you fire off many accounts
 * "simultaneously" without literally opening 50+ Chromium browsers at once
 * and running out of memory/CPU.
 *
 * Returns an array of { status: 'fulfilled', value } or { status: 'rejected', reason }
 * in the same order as `items`, same shape as Promise.allSettled.
 */
async function runWithConcurrencyLimit(items, limit, worker) {
    const results = new Array(items.length);
    let nextIndex = 0;

    async function runNext() {
        const current = nextIndex++;
        if (current >= items.length) return;

        try {
            const value = await worker(items[current], current);
            results[current] = { status: 'fulfilled', value };
        } catch (reason) {
            results[current] = { status: 'rejected', reason };
        }

        return runNext();
    }

    const workerCount = Math.max(1, Math.min(limit, items.length));
    await Promise.all(Array.from({ length: workerCount }, runNext));

    return results;
}

module.exports = { runWithConcurrencyLimit };