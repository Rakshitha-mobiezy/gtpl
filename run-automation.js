// const LoginAutomation = require('./login-automation');
// const config = require('./config');

// async function main() {
//     console.log('🚀 Starting Login Automation with Python OCR');
//     console.log('=' .repeat(50));
    
//     const automation = new LoginAutomation();
    
//     try {
//         // Initialize browser
//         console.log('Initializing browser...');
//         await automation.initialize();
        
//         // Run the automation process
//         const result = await automation.handleLoginProcess(
//             config.username,
//             config.password,
//             config.maxRetries
//         );
        
//         // Display results
//         console.log('\n' + '='.repeat(50));
//         if (result.success) {
//             console.log('✅ LOGIN SUCCESSFUL!');
//             console.log(`📊 Completed in ${result.attempts} attempt(s)`);
//             console.log(`🔤 Final CAPTCHA: ${result.captcha}`);
            
//             // Show session status
//             if (result.sessionSaved) {
//                 console.log('💾 Session saved successfully');
//             } else {
//                 console.log('⚠️  Session save failed');
//             }
            
//             // Check navigation status
//             if (result.navigation) {
//                 if (result.navigation.success) {
//                     switch (result.navigation.method) {
//                         case 'direct_redirect':
//                             console.log('🎯 Directly redirected to Assign Plan page');
//                             break;
//                         case 'manual_navigation':
//                             console.log('🎯 Successfully navigated to Assign Plan page');
//                             break;
//                         case 'home_page':
//                             console.log('📍 Landed on Home page');
//                             break;
//                         case 'transaction_area':
//                             console.log('📍 Landed in Transaction area');
//                             break;
//                         case 'unknown_page':
//                             console.log(`📍 Logged in to: ${result.navigation.url}`);
//                             break;
//                     }
//                 } else {
//                     console.log('⚠️  Login successful but navigation had issues');
//                     if (result.navigation.error) {
//                         console.log(`Error: ${result.navigation.error}`);
//                     }
//                 }
//             }
//         } else {
//             console.log('❌ LOGIN FAILED');
//             console.log(`📊 Failed after ${result.attempts} attempts`);
//             console.log('💡 Try checking username/password or OCR settings');
//         }
//         console.log('='.repeat(50));
        
//     } catch (error) {
//         console.error('\n💥 Fatal Error:', error.message);
//         console.error('Stack trace:', error.stack);
//     } finally {
//         // Always close browser
//         await automation.close();
//     }
// }

// // Handle process termination gracefully
// process.on('SIGINT', () => {
//     console.log('\n⚠️  Process interrupted by user');
//     process.exit(0);
// });

// process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     process.exit(1);
// });

// // Run the main function
// main().catch(console.error);

// new +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// #!/usr/bin/env node

// const fs = require('fs');
// const LoginAutomation = require('./login-automation');
// const { runWithConcurrencyLimit } = require('./concurrency');

// // Minimal "--key value" / "--key=value" / "--flag" parser (no extra dependency needed).
// function parseArgs(argv) {
//     const args = {};
//     for (let i = 0; i < argv.length; i++) {
//         const token = argv[i];
//         if (!token.startsWith('--')) continue;

//         const key = token.slice(2);
//         if (key.includes('=')) {
//             const [k, v] = key.split(/=(.+)/);
//             args[k] = v;
//         } else {
//             const next = argv[i + 1];
//             if (next !== undefined && !next.startsWith('--')) {
//                 args[key] = next;
//                 i++;
//             } else {
//                 args[key] = true;
//             }
//         }
//     }
//     return args;
// }

// async function runOneAccount({ username, password, stb, headless }) {
//     const automation = new LoginAutomation({
//         username,
//         password,
//         stbNumber: stb,
//         headless: headless === true || headless === 'true',
//         label: username,
//     });

//     try {
//         await automation.initialize();
//         return await automation.run(3);
//     } finally {
//         await automation.close();
//     }
// }

// async function main() {
//     const args = parseArgs(process.argv.slice(2));

//     // ---- Mode A: single account -------------------------------------------------
//     // node run-automation.js --username myuser --password mypass --stb ABC12345
//     if (args.username && args.password && args.stb) {
//         const result = await runOneAccount({
//             username: args.username,
//             password: args.password,
//             stb: args.stb,
//             headless: args.headless,
//         });
//         console.log(`\n[${args.username}] FINAL RESULT:`, result);
//         process.exit(result.success ? 0 : 1);
//     }

//     // ---- Mode B: many accounts in parallel ---------------------------------------
//     // node run-automation.js --accounts accounts.json [--concurrency 5] [--headless true]
//     //
//     // accounts.json looks like:
//     // [
//     //   { "username": "user1", "password": "pass1", "stb": "STB0001" },
//     //   { "username": "user2", "password": "pass2", "stb": "STB0002" }
//     // ]
//     if (args.accounts) {
//         const accounts = JSON.parse(fs.readFileSync(args.accounts, 'utf-8'));
//         const concurrency = parseInt(args.concurrency, 10) || 5;

//         console.log(`Running ${accounts.length} accounts with concurrency ${concurrency}...`);

//         const results = await runWithConcurrencyLimit(accounts, concurrency, (account) =>
//             runOneAccount({ ...account, headless: args.headless })
//         );

//         results.forEach((r, i) => {
//             const who = accounts[i].username;
//             if (r.status === 'fulfilled') {
//                 console.log(`\n[${who}] RESULT:`, r.value);
//             } else {
//                 console.log(`\n[${who}] ERROR:`, r.reason?.message || r.reason);
//             }
//         });

//         const failures = results.filter((r) => r.status === 'rejected' || !r.value?.success);
//         process.exit(failures.length === 0 ? 0 : 1);
//     }

//     console.log(`Usage:
//   Single account:
//     node run-automation.js --username <user> --password <pass> --stb <stbNumber> [--headless true]

//   Multiple accounts in parallel:
//     node run-automation.js --accounts accounts.json [--concurrency 5] [--headless true]
// `);
//     process.exit(1);
// }

// main().catch((err) => {
//     console.error('Fatal error:', err);
//     process.exit(1);
// });


// new 2.o +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// #!/usr/bin/env node

const fs = require('fs');
const LoginAutomation = require('./login-automation');
const { runWithConcurrencyLimit } = require('./concurrency');

// Minimal "--key value" / "--key=value" / "--flag" parser (no extra dependency needed).
function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (!token.startsWith('--')) continue;

        const key = token.slice(2);
        if (key.includes('=')) {
            const [k, v] = key.split(/=(.+)/);
            args[k] = v;
        } else {
            const next = argv[i + 1];
            if (next !== undefined && !next.startsWith('--')) {
                args[key] = next;
                i++;
            } else {
                args[key] = true;
            }
        }
    }
    return args;
}

async function runOneAccount({ username, password, stb, headless }) {
    const automation = new LoginAutomation({
        username,
        password,
        stbNumber: stb,
        headless: headless === true || headless === 'true',
        label: username,
    });

    try {
        await automation.initialize();
        return await automation.run(3);
    } finally {
        await automation.close();
    }
}

// Shapes the raw run() result down to exactly what should go back to the
// caller: username, password (the ones used to log in), stb (the one passed
// in), and the updated dueDate once renewal completes. success/error are
// included too so failures are still informative.
function toApiResponse(result) {
    return {
        username: result.username,
        password: result.password,
        stb: result.stb,
        dueDate: result.dueDate || null,
        success: !!result.success,
        ...(result.success ? {} : { error: result.error || 'Unknown error' }),
    };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    // ---- Mode A: single account -------------------------------------------------
    // node run-automation.js --username myuser --password mypass --stb ABC12345
    if (args.username && args.password && args.stb) {
        const result = await runOneAccount({
            username: args.username,
            password: args.password,
            stb: args.stb,
            headless: args.headless,
        });
        console.log(`\n[${args.username}] FINAL RESULT:`, result);
        process.exit(result.success ? 0 : 1);
    }

    // ---- Mode B: many accounts in parallel ---------------------------------------
    // node run-automation.js --accounts accounts.json [--concurrency 5] [--headless true]
    //
    // accounts.json looks like:
    // [
    //   { "username": "user1", "password": "pass1", "stb": "STB0001" },
    //   { "username": "user2", "password": "pass2", "stb": "STB0002" }
    // ]
    if (args.accounts) {
        const accounts = JSON.parse(fs.readFileSync(args.accounts, 'utf-8'));
        const concurrency = parseInt(args.concurrency, 10) || 5;

        console.log(`Running ${accounts.length} accounts with concurrency ${concurrency}...`);

        const results = await runWithConcurrencyLimit(accounts, concurrency, (account) =>
            runOneAccount({ ...account, headless: args.headless })
        );

        results.forEach((r, i) => {
            const who = accounts[i].username;
            if (r.status === 'fulfilled') {
                console.log(`\n[${who}] RESULT:`, r.value);
            } else {
                console.log(`\n[${who}] ERROR:`, r.reason?.message || r.reason);
            }
        });

        const failures = results.filter((r) => r.status === 'rejected' || !r.value?.success);
        process.exit(failures.length === 0 ? 0 : 1);
    }

    console.log(`Usage:
  Single account:
    node run-automation.js --username <user> --password <pass> --stb <stbNumber> [--headless true]

  Multiple accounts in parallel:
    node run-automation.js --accounts accounts.json [--concurrency 5] [--headless true]
`);
    process.exit(1);
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});