// npm install express   (playwright should already be installed)
const express = require('express');
const LoginAutomation = require('./login-automation');
const { runWithConcurrencyLimit } = require('./concurrency');

const app = express();
app.use(express.json());

async function runOneAccount({ username, password, stb, headless = true }) {
    const automation = new LoginAutomation({
        username,
        password,
        stbNumber: stb,
        headless,
        label: username,
    });

    try {
        await automation.initialize();
        return await automation.run(3);
    } finally {
        await automation.close();
    }
}

/**
 * POST /automate
 * body: {
 *   "accounts": [
 *     { "username": "user1", "password": "pass1", "stb": "STB0001" },
 *     { "username": "user2", "password": "pass2", "stb": "STB0002" }
 *   ],
 *   "concurrency": 5,     // optional, defaults to 5 - how many browsers run at once
 *   "headless": true      // optional, defaults to true for server use
 * }
 */
app.post('/automate', async (req, res) => {
    const { accounts, concurrency = 5, headless = true } = req.body || {};

    if (!Array.isArray(accounts) || accounts.length === 0) {
        return res.status(400).json({ error: 'accounts must be a non-empty array' });
    }

    try {
        const results = await runWithConcurrencyLimit(accounts, concurrency, (account) =>
            runOneAccount({ ...account, headless })
        );

        const response = results.map((r, i) => ({
            username: accounts[i].username,
            stb: accounts[i].stb,
            ...(r.status === 'fulfilled'
                ? r.value
                : { success: false, error: r.reason?.message || String(r.reason) }),
        }));

        res.json({ results: response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Automation API listening on http://localhost:${PORT}`));