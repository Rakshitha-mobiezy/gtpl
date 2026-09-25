// const { chromium } = require('playwright');
// const fs = require('fs');
// const path = require('path');
// const HybridCaptchaSolver = require('./hybrid-captcha-solver');
// const config = require('./config');

// class LoginAutomation {
//     constructor() {
//         this.browser = null;
//         this.page = null;
//         this.baseUrl = 'https://gtplsaathi.com/';
//         this.captchaSolver = new HybridCaptchaSolver();
//     }

//     async initialize() {
//         // Launch browser with necessary options
//         this.browser = await chromium.launch({
//             headless: false, // Set to true for headless mode
//             slowMo: 1000,    // Slow down actions for better visibility
//         });
        
//         this.page = await this.browser.newPage();
        
//         // Set viewport and user agent
//         await this.page.setViewportSize({ width: 1280, height: 720 });
//         await this.page.setExtraHTTPHeaders({
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//         });
//     }

//     // async navigateToLogin() {
//     //     console.log('Navigating to login page...');
//     //     await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
//     //     await this.page.waitForTimeout(2000);
        
//     // }

//     async navigateToLogin() {
//         console.log('Navigating to login page...');
//         await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
//         await this.page.waitForTimeout(3000);

//         // ============ DEBUG BLOCK START ============
//         console.log('\n🔍 ===== DEBUGGING PAGE STRUCTURE =====');

//         // 1. List all input fields on the page
//         const inputs = await this.page.$$eval('input', els =>
//             els.map(e => ({
//                 id: e.id,
//                 name: e.name,
//                 type: e.type,
//                 placeholder: e.placeholder,
//                 visible: e.offsetParent !== null
//             }))
//         );
//         console.log('📝 ALL INPUT FIELDS:');
//         console.log(JSON.stringify(inputs, null, 2));

//         // 2. List all images (to find CAPTCHA)
//         const images = await this.page.$$eval('img', els =>
//             els.map(e => ({ id: e.id, name: e.name, src: e.src, alt: e.alt }))
//         );
//         console.log('🖼️ ALL IMAGES:');
//         console.log(JSON.stringify(images, null, 2));

//         // 3. List all buttons/clickable elements
//         const buttons = await this.page.$$eval('input[type="submit"], input[type="button"], button, a', els =>
//             els.map(e => ({
//                 tag: e.tagName,
//                 id: e.id,
//                 name: e.name,
//                 type: e.type,
//                 text: (e.innerText || e.value || '').trim().substring(0, 40)
//             }))
//         );
//         console.log('🔘 ALL BUTTONS/LINKS:');
//         console.log(JSON.stringify(buttons, null, 2));

//         // 4. Check for iframes (IMPORTANT!)
//         const frames = this.page.frames();
//         console.log('🖼️ FRAMES ON PAGE:');
//         frames.forEach((f, i) => console.log(`   [${i}] ${f.url() || '(no url)'}`));

//         // 5. Check each selector your code uses
//         const selectorsToCheck = [
//             '#txtUsername', '#txtPassword', '#txtcaptcha', '#ibtLogIn',
//             '#imgCaptcha', '#imgcatcharefresh'
//         ];
//         console.log('🎯 SELECTOR CHECK:');
//         for (const sel of selectorsToCheck) {
//             const el = await this.page.$(sel);
//             console.log(`   ${sel}: ${el ? '✅ FOUND' : '❌ MISSING'}`);
//         }

//         console.log('🔍 ===== END DEBUG =====\n');
//         // ============ DEBUG BLOCK END ============
//     }

//     // async fillCredentials(username, password) {
//     //     console.log('Filling login credentials...');
        
//     //     // Fill username
//     //     await this.page.fill('#txtUsername', username);
//     //     console.log(`Filled username: ${username}`);
        
//     //     // Fill password
//     //     await this.page.fill('#txtPassword', password);
//     //     console.log('Filled password');
//     // }

//     async fillCredentials(username, password) {
//         console.log('Filling login credentials...');
        
//         // ✅ FIXED: correct IDs from debug output
//         await this.page.fill('#txtuser', username);
//         console.log(`Filled username: ${username}`);
        
//         await this.page.fill('#txtpassword', password);
//         console.log('Filled password');
//     }

//     // async solveCaptcha() {
//     //     console.log('Starting 6-digit CAPTCHA solving with Python OCR...');
        
//     //     try {
//     //         // Wait for CAPTCHA image to load
//     //         await this.page.waitForSelector('#imgCaptcha', { timeout: 10000 });
            
//     //         // Take screenshot of the CAPTCHA image
//     //         const captchaElement = await this.page.$('#imgCaptcha');
//     //         if (!captchaElement) {
//     //             throw new Error('CAPTCHA image not found');
//     //         }
            
//     //         // Get the bounding box of the CAPTCHA image
//     //         const boundingBox = await captchaElement.boundingBox();
            
//     //         // Take screenshot of just the CAPTCHA area
//     //         const captchaBuffer = await this.page.screenshot({
//     //             clip: {
//     //                 x: boundingBox.x,
//     //                 y: boundingBox.y,
//     //                 width: boundingBox.width,
//     //                 height: boundingBox.height
//     //             }
//     //         });
            
//     //         // Save CAPTCHA image for debugging
//     //         const captchaPath = path.join(__dirname, 'captcha.png');
//     //         fs.writeFileSync(captchaPath, captchaBuffer);
//     //         console.log('📸 CAPTCHA image saved for processing...');
            
//     //         // Use Python OCR bridge
//     //         console.log('🐍 Using Python OCR (proven working method)...');
//     //         const result = await this.captchaSolver.solveCaptcha(captchaBuffer, captchaPath);
            
//     //         if (!result.success) {
//     //             throw new Error(`CAPTCHA solving failed: ${result.error}`);
//     //         }
            
//     //         const captchaText = result.captcha;
//     //         console.log(`✅ 6-digit CAPTCHA solved: "${captchaText}" (${result.confidence}% confidence)`);
            
//     //         // Fill the CAPTCHA input
//     //         await this.page.fill('#txtcaptcha', captchaText);
//     //         console.log('📝 CAPTCHA filled in input field');
            
//     //         return captchaText;
            
//     //     } catch (error) {
//     //         console.error('💥 CAPTCHA solving failed:', error.message);
//     //         throw error;
//     //     }
//     // }

//     // async refreshCaptcha() {
//     //     console.log('Refreshing CAPTCHA...');
//     //     await this.page.click('#imgcatcharefresh');
//     //     await this.page.waitForTimeout(2000); // Wait for new CAPTCHA to load
//     // }

//     async refreshCaptcha() {
//         console.log('Refreshing CAPTCHA...');
//         await this.page.click('#imgRefresh');  // ✅ FIXED
//         await this.page.waitForTimeout(2000);
//     }

//     async solveCaptcha() {
//         console.log('Starting alphanumeric CAPTCHA solving...');
        
//         try {
//             // ✅ Wait for the CAPTCHA image element using the CORRECT selector
//             await this.page.waitForSelector('#imgSecurityCode', { timeout: 10000 });
            
//             const captchaElement = await this.page.$('#imgSecurityCode');
//             if (!captchaElement) {
//                 throw new Error('CAPTCHA image #imgSecurityCode not found');
//             }
            
//             // ⭐ BEST APPROACH: Extract base64 directly from the src attribute
//             //    (no screenshot needed — we get the raw image at native quality)
//             const base64Data = await captchaElement.evaluate(el => el.src);
            
//             console.log('📸 CAPTCHA src prefix:', base64Data.substring(0, 50) + '...');
            
//             const captchaPath = path.join(__dirname, 'captcha.png');
            
//             // Strip the data URL prefix and decode
//             const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
//             const imageBuffer = Buffer.from(base64Image, 'base64');
//             fs.writeFileSync(captchaPath, imageBuffer);
            
//             console.log(`💾 CAPTCHA saved: ${captchaPath} (${imageBuffer.length} bytes)`);
            
//             // Send to Python OCR
//             console.log('🐍 Sending to Python OCR...');
//             const result = await this.captchaSolver.solveCaptcha(imageBuffer, captchaPath);
            
//             if (!result.success) {
//                 throw new Error(`CAPTCHA solving failed: ${result.error}`);
//             }
            
//             const captchaText = result.captcha;
//             console.log(`✅ CAPTCHA solved: "${captchaText}" (confidence: ${result.confidence}%)`);
            
//             // ✅ Fill using the CORRECT input ID
//             await this.page.fill('#txtSecurityCode', captchaText);
//             console.log('📝 CAPTCHA filled in #txtSecurityCode');
            
//             return captchaText;
            
//         } catch (error) {
//             console.error('💥 CAPTCHA solving failed:', error.message);
//             throw error;
//         }
//     }

//     async submitForm() {
//         console.log('Submitting login form...');
//         // await this.page.click('#ibtLogIn');
//         await this.page.click('#btn_login');  // ✅ FIXED
        
//         // Wait for navigation after login submission
//         try {
//             console.log('⏳ Waiting for login response and redirect...');
            
//             // Wait for any navigation to occur
//             await this.page.waitForLoadState('networkidle', { timeout: 15000 });
            
//             // Give it a moment for any additional redirects
//             await this.page.waitForTimeout(3000);
            
//             const currentUrl = this.page.url();
//             console.log(`Final URL after login: ${currentUrl}`);
            
//             // Check if we successfully logged in (not on login page anymore)
//             if (!currentUrl.includes('login')) {
//                 console.log('✅ Login successful - redirected away from login page');
//                 return true;
//             } else {
//                 console.log('❌ Still on login page - login might have failed');
//                 return false;
//             }
            
//         } catch (error) {
//             console.log('Navigation timeout or error:', error.message);
            
//             // Check current URL even if navigation timed out
//             const currentUrl = this.page.url();
//             console.log(`Current URL after timeout: ${currentUrl}`);
            
//             if (!currentUrl.includes('login')) {
//                 console.log('✅ Login appears successful despite navigation timeout');
//                 return true;
//             } else {
//                 console.log('❌ Still on login page - might need to retry CAPTCHA');
//                 return false;
//             }
//         }
//     }

//     async handlePostLogin() {
//         console.log('🔍 Checking final landing page...');
        
//         try {
//             // Give a moment for any final redirects to complete
//             await this.page.waitForTimeout(2000);
            
//             const currentUrl = this.page.url();
//             console.log(`Final URL: ${currentUrl}`);
            
//             // Check what page we landed on
//             if (currentUrl.includes('frmAssignPlan.aspx')) {
//                 console.log('✅ Successfully landed on Assign Plan page');
//                 return { success: true, method: 'direct_redirect', url: currentUrl };
//             } else if (currentUrl.includes('Home.aspx')) {
//                 console.log('📍 Landed on Home page - navigating to Assign Plan...');
                
//                 // Try to navigate directly to Assign Plan page
//                 try {
//                     const assignPlanUrl = currentUrl.replace('/Home.aspx', '/frmAssignPlan.aspx');
//                     console.log(`🎯 Navigating to: ${assignPlanUrl}`);
                    
//                     await this.page.goto(assignPlanUrl, { waitUntil: 'networkidle' });
//                     await this.page.waitForTimeout(2000);
                    
//                     const newUrl = this.page.url();
//                     console.log(`Successfully navigated to: ${newUrl}`);
                    
//                     if (newUrl.includes('frmAssignPlan.aspx')) {
//                         console.log('✅ Successfully reached Assign Plan page');
//                         return { success: true, method: 'manual_navigation', url: newUrl };
//                     } else {
//                         console.log('⚠️  Navigation attempted but ended up elsewhere');
//                         return { success: false, method: 'navigation_failed', url: newUrl };
//                     }
                    
//                 } catch (navError) {
//                     console.error('❌ Failed to navigate to Assign Plan:', navError.message);
//                     return { success: false, method: 'navigation_error', error: navError.message };
//                 }
//             } else if (currentUrl.includes('Transaction')) {
//                 console.log('📍 Landed on Transaction area');
//                 return { success: true, method: 'transaction_area', url: currentUrl };
//             } else {
//                 console.log('📍 Landed on unknown page');
//                 return { success: true, method: 'unknown_page', url: currentUrl };
//             }
            
//         } catch (error) {
//             console.error('❌ Error checking post-login page:', error.message);
//             return { success: false, error: error.message };
//         }
//     }

//     async clickPackManagement() {
//         console.log('Looking for Pack Management button...');
        
//         try {
//             // Wait for the Pack Management image to be available
//             await this.page.waitForSelector('#MasterBody_imgPackManagement', { timeout: 5000 });
//             console.log('Pack Management button found!');
            
//             // Click the Pack Management image
//             await this.page.click('#MasterBody_imgPackManagement');
//             console.log('✅ Pack Management button clicked successfully');
            
//             // Wait for page to load after clicking
//             await this.page.waitForTimeout(3000);
            
//             // Check if navigation occurred
//             const currentUrl = this.page.url();
//             console.log(`Current URL after Pack Management click: ${currentUrl}`);
            
//             return { success: true, method: 'manual_click', url: currentUrl };
            
//         } catch (error) {
//             console.error('❌ Pack Management button not found or click failed:', error.message);
            
//             // Take a screenshot for debugging
//             try {
//                 await this.page.screenshot({ path: 'pack_management_error.png', fullPage: true });
//                 console.log('Screenshot saved as pack_management_error.png for debugging');
//             } catch (screenshotError) {
//                 console.error('Could not save screenshot:', screenshotError.message);
//             }
            
//             return { success: false, error: error.message };
//         }
//     }

//     async handleLoginProcess(username, password, maxRetries = 3) {
//         let attempts = 0;
        
//         while (attempts < maxRetries) {
//             try {
//                 console.log(`\n--- Attempt ${attempts + 1} of ${maxRetries} ---`);
                
//                 // Navigate to the page
//                 await this.navigateToLogin();
                
//                 // Fill credentials
//                 await this.fillCredentials(username, password);
                
//                 // Solve CAPTCHA
//                 const captchaText = await this.solveCaptcha();
                
//                 // Submit form
//                 const success = await this.submitForm();
                
//                 if (success) {
//                     console.log('✅ Login process completed successfully!');
                    
//                     // Handle post-login navigation (automatic redirects or Pack Management click)
//                     console.log('\n🎯 Handling post-login navigation...');
//                     const postLoginResult = await this.handlePostLogin();
                    
//                     if (postLoginResult.success) {
//                         let message = '';
//                         switch (postLoginResult.method) {
//                             case 'direct_redirect':
//                                 message = '🎯 Successfully redirected directly to Assign Plan page';
//                                 break;
//                             case 'manual_navigation':
//                                 message = '🎯 Successfully navigated to Assign Plan page from Home page';
//                                 break;
//                             case 'home_page':
//                                 message = '📍 Landed on Home page after login';
//                                 break;
//                             case 'transaction_area':
//                                 message = '📍 Landed in Transaction area';
//                                 break;
//                             case 'unknown_page':
//                                 message = `📍 Logged in successfully (URL: ${postLoginResult.url})`;
//                                 break;
//                         }
//                         console.log(message);
                        
//                         // Save session after successful navigation
//                         console.log('\n💾 Saving login session...');
//                         const sessionSaved = await this.saveSession();
                        
//                         return { 
//                             success: true, 
//                             attempts: attempts + 1, 
//                             captcha: captchaText,
//                             navigation: postLoginResult,
//                             sessionSaved: sessionSaved
//                         };
//                     } else {
//                         console.log('⚠️  Login successful but post-login navigation failed');
//                         return { 
//                             success: true, 
//                             attempts: attempts + 1, 
//                             captcha: captchaText,
//                             navigation: postLoginResult,
//                             sessionSaved: false
//                         };
//                     }
//                 } else {
//                     console.log('❌ Login submission failed, retrying...');
//                 }
                
//             } catch (error) {
//                 console.error(`Attempt ${attempts + 1} failed:`, error.message);
                
//                 // Try refreshing CAPTCHA if we're still on the page
//                 try {
//                     const currentUrl = this.page.url();
//                     if (currentUrl.includes('login')) {
//                         await this.refreshCaptcha();
//                         await this.page.waitForTimeout(1000);
//                     }
//                 } catch (refreshError) {
//                     console.error('Could not refresh CAPTCHA:', refreshError.message);
//                 }
//             }
            
//             attempts++;
            
//             if (attempts < maxRetries) {
//                 console.log(`Waiting before next attempt...`);
//                 await this.page.waitForTimeout(3000);
//             }
//         }
        
//         console.log(`❌ Failed to complete login after ${maxRetries} attempts`);
//         return { success: false, attempts: attempts };
//     }

//     async close() {
//         if (this.browser) {
//             await this.browser.close();
//             console.log('Browser closed');
//         }
//     }

//     async saveSession() {
//         try {
//             // Get cookies and storage state
//             const cookies = await this.page.context().cookies();
//             const storageState = await this.page.context().storageState();
            
//             const sessionData = {
//                 cookies: cookies,
//                 storageState: storageState,
//                 timestamp: new Date().toISOString(),
//                 baseUrl: 'https://cg.hathway-connect.com'
//             };
            
//             const sessionPath = path.join(__dirname, 'session.json');
//             fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
//             console.log('💾 Session saved to session.json');
            
//             return true;
//         } catch (error) {
//             console.error('❌ Failed to save session:', error.message);
//             return false;
//         }
//     }
// }

// // Usage example
// async function runLoginAutomation() {
//     const automation = new LoginAutomation();
    
//     try {
//         await automation.initialize();
        
//         // Replace with your actual credentials
//         const username = 'your_username'; // Your login username
//         const password = 'your_password'; // Your login password
        
//         const result = await automation.handleLoginProcess(username, password, 3);
        
//         if (result.success) {
//             console.log(`🎉 Success! Completed in ${result.attempts} attempt(s)`);
//             console.log(`Final CAPTCHA used: ${result.captcha}`);
            
//             if (result.sessionSaved) {
//                 console.log('💾 Session saved for future use');
//             }
            
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
//                     console.log('⚠️  Login successful but navigation issue occurred');
//                 }
//             }
//         } else {
//             console.log('😞 All attempts failed');
//         }
        
//     } catch (error) {
//         console.error('Fatal error:', error);
//     } finally {
//         await automation.close();
//     }
// }

// // Export for use as module
// module.exports = LoginAutomation;

// // Run directly if this file is executed
// if (require.main === module) {
//     runLoginAutomation();
// }


// new +++++++++++++++++++++++++++++++++++++++++++++++++++++

// const { chromium } = require('playwright');
// const fs = require('fs');
// const path = require('path');
// const HybridCaptchaSolver = require('./hybrid-captcha-solver'); // <-- keep your existing file

// class LoginAutomation {
//     /**
//      * @param {Object} opts
//      * @param {string} opts.username
//      * @param {string} opts.password
//      * @param {string} opts.stbNumber   - STB serial number to search for on the Renew page
//      * @param {boolean} [opts.headless] - run browser headless (default false, good for debugging)
//      * @param {string} [opts.label]     - label used in console logs, defaults to username.
//      *                                    Important when running many accounts at once so you
//      *                                    can tell their logs apart.
//      */
//     constructor({ username, password, stbNumber, headless = false, label = '' } = {}) {
//         this.username = username;
//         this.password = password;
//         this.stbNumber = stbNumber;
//         this.headless = headless;
//         this.label = label || username || 'automation';

//         this.browser = null;
//         this.context = null;
//         this.page = null;
//         this.baseUrl = 'https://gtplsaathi.com/';
//         this.captchaSolver = new HybridCaptchaSolver();
//     }

//     log(msg) {
//         console.log(`[${this.label}] ${msg}`);
//     }

//     async initialize() {
//         // NOTE: each LoginAutomation instance launches its OWN browser + context.
//         // That's what makes it safe to run many of these in parallel (see run-automation.js
//         // and api-server.js) - they never share cookies/session/state with each other.
//         this.browser = await chromium.launch({
//             headless: this.headless,
//             slowMo: this.headless ? 0 : 300,
//         });

//         this.context = await this.browser.newContext({
//             viewport: { width: 1280, height: 720 },
//             userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//         });

//         this.page = await this.context.newPage();
//     }

//     async navigateToLogin() {
//         this.log('Navigating to login page...');
//         await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
//         await this.page.waitForTimeout(2000);
//     }

//     async fillCredentials() {
//         this.log('Filling login credentials...');
//         await this.page.fill('#txtuser', this.username);
//         await this.page.fill('#txtpassword', this.password);
//     }

//     async refreshCaptcha() {
//         this.log('Refreshing CAPTCHA...');
//         await this.page.click('#imgRefresh');
//         await this.page.waitForTimeout(2000);
//     }

//     async solveCaptcha() {
//         this.log('Solving CAPTCHA...');
//         await this.page.waitForSelector('#imgSecurityCode', { timeout: 10000 });

//         const captchaElement = await this.page.$('#imgSecurityCode');
//         const base64Data = await captchaElement.evaluate((el) => el.src);

//         // Use the label in the filename so parallel runs don't overwrite each other's captcha.png
//         const captchaPath = path.join(__dirname, `captcha_${this.label}_${Date.now()}.png`);
//         const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
//         const imageBuffer = Buffer.from(base64Image, 'base64');
//         fs.writeFileSync(captchaPath, imageBuffer);

//         const result = await this.captchaSolver.solveCaptcha(imageBuffer, captchaPath);
//         if (!result.success) {
//             throw new Error(`CAPTCHA solving failed: ${result.error}`);
//         }

//         const captchaText = result.captcha;
//         this.log(`CAPTCHA solved: "${captchaText}" (${result.confidence}% confidence)`);
//         await this.page.fill('#txtSecurityCode', captchaText);

//         // clean up the captcha screenshot, we don't need it once solved
//         fs.unlink(captchaPath, () => {});

//         return captchaText;
//     }

//     async submitForm() {
//         this.log('Submitting login form...');
//         await this.page.click('#btn_login');

//         try {
//             await this.page.waitForLoadState('networkidle', { timeout: 15000 });
//         } catch (err) {
//             this.log(`Navigation wait warning: ${err.message}`);
//         }
//         await this.page.waitForTimeout(1500);

//         const currentUrl = this.page.url();
//         this.log(`URL after submit: ${currentUrl}`);
//         return !currentUrl.toLowerCase().includes('login');
//     }

//     /**
//      * Screenshot 1: "Your password is expiring soon" popup with
//      * "I'll do it later" / "Change password" buttons.
//      * This popup is NOT guaranteed to show up every login, so we just
//      * check for it briefly and click through it if present, otherwise move on.
//      */
//     async handlePasswordExpiryPopup(timeout = 8000) {
//         this.log('Checking for password-expiry popup...');

//         // IMPORTANT: isVisible() does NOT wait/poll — it checks once, instantly.
//         // waitFor({ state: 'visible' }) actually polls until the timeout, which is
//         // what we need since the popup can take a moment to render after login.
//         //
//         // Matching by regex (not an exact string with a straight apostrophe) also
//         // protects against sites that render the button text with a curly
//         // apostrophe (’) via &rsquo; — a hardcoded "I'll do it later" would silently
//         // never match that.
//         const laterBtn = this.page.getByText(/do it later/i).first();

//         try {
//             await laterBtn.waitFor({ state: 'visible', timeout });
//             this.log('Password-expiry popup detected — clicking "I\'ll do it later"');
//             await laterBtn.click();
//             await this.page.waitForTimeout(1000);
//         } catch (err) {
//             this.log('No password-expiry popup detected, continuing.');
//         }
//     }

//     /**
//      * Screenshot 2 (blank "auto redirect in 5 seconds" screen) is transient and
//      * disappears on its own within ~5-10s, after which the real dashboard
//      * (screenshot 3, with "Wallet Balance") appears. We just wait for that
//      * dashboard marker to show up rather than trying to detect/click anything
//      * on the redirect screen itself.
//      */
//     async waitForDashboard(timeout = 20000) {
//         this.log('Waiting for dashboard to finish loading...');
//         try {
//             // NOTE: "text=Wallet Balance" used to match 2 elements on this site -
//             // a hidden nav link plus the real visible balance widget - and
//             // Playwright kept waiting on whichever one it resolved first, which
//             // could be the hidden one. Racing the URL change against the visible
//             // logo text avoids that ambiguity entirely.
//             await Promise.race([
//                 this.page.waitForURL(/home\.aspx/i, { timeout }),
//                 this.page.waitForSelector('text=GTPL SAATHI', { timeout }),
//             ]);
//             this.log('Dashboard loaded.');
//         } catch (err) {
//             this.log(`Dashboard wait warning: ${err.message}`);
//             // Defensive: if the dashboard never showed up, it's often because the
//             // password-expiry popup rendered later than expected and is still
//             // blocking the page. Check for it one more time before giving up.
//             await this.handlePasswordExpiryPopup(5000);
//         }
//         // small buffer in case the redirect splash is still fading out
//         await this.page.waitForTimeout(1500);
//     }

//     /**
//      * Screenshot 4: sidebar item "Renew". We click the text label itself,
//      * not the dropdown caret next to it, and we scroll it into view first
//      * since it's further down the sidebar.
//      */
//     async clickRenew() {
//         this.log('Looking for the "Renew" sidebar item...');
//         const renewItems = this.page.locator('a:text-is("Renew"), li:text-is("Renew"), span:text-is("Renew")');

//         const countBefore = await renewItems.count();
//         this.log(`Found ${countBefore} element(s) matching "Renew" before click.`);

//         const first = renewItems.first();
//         await first.scrollIntoViewIfNeeded();
//         await first.waitFor({ state: 'visible', timeout: 10000 });
//         await first.click();
//         this.log('Clicked "Renew" (first match).');
//         await this.page.waitForTimeout(2000);

//         // Some sidebar menus only *expand* a submenu on the first click of a
//         // parent item, and the real navigable link (sometimes labelled the
//         // same, e.g. a child item also called "Renew") only appears after
//         // that. Do a quick, non-blocking check: if the STB field still isn't
//         // there, try again - clicking a newly-revealed match if one appeared,
//         // otherwise just clicking "Renew" a second time.
//         const stbAlreadyThere = await this.page
//             .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
//             .first()
//             .isVisible()
//             .catch(() => false);

//         if (!stbAlreadyThere) {
//             this.log('STB field not visible yet after first click - trying again...');
//             const countAfter = await renewItems.count();
//             if (countAfter > countBefore) {
//                 this.log(`A new "Renew"-labelled element appeared (${countAfter} total) - clicking the last one.`);
//                 await renewItems.last().click();
//             } else {
//                 await first.click();
//             }
//             await this.page.waitForTimeout(2000);
//         }
//     }

//     /**
//      * Screenshot 5: Renew page with "STB SERIAL #" input and "Search" button.
//      */
//     async searchStb() {
//         this.log(`Entering STB serial number: ${this.stbNumber}`);
//         // case-insensitive, partial match - tolerant of minor spacing/casing
//         // differences from the literal placeholder text in the screenshot
//         const stbInput = this.page
//             .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
//             .first();

//         try {
//             await stbInput.waitFor({ state: 'visible', timeout: 20000 });
//         } catch (err) {
//             // We couldn't find it - dump what's actually on the page so we can
//             // see the real placeholder text/selector instead of guessing again.
//             const debugPath = path.join(__dirname, `debug_renew_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});

//             const visibleInputs = await this.page
//                 .$$eval('input', (els) =>
//                     els
//                         .filter((e) => e.offsetParent !== null)
//                         .map((e) => ({ placeholder: e.placeholder, id: e.id, name: e.name }))
//                 )
//                 .catch(() => []);

//             this.log(`STB input not found. Debug screenshot saved: ${debugPath}`);
//             this.log(`Visible inputs on page: ${JSON.stringify(visibleInputs)}`);
//             this.log(`Current URL: ${this.page.url()}`);
//             throw err;
//         }

//         await stbInput.fill(this.stbNumber);

//         // exact match so this doesn't accidentally hit "Advance Search"
//         const searchBtn = this.page.getByRole('button', { name: 'Search', exact: true });
//         await searchBtn.click();
//         this.log('Clicked "Search".');
//         await this.page.waitForTimeout(3000);
//     }

//     /**
//      * Screenshot 6 (search results): a "PACKAGE DETAILS" section lists the
//      * customer's package(s), each with a checkbox in front of the name, and a
//      * green "Renew" button below to confirm. This "Renew" is a distinct
//      * <button> element from the sidebar "Renew" link clicked earlier -
//      * scoping to role "button" with an exact name keeps the two from colliding.
//      */
//     async selectPackagesAndRenew() {
//         this.log('Waiting for package details to load...');
//         try {
//             await this.page.waitForSelector('text=PACKAGE DETAILS', { timeout: 15000 });
//         } catch (err) {
//             const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
//             this.log(`PACKAGE DETAILS section not found. Debug screenshot saved: ${debugPath}`);
//             throw err;
//         }

//         // Confirmed from a live debug dump: the package checkbox is a real
//         // <input type="checkbox"> from an ASP.NET repeater, with id/name
//         // containing "chk_cn" (e.g. ContentPlaceHolder1_rptDC_chk_cn_0).
//         // Targeting that directly is far more reliable than trying to scope
//         // via the "PACKAGE DETAILS" header text, which wasn't matching it.
//         let packageCheckboxes = this.page.locator(
//             'input[type="checkbox"][id*="chk_cn"], input[type="checkbox"][name*="chk_cn"]'
//         );

//         // The row can render slightly after the header (AJAX), so poll
//         // instead of checking count() once.
//         let count = 0;
//         const deadline = Date.now() + 15000;
//         while (Date.now() < deadline) {
//             count = await packageCheckboxes.count();
//             if (count > 0) break;
//             await this.page.waitForTimeout(500);
//         }

//         this.log(`Found ${count} package checkbox(es) via "chk_cn" id/name pattern.`);

//         if (count === 0) {
//             // Fallback: if that id pattern ever changes, fall back to any
//             // checkbox on the page.
//             this.log('No "chk_cn" checkboxes found - falling back to any checkbox on the page.');
//             packageCheckboxes = this.page.locator('input[type="checkbox"]');
//             count = await packageCheckboxes.count();
//             this.log(`Found ${count} checkbox(es) via page-wide fallback.`);
//         }

//         if (count === 0) {
//             const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
//             this.log(`Debug screenshot: ${debugPath}`);
//             throw new Error('No package checkbox found on the page. See debug screenshot above.');
//         }

//         for (let i = 0; i < count; i++) {
//             const checkbox = packageCheckboxes.nth(i);
//             const alreadyChecked = await checkbox.isChecked().catch(() => false);
//             if (!alreadyChecked) {
//                 await checkbox.check();
//                 this.log(`Checked package checkbox #${i + 1}.`);
//             }
//         }

//         const renewBtn = this.page.getByRole('button', { name: 'Renew', exact: true });
//         await renewBtn.waitFor({ state: 'visible', timeout: 10000 });
//         await renewBtn.click();
//         this.log('Clicked the green "Renew" confirm button.');
//         await this.page.waitForTimeout(3000);
//     }

//     async close() {
//         if (this.browser) {
//             await this.browser.close();
//             this.log('Browser closed.');
//         }
//     }

//     /**
//      * Full end-to-end flow for ONE account: login -> popup -> dashboard ->
//      * Renew -> search STB. Retries the whole login on failure (fresh captcha
//      * each time) up to maxRetries.
//      */
//     async run(maxRetries = 3) {
//         let attempts = 0;

//         while (attempts < maxRetries) {
//             attempts++;
//             let loggedInThisAttempt = false;
//             try {
//                 this.log(`--- Attempt ${attempts} of ${maxRetries} ---`);

//                 await this.navigateToLogin();
//                 await this.fillCredentials();
//                 const captchaText = await this.solveCaptcha();
//                 const loggedIn = await this.submitForm();

//                 if (!loggedIn) {
//                     this.log('Login did not succeed, refreshing CAPTCHA and retrying...');
//                     await this.refreshCaptcha();
//                     continue;
//                 }

//                 loggedInThisAttempt = true;

//                 await this.handlePasswordExpiryPopup();
//                 await this.waitForDashboard();
//                 await this.clickRenew();
//                 await this.searchStb();
//                 await this.selectPackagesAndRenew();

//                 return {
//                     success: true,
//                     attempts,
//                     captcha: captchaText,
//                     stbNumber: this.stbNumber,
//                     finalUrl: this.page.url(),
//                 };
//             } catch (err) {
//                 this.log(`Attempt ${attempts} failed: ${err.message}`);

//                 const pageIsClosed = this.page?.isClosed?.() || /has been closed/i.test(err.message);
//                 if (pageIsClosed) {
//                     this.log('Browser/page closed unexpectedly - stopping retries for this run instead of continuing on a dead page.');
//                     this.log('(This is often the site itself closing the session after several rapid login attempts. Consider spacing out retries or lowering concurrency if this happens often.)');
//                     return { success: false, attempts, error: err.message };
//                 }

//                 if (loggedInThisAttempt) {
//                     // We were already past login when this failed - almost
//                     // certainly a selector/timing issue on a post-login page,
//                     // not a bad CAPTCHA. Re-attempting a full fresh login
//                     // won't fix that, and repeated rapid logins risk the site
//                     // closing the browser as an anti-automation measure. Fail
//                     // fast with the debug info already logged above instead.
//                     this.log('Failure happened after a successful login - not retrying with a fresh login. Check the debug screenshot/log above for the real cause.');
//                     return { success: false, attempts, error: err.message, failedAfterLogin: true };
//                 }

//                 if (attempts >= maxRetries) {
//                     return { success: false, attempts, error: err.message };
//                 }
//                 await this.page.waitForTimeout(2000).catch(() => {});
//             }
//         }

//         return { success: false, attempts };
//     }
// }

// module.exports = LoginAutomation;


// new 2.0 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const { chromium } = require('playwright');
// const fs = require('fs');
// const path = require('path');
// const HybridCaptchaSolver = require('./hybrid-captcha-solver'); // <-- keep your existing file

// class LoginAutomation {
//     /**
//      * @param {Object} opts
//      * @param {string} opts.username
//      * @param {string} opts.password
//      * @param {string} opts.stbNumber   - STB serial number to search for on the Renew page
//      * @param {boolean} [opts.headless] - run browser headless (default false, good for debugging)
//      * @param {string} [opts.label]     - label used in console logs, defaults to username.
//      *                                    Important when running many accounts at once so you
//      *                                    can tell their logs apart.
//      */
//     constructor({ username, password, stbNumber, headless = false, label = '' } = {}) {
//         this.username = username;
//         this.password = password;
//         this.stbNumber = stbNumber;
//         this.headless = headless;
//         this.label = label || username || 'automation';

//         this.browser = null;
//         this.context = null;
//         this.page = null;
//         this.baseUrl = 'https://gtplsaathi.com/';
//         this.captchaSolver = new HybridCaptchaSolver();
//     }

//     log(msg) {
//         console.log(`[${this.label}] ${msg}`);
//     }

//     async initialize() {
//         // NOTE: each LoginAutomation instance launches its OWN browser + context.
//         // That's what makes it safe to run many of these in parallel (see run-automation.js
//         // and api-server.js) - they never share cookies/session/state with each other.
//         this.browser = await chromium.launch({
//             headless: this.headless,
//             slowMo: this.headless ? 0 : 300,
//         });

//         this.context = await this.browser.newContext({
//             viewport: { width: 1280, height: 720 },
//             userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//         });

//         this.page = await this.context.newPage();
//     }

//     async navigateToLogin() {
//         this.log('Navigating to login page...');
//         await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
//         await this.page.waitForTimeout(2000);
//     }

//     async fillCredentials() {
//         this.log('Filling login credentials...');
//         await this.page.fill('#txtuser', this.username);
//         await this.page.fill('#txtpassword', this.password);
//     }

//     async refreshCaptcha() {
//         this.log('Refreshing CAPTCHA...');
//         await this.page.click('#imgRefresh');
//         await this.page.waitForTimeout(2000);
//     }

//     async solveCaptcha() {
//         this.log('Solving CAPTCHA...');
//         await this.page.waitForSelector('#imgSecurityCode', { timeout: 10000 });

//         const captchaElement = await this.page.$('#imgSecurityCode');
//         const base64Data = await captchaElement.evaluate((el) => el.src);

//         // Use the label in the filename so parallel runs don't overwrite each other's captcha.png
//         const captchaPath = path.join(__dirname, `captcha_${this.label}_${Date.now()}.png`);
//         const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
//         const imageBuffer = Buffer.from(base64Image, 'base64');
//         fs.writeFileSync(captchaPath, imageBuffer);

//         const result = await this.captchaSolver.solveCaptcha(imageBuffer, captchaPath);
//         if (!result.success) {
//             throw new Error(`CAPTCHA solving failed: ${result.error}`);
//         }

//         const captchaText = result.captcha;
//         this.log(`CAPTCHA solved: "${captchaText}" (${result.confidence}% confidence)`);
//         await this.page.fill('#txtSecurityCode', captchaText);

//         // clean up the captcha screenshot, we don't need it once solved
//         fs.unlink(captchaPath, () => {});

//         return captchaText;
//     }

//     async submitForm() {
//         this.log('Submitting login form...');
//         await this.page.click('#btn_login');

//         try {
//             await this.page.waitForLoadState('networkidle', { timeout: 15000 });
//         } catch (err) {
//             this.log(`Navigation wait warning: ${err.message}`);
//         }
//         await this.page.waitForTimeout(1500);

//         const currentUrl = this.page.url();
//         this.log(`URL after submit: ${currentUrl}`);
//         return !currentUrl.toLowerCase().includes('login');
//     }

//     /**
//      * Screenshot 1: "Your password is expiring soon" popup with
//      * "I'll do it later" / "Change password" buttons.
//      * This popup is NOT guaranteed to show up every login, so we just
//      * check for it briefly and click through it if present, otherwise move on.
//      */
//     async handlePasswordExpiryPopup(timeout = 8000) {
//         this.log('Checking for password-expiry popup...');

//         // IMPORTANT: isVisible() does NOT wait/poll — it checks once, instantly.
//         // waitFor({ state: 'visible' }) actually polls until the timeout, which is
//         // what we need since the popup can take a moment to render after login.
//         //
//         // Matching by regex (not an exact string with a straight apostrophe) also
//         // protects against sites that render the button text with a curly
//         // apostrophe (’) via &rsquo; — a hardcoded "I'll do it later" would silently
//         // never match that.
//         const laterBtn = this.page.getByText(/do it later/i).first();

//         try {
//             await laterBtn.waitFor({ state: 'visible', timeout });
//             this.log('Password-expiry popup detected — clicking "I\'ll do it later"');
//             await laterBtn.click();
//             await this.page.waitForTimeout(1000);
//         } catch (err) {
//             this.log('No password-expiry popup detected, continuing.');
//         }
//     }

//     /**
//      * Screenshot 2 (blank "auto redirect in 5 seconds" screen) is transient and
//      * disappears on its own within ~5-10s, after which the real dashboard
//      * (screenshot 3, with "Wallet Balance") appears. We just wait for that
//      * dashboard marker to show up rather than trying to detect/click anything
//      * on the redirect screen itself.
//      */
//     async waitForDashboard(timeout = 20000) {
//         this.log('Waiting for dashboard to finish loading...');
//         try {
//             // NOTE: "text=Wallet Balance" used to match 2 elements on this site -
//             // a hidden nav link plus the real visible balance widget - and
//             // Playwright kept waiting on whichever one it resolved first, which
//             // could be the hidden one. Racing the URL change against the visible
//             // logo text avoids that ambiguity entirely.
//             await Promise.race([
//                 this.page.waitForURL(/home\.aspx/i, { timeout }),
//                 this.page.waitForSelector('text=GTPL SAATHI', { timeout }),
//             ]);
//             this.log('Dashboard loaded.');
//         } catch (err) {
//             this.log(`Dashboard wait warning: ${err.message}`);
//             // Defensive: if the dashboard never showed up, it's often because the
//             // password-expiry popup rendered later than expected and is still
//             // blocking the page. Check for it one more time before giving up.
//             await this.handlePasswordExpiryPopup(5000);
//         }
//         // small buffer in case the redirect splash is still fading out
//         await this.page.waitForTimeout(1500);
//     }

//     /**
//      * Screenshot 4: sidebar item "Renew". We click the text label itself,
//      * not the dropdown caret next to it, and we scroll it into view first
//      * since it's further down the sidebar.
//      */
//     async clickRenew() {
//         this.log('Looking for the "Renew" sidebar item...');
//         const renewItems = this.page.locator('a:text-is("Renew"), li:text-is("Renew"), span:text-is("Renew")');

//         const countBefore = await renewItems.count();
//         this.log(`Found ${countBefore} element(s) matching "Renew" before click.`);

//         const first = renewItems.first();
//         await first.scrollIntoViewIfNeeded();
//         await first.waitFor({ state: 'visible', timeout: 10000 });
//         await first.click();
//         this.log('Clicked "Renew" (first match).');
//         await this.page.waitForTimeout(2000);

//         // Some sidebar menus only *expand* a submenu on the first click of a
//         // parent item, and the real navigable link (sometimes labelled the
//         // same, e.g. a child item also called "Renew") only appears after
//         // that. Do a quick, non-blocking check: if the STB field still isn't
//         // there, try again - clicking a newly-revealed match if one appeared,
//         // otherwise just clicking "Renew" a second time.
//         const stbAlreadyThere = await this.page
//             .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
//             .first()
//             .isVisible()
//             .catch(() => false);

//         if (!stbAlreadyThere) {
//             this.log('STB field not visible yet after first click - trying again...');
//             const countAfter = await renewItems.count();
//             if (countAfter > countBefore) {
//                 this.log(`A new "Renew"-labelled element appeared (${countAfter} total) - clicking the last one.`);
//                 await renewItems.last().click();
//             } else {
//                 await first.click();
//             }
//             await this.page.waitForTimeout(2000);
//         }
//     }

//     /**
//      * Screenshot 5: Renew page with "STB SERIAL #" input and "Search" button.
//      */
//     async searchStb() {
//         this.log(`Entering STB serial number: ${this.stbNumber}`);
//         // case-insensitive, partial match - tolerant of minor spacing/casing
//         // differences from the literal placeholder text in the screenshot
//         const stbInput = this.page
//             .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
//             .first();

//         try {
//             await stbInput.waitFor({ state: 'visible', timeout: 20000 });
//         } catch (err) {
//             // We couldn't find it - dump what's actually on the page so we can
//             // see the real placeholder text/selector instead of guessing again.
//             const debugPath = path.join(__dirname, `debug_renew_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});

//             const visibleInputs = await this.page
//                 .$$eval('input', (els) =>
//                     els
//                         .filter((e) => e.offsetParent !== null)
//                         .map((e) => ({ placeholder: e.placeholder, id: e.id, name: e.name }))
//                 )
//                 .catch(() => []);

//             this.log(`STB input not found. Debug screenshot saved: ${debugPath}`);
//             this.log(`Visible inputs on page: ${JSON.stringify(visibleInputs)}`);
//             this.log(`Current URL: ${this.page.url()}`);
//             throw err;
//         }

//         await stbInput.fill(this.stbNumber);

//         // exact match so this doesn't accidentally hit "Advance Search"
//         const searchBtn = this.page.getByRole('button', { name: 'Search', exact: true });
//         await searchBtn.click();
//         this.log('Clicked "Search".');
//         await this.page.waitForTimeout(3000);
//     }

//     /**
//      * Screenshot 6 (search results): a "PACKAGE DETAILS" section lists the
//      * customer's package(s), each with a checkbox in front of the name, and a
//      * green "Renew" button below to confirm. This "Renew" is a distinct
//      * <button> element from the sidebar "Renew" link clicked earlier -
//      * scoping to role "button" with an exact name keeps the two from colliding.
//      */
//     async selectPackagesAndRenew() {
//         this.log('Waiting for package details to load...');
//         try {
//             await this.page.waitForSelector('text=PACKAGE DETAILS', { timeout: 15000 });
//         } catch (err) {
//             const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
//             this.log(`PACKAGE DETAILS section not found. Debug screenshot saved: ${debugPath}`);
//             throw err;
//         }

//         // Confirmed from a live debug dump: the package checkbox is a real
//         // <input type="checkbox"> from an ASP.NET repeater, with id/name
//         // containing "chk_cn" (e.g. ContentPlaceHolder1_rptDC_chk_cn_0).
//         // Targeting that directly is far more reliable than trying to scope
//         // via the "PACKAGE DETAILS" header text, which wasn't matching it.
//         let packageCheckboxes = this.page.locator(
//             'input[type="checkbox"][id*="chk_cn"], input[type="checkbox"][name*="chk_cn"]'
//         );

//         // The row can render slightly after the header (AJAX), so poll
//         // instead of checking count() once.
//         let count = 0;
//         const deadline = Date.now() + 15000;
//         while (Date.now() < deadline) {
//             count = await packageCheckboxes.count();
//             if (count > 0) break;
//             await this.page.waitForTimeout(500);
//         }

//         this.log(`Found ${count} package checkbox(es) via "chk_cn" id/name pattern.`);

//         if (count === 0) {
//             // Fallback: if that id pattern ever changes, fall back to any
//             // checkbox on the page.
//             this.log('No "chk_cn" checkboxes found - falling back to any checkbox on the page.');
//             packageCheckboxes = this.page.locator('input[type="checkbox"]');
//             count = await packageCheckboxes.count();
//             this.log(`Found ${count} checkbox(es) via page-wide fallback.`);
//         }

//         if (count === 0) {
//             const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
//             this.log(`Debug screenshot: ${debugPath}`);
//             throw new Error('No package checkbox found on the page. See debug screenshot above.');
//         }

//         for (let i = 0; i < count; i++) {
//             const checkbox = packageCheckboxes.nth(i);
//             const alreadyChecked = await checkbox.isChecked().catch(() => false);
//             if (!alreadyChecked) {
//                 await checkbox.check();
//                 this.log(`Checked package checkbox #${i + 1}.`);
//             }
//         }

//         const renewBtn = this.page.getByRole('button', { name: 'Renew', exact: true });
//         await renewBtn.waitFor({ state: 'visible', timeout: 10000 });
//         await renewBtn.click();
//         this.log('Clicked the green "Renew" confirm button.');
//         await this.page.waitForTimeout(3000);
//     }

//     /**
//      * After confirming renewal, the site lands back on the Renew search page
//      * (STB + account prefilled), sometimes showing a transient Oracle error
//      * banner ("ORA-01422: ...") which we ignore. We click Search again to
//      * pull fresh details, and poll until Status flips from INACTIVE to
//      * ACTIVE, then read the updated Due Date off the same results panel.
//      *
//      * IMPORTANT: we match the whole word after "Status :" rather than a bare
//      * /active/i regex, since "active" is a substring of "INACTIVE" - a loose
//      * match would falsely report success on the very first check.
//      */
//     async confirmRenewalAndGetDueDate(maxWaitMs = 120000, pollIntervalMs = 5000) {
//         this.log('Confirming renewal status...');

//         const searchBtn = this.page.getByRole('button', { name: 'Search', exact: true });
//         await searchBtn.waitFor({ state: 'visible', timeout: 15000 });

//         const deadline = Date.now() + maxWaitMs;
//         let lastStatus = null;

//         while (Date.now() < deadline) {
//             await searchBtn.click();
//             this.log('Clicked "Search" to re-check renewal status...');
//             await this.page.waitForTimeout(3000);

//             const pageText = await this.page.evaluate(() => document.body.innerText).catch(() => '');
//             const statusMatch = pageText.match(/Status\s*:\s*([A-Za-z]+)/i);
//             lastStatus = statusMatch ? statusMatch[1].toUpperCase() : null;
//             this.log(`Current status: ${lastStatus}`);

//             if (lastStatus === 'ACTIVE') {
//                 const dueDateMatch = pageText.match(/Due Date\s*:\s*([\d/.\-]+)/i);
//                 const dueDate = dueDateMatch ? dueDateMatch[1].trim() : null;
//                 this.log(`Renewal is ACTIVE. Updated due date: ${dueDate}`);
//                 return { status: 'ACTIVE', dueDate };
//             }

//             await this.page.waitForTimeout(pollIntervalMs);
//         }

//         throw new Error(`Timed out waiting for status to become ACTIVE (last seen: ${lastStatus})`);
//     }

//     async close() {
//         if (this.browser) {
//             await this.browser.close();
//             this.log('Browser closed.');
//         }
//     }

//     /**
//      * Full end-to-end flow for ONE account: login -> popup -> dashboard ->
//      * Renew -> search STB. Retries the whole login on failure (fresh captcha
//      * each time) up to maxRetries.
//      */
//     async run(maxRetries = 3) {
//         let attempts = 0;

//         while (attempts < maxRetries) {
//             attempts++;
//             let loggedInThisAttempt = false;
//             try {
//                 this.log(`--- Attempt ${attempts} of ${maxRetries} ---`);

//                 await this.navigateToLogin();
//                 await this.fillCredentials();
//                 const captchaText = await this.solveCaptcha();
//                 const loggedIn = await this.submitForm();

//                 if (!loggedIn) {
//                     this.log('Login did not succeed, refreshing CAPTCHA and retrying...');
//                     await this.refreshCaptcha();
//                     continue;
//                 }

//                 loggedInThisAttempt = true;

//                 await this.handlePasswordExpiryPopup();
//                 await this.waitForDashboard();
//                 await this.clickRenew();
//                 await this.searchStb();
//                 await this.selectPackagesAndRenew();
//                 const renewalResult = await this.confirmRenewalAndGetDueDate();

//                 return {
//                     success: true,
//                     attempts,
//                     captcha: captchaText,
//                     username: this.username,
//                     password: this.password,
//                     stb: this.stbNumber,
//                     status: renewalResult.status,
//                     dueDate: renewalResult.dueDate,
//                     finalUrl: this.page.url(),
//                 };
//             } catch (err) {
//                 this.log(`Attempt ${attempts} failed: ${err.message}`);

//                 const pageIsClosed = this.page?.isClosed?.() || /has been closed/i.test(err.message);
//                 if (pageIsClosed) {
//                     this.log('Browser/page closed unexpectedly - stopping retries for this run instead of continuing on a dead page.');
//                     this.log('(This is often the site itself closing the session after several rapid login attempts. Consider spacing out retries or lowering concurrency if this happens often.)');
//                     return { success: false, attempts, error: err.message, username: this.username, password: this.password, stb: this.stbNumber };
//                 }

//                 if (loggedInThisAttempt) {
//                     // We were already past login when this failed - almost
//                     // certainly a selector/timing issue on a post-login page,
//                     // not a bad CAPTCHA. Re-attempting a full fresh login
//                     // won't fix that, and repeated rapid logins risk the site
//                     // closing the browser as an anti-automation measure. Fail
//                     // fast with the debug info already logged above instead.
//                     this.log('Failure happened after a successful login - not retrying with a fresh login. Check the debug screenshot/log above for the real cause.');
//                     return { success: false, attempts, error: err.message, failedAfterLogin: true, username: this.username, password: this.password, stb: this.stbNumber };
//                 }

//                 if (attempts >= maxRetries) {
//                     return { success: false, attempts, error: err.message, username: this.username, password: this.password, stb: this.stbNumber };
//                 }
//                 await this.page.waitForTimeout(2000).catch(() => {});
//             }
//         }

//         return { success: false, attempts, username: this.username, password: this.password, stb: this.stbNumber };
//     }
// }

// module.exports = LoginAutomation;

// last +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const { chromium } = require('playwright');
// const fs = require('fs');
// const path = require('path');
// const HybridCaptchaSolver = require('./hybrid-captcha-solver'); // <-- keep your existing file

// class LoginAutomation {
//     /**
//      * @param {Object} opts
//      * @param {string} opts.username
//      * @param {string} opts.password
//      * @param {string} opts.stbNumber   - STB serial number to search for on the Renew page
//      * @param {boolean} [opts.headless] - run browser headless (default false, good for debugging)
//      * @param {string} [opts.label]     - label used in console logs, defaults to username.
//      *                                    Important when running many accounts at once so you
//      *                                    can tell their logs apart.
//      */
//     constructor({ username, password, stbNumber, headless = false, label = '' } = {}) {
//         this.username = username;
//         this.password = password;
//         this.stbNumber = stbNumber;
//         this.headless = headless;
//         this.label = label || username || 'automation';

//         this.browser = null;
//         this.context = null;
//         this.page = null;
//         this.baseUrl = 'https://gtplsaathi.com/';
//         this.captchaSolver = new HybridCaptchaSolver();
//     }

//     log(msg) {
//         console.log(`[${this.label}] ${msg}`);
//     }

//     async initialize() {
//         // NOTE: each LoginAutomation instance launches its OWN browser + context.
//         // That's what makes it safe to run many of these in parallel (see run-automation.js
//         // and api-server.js) - they never share cookies/session/state with each other.
//         this.browser = await chromium.launch({
//             headless: this.headless,
//             slowMo: this.headless ? 0 : 300,
//         });

//         this.context = await this.browser.newContext({
//             viewport: { width: 1280, height: 720 },
//             userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//         });

//         this.page = await this.context.newPage();
//     }

//     async navigateToLogin() {
//         this.log('Navigating to login page...');
//         await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
//         await this.page.waitForTimeout(2000);
//     }

//     async fillCredentials() {
//         this.log('Filling login credentials...');
//         await this.page.fill('#txtuser', this.username);
//         await this.page.fill('#txtpassword', this.password);
//     }

//     async refreshCaptcha() {
//         this.log('Refreshing CAPTCHA...');
//         await this.page.click('#imgRefresh');
//         await this.page.waitForTimeout(2000);
//     }

//     async solveCaptcha() {
//         this.log('Solving CAPTCHA...');
//         await this.page.waitForSelector('#imgSecurityCode', { timeout: 10000 });

//         const captchaElement = await this.page.$('#imgSecurityCode');
//         const base64Data = await captchaElement.evaluate((el) => el.src);

//         // Use the label in the filename so parallel runs don't overwrite each other's captcha.png
//         const captchaPath = path.join(__dirname, `captcha_${this.label}_${Date.now()}.png`);
//         const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
//         const imageBuffer = Buffer.from(base64Image, 'base64');
//         fs.writeFileSync(captchaPath, imageBuffer);

//         const result = await this.captchaSolver.solveCaptcha(imageBuffer, captchaPath);
//         if (!result.success) {
//             throw new Error(`CAPTCHA solving failed: ${result.error}`);
//         }

//         const captchaText = result.captcha;
//         this.log(`CAPTCHA solved: "${captchaText}" (${result.confidence}% confidence)`);
//         await this.page.fill('#txtSecurityCode', captchaText);

//         // clean up the captcha screenshot, we don't need it once solved
//         fs.unlink(captchaPath, () => {});

//         return captchaText;
//     }

//     async submitForm() {
//         this.log('Submitting login form...');
//         await this.page.click('#btn_login');

//         try {
//             await this.page.waitForLoadState('networkidle', { timeout: 15000 });
//         } catch (err) {
//             this.log(`Navigation wait warning: ${err.message}`);
//         }
//         await this.page.waitForTimeout(1500);

//         const currentUrl = this.page.url();
//         this.log(`URL after submit: ${currentUrl}`);
//         return !currentUrl.toLowerCase().includes('login');
//     }

//     /**
//      * Screenshot 1: "Your password is expiring soon" popup with
//      * "I'll do it later" / "Change password" buttons.
//      * This popup is NOT guaranteed to show up every login, so we just
//      * check for it briefly and click through it if present, otherwise move on.
//      */
//     async handlePasswordExpiryPopup(timeout = 8000) {
//         this.log('Checking for password-expiry popup...');

//         // IMPORTANT: isVisible() does NOT wait/poll — it checks once, instantly.
//         // waitFor({ state: 'visible' }) actually polls until the timeout, which is
//         // what we need since the popup can take a moment to render after login.
//         //
//         // Matching by regex (not an exact string with a straight apostrophe) also
//         // protects against sites that render the button text with a curly
//         // apostrophe (’) via &rsquo; — a hardcoded "I'll do it later" would silently
//         // never match that.
//         const laterBtn = this.page.getByText(/do it later/i).first();

//         try {
//             await laterBtn.waitFor({ state: 'visible', timeout });
//             this.log('Password-expiry popup detected — clicking "I\'ll do it later"');
//             await laterBtn.click();
//             await this.page.waitForTimeout(1000);
//         } catch (err) {
//             this.log('No password-expiry popup detected, continuing.');
//         }
//     }

//     /**
//      * Screenshot 2 (blank "auto redirect in 5 seconds" screen) is transient and
//      * disappears on its own within ~5-10s, after which the real dashboard
//      * (screenshot 3, with "Wallet Balance") appears. We just wait for that
//      * dashboard marker to show up rather than trying to detect/click anything
//      * on the redirect screen itself.
//      */
//     async waitForDashboard(timeout = 20000) {
//         this.log('Waiting for dashboard to finish loading...');
//         try {
//             // NOTE: "text=Wallet Balance" used to match 2 elements on this site -
//             // a hidden nav link plus the real visible balance widget - and
//             // Playwright kept waiting on whichever one it resolved first, which
//             // could be the hidden one. Racing the URL change against the visible
//             // logo text avoids that ambiguity entirely.
//             await Promise.race([
//                 this.page.waitForURL(/home\.aspx/i, { timeout }),
//                 this.page.waitForSelector('text=GTPL SAATHI', { timeout }),
//             ]);
//             this.log('Dashboard loaded.');
//         } catch (err) {
//             this.log(`Dashboard wait warning: ${err.message}`);
//             // Defensive: if the dashboard never showed up, it's often because the
//             // password-expiry popup rendered later than expected and is still
//             // blocking the page. Check for it one more time before giving up.
//             await this.handlePasswordExpiryPopup(5000);
//         }
//         // small buffer in case the redirect splash is still fading out
//         await this.page.waitForTimeout(1500);
//     }

//     /**
//      * Screenshot 4: sidebar item "Renew". We click the text label itself,
//      * not the dropdown caret next to it, and we scroll it into view first
//      * since it's further down the sidebar.
//      */
//     async clickRenew() {
//         this.log('Looking for the "Renew" sidebar item...');
//         const renewItems = this.page.locator('a:text-is("Renew"), li:text-is("Renew"), span:text-is("Renew")');

//         const countBefore = await renewItems.count();
//         this.log(`Found ${countBefore} element(s) matching "Renew" before click.`);

//         const first = renewItems.first();
//         await first.scrollIntoViewIfNeeded();
//         await first.waitFor({ state: 'visible', timeout: 10000 });
//         await first.click();
//         this.log('Clicked "Renew" (first match).');
//         await this.page.waitForTimeout(2000);

//         // Some sidebar menus only *expand* a submenu on the first click of a
//         // parent item, and the real navigable link (sometimes labelled the
//         // same, e.g. a child item also called "Renew") only appears after
//         // that. Do a quick, non-blocking check: if the STB field still isn't
//         // there, try again - clicking a newly-revealed match if one appeared,
//         // otherwise just clicking "Renew" a second time.
//         const stbAlreadyThere = await this.page
//             .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
//             .first()
//             .isVisible()
//             .catch(() => false);

//         if (!stbAlreadyThere) {
//             this.log('STB field not visible yet after first click - trying again...');
//             const countAfter = await renewItems.count();
//             if (countAfter > countBefore) {
//                 this.log(`A new "Renew"-labelled element appeared (${countAfter} total) - clicking the last one.`);
//                 await renewItems.last().click();
//             } else {
//                 await first.click();
//             }
//             await this.page.waitForTimeout(2000);
//         }
//     }

//     /**
//      * Screenshot 5: Renew page with "STB SERIAL #" input and "Search" button.
//      */
//     async searchStb() {
//         this.log(`Entering STB serial number: ${this.stbNumber}`);
//         // case-insensitive, partial match - tolerant of minor spacing/casing
//         // differences from the literal placeholder text in the screenshot
//         const stbInput = this.page
//             .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
//             .first();

//         try {
//             await stbInput.waitFor({ state: 'visible', timeout: 20000 });
//         } catch (err) {
//             // We couldn't find it - dump what's actually on the page so we can
//             // see the real placeholder text/selector instead of guessing again.
//             const debugPath = path.join(__dirname, `debug_renew_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});

//             const visibleInputs = await this.page
//                 .$$eval('input', (els) =>
//                     els
//                         .filter((e) => e.offsetParent !== null)
//                         .map((e) => ({ placeholder: e.placeholder, id: e.id, name: e.name }))
//                 )
//                 .catch(() => []);

//             this.log(`STB input not found. Debug screenshot saved: ${debugPath}`);
//             this.log(`Visible inputs on page: ${JSON.stringify(visibleInputs)}`);
//             this.log(`Current URL: ${this.page.url()}`);
//             throw err;
//         }

//         await stbInput.fill(this.stbNumber);

//         // exact match so this doesn't accidentally hit "Advance Search"
//         const searchBtn = this.page.getByRole('button', { name: 'Search', exact: true });
//         await searchBtn.click();
//         this.log('Clicked "Search".');
//         await this.page.waitForTimeout(3000);
//     }

//     /**
//      * Screenshot 6 (search results): a "PACKAGE DETAILS" section lists the
//      * customer's package(s), each with a checkbox in front of the name, and a
//      * green "Renew" button below to confirm. This "Renew" is a distinct
//      * <button> element from the sidebar "Renew" link clicked earlier -
//      * scoping to role "button" with an exact name keeps the two from colliding.
//      */
//     async selectPackagesAndRenew() {
//         this.log('Waiting for package details to load...');
//         try {
//             await this.page.waitForSelector('text=PACKAGE DETAILS', { timeout: 15000 });
//         } catch (err) {
//             const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
//             this.log(`PACKAGE DETAILS section not found. Debug screenshot saved: ${debugPath}`);
//             throw err;
//         }

//         // Confirmed from a live debug dump: the package checkbox is a real
//         // <input type="checkbox"> from an ASP.NET repeater, with id/name
//         // containing "chk_cn" (e.g. ContentPlaceHolder1_rptDC_chk_cn_0).
//         // Targeting that directly is far more reliable than trying to scope
//         // via the "PACKAGE DETAILS" header text, which wasn't matching it.
//         let packageCheckboxes = this.page.locator(
//             'input[type="checkbox"][id*="chk_cn"], input[type="checkbox"][name*="chk_cn"]'
//         );

//         // The row can render slightly after the header (AJAX), so poll
//         // instead of checking count() once.
//         let count = 0;
//         const deadline = Date.now() + 15000;
//         while (Date.now() < deadline) {
//             count = await packageCheckboxes.count();
//             if (count > 0) break;
//             await this.page.waitForTimeout(500);
//         }

//         this.log(`Found ${count} package checkbox(es) via "chk_cn" id/name pattern.`);

//         if (count === 0) {
//             // Fallback: if that id pattern ever changes, fall back to any
//             // checkbox on the page.
//             this.log('No "chk_cn" checkboxes found - falling back to any checkbox on the page.');
//             packageCheckboxes = this.page.locator('input[type="checkbox"]');
//             count = await packageCheckboxes.count();
//             this.log(`Found ${count} checkbox(es) via page-wide fallback.`);
//         }

//         if (count === 0) {
//             const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
//             this.log(`Debug screenshot: ${debugPath}`);
//             throw new Error('No package checkbox found on the page. See debug screenshot above.');
//         }

//         for (let i = 0; i < count; i++) {
//             const checkbox = packageCheckboxes.nth(i);
//             const alreadyChecked = await checkbox.isChecked().catch(() => false);
//             if (!alreadyChecked) {
//                 await checkbox.check();
//                 this.log(`Checked package checkbox #${i + 1}.`);
//             }
//         }

//         const renewBtn = this.page.getByRole('button', { name: 'Renew', exact: true });
//         await renewBtn.waitFor({ state: 'visible', timeout: 10000 });
//         await renewBtn.click();
//         this.log('Clicked the green "Renew" confirm button.');
//         await this.page.waitForTimeout(3000);
//     }

//     /**
//      * After confirming renewal, the site lands back on the Renew search page
//      * (STB + account prefilled), sometimes showing a transient Oracle error
//      * banner ("ORA-01422: ...") which we ignore. We click Search once to
//      * pull fresh details and read whatever Due Date is showing right away -
//      * no waiting for Status to flip to ACTIVE.
//      */
//     async confirmRenewalAndGetDueDate() {
//         this.log('Fetching updated due date...');

//         const searchBtn = this.page.getByRole('button', { name: 'Search', exact: true });
//         await searchBtn.waitFor({ state: 'visible', timeout: 15000 });
//         await searchBtn.click();
//         this.log('Clicked "Search" to pull the updated details.');
//         await this.page.waitForTimeout(3000);

//         const pageText = await this.page.evaluate(() => document.body.innerText).catch(() => '');

//         const statusMatch = pageText.match(/Status\s*:\s*([A-Za-z]+)/i);
//         const status = statusMatch ? statusMatch[1].toUpperCase() : null;

//         const dueDateMatch = pageText.match(/Due Date\s*:\s*([\d/.\-]+)/i);
//         const dueDate = dueDateMatch ? dueDateMatch[1].trim() : null;

//         this.log(`Status: ${status}, Due date: ${dueDate}`);

//         if (!dueDate) {
//             const debugPath = path.join(__dirname, `debug_duedate_${this.label}_${Date.now()}.png`);
//             await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
//             this.log(`Could not find a Due Date on the page. Debug screenshot saved: ${debugPath}`);
//         }

//         return { status, dueDate };
//     }

//     async close() {
//         if (this.browser) {
//             await this.browser.close();
//             this.log('Browser closed.');
//         }
//     }

//     /**
//      * Full end-to-end flow for ONE account: login -> popup -> dashboard ->
//      * Renew -> search STB. Retries the whole login on failure (fresh captcha
//      * each time) up to maxRetries.
//      */
//     async run(maxRetries = 3) {
//         let attempts = 0;

//         while (attempts < maxRetries) {
//             attempts++;
//             let loggedInThisAttempt = false;
//             try {
//                 this.log(`--- Attempt ${attempts} of ${maxRetries} ---`);

//                 await this.navigateToLogin();
//                 await this.fillCredentials();
//                 const captchaText = await this.solveCaptcha();
//                 const loggedIn = await this.submitForm();

//                 if (!loggedIn) {
//                     this.log('Login did not succeed, refreshing CAPTCHA and retrying...');
//                     await this.refreshCaptcha();
//                     continue;
//                 }

//                 loggedInThisAttempt = true;

//                 await this.handlePasswordExpiryPopup();
//                 await this.waitForDashboard();
//                 await this.clickRenew();
//                 await this.searchStb();
//                 await this.selectPackagesAndRenew();
//                 const renewalResult = await this.confirmRenewalAndGetDueDate();

//                 return {
//                     success: true,
//                     attempts,
//                     captcha: captchaText,
//                     username: this.username,
//                     password: this.password,
//                     stb: this.stbNumber,
//                     status: renewalResult.status,
//                     dueDate: renewalResult.dueDate,
//                     finalUrl: this.page.url(),
//                 };
//             } catch (err) {
//                 this.log(`Attempt ${attempts} failed: ${err.message}`);

//                 const pageIsClosed = this.page?.isClosed?.() || /has been closed/i.test(err.message);
//                 if (pageIsClosed) {
//                     this.log('Browser/page closed unexpectedly - stopping retries for this run instead of continuing on a dead page.');
//                     this.log('(This is often the site itself closing the session after several rapid login attempts. Consider spacing out retries or lowering concurrency if this happens often.)');
//                     return { success: false, attempts, error: err.message, username: this.username, password: this.password, stb: this.stbNumber };
//                 }

//                 if (loggedInThisAttempt) {
//                     // We were already past login when this failed - almost
//                     // certainly a selector/timing issue on a post-login page,
//                     // not a bad CAPTCHA. Re-attempting a full fresh login
//                     // won't fix that, and repeated rapid logins risk the site
//                     // closing the browser as an anti-automation measure. Fail
//                     // fast with the debug info already logged above instead.
//                     this.log('Failure happened after a successful login - not retrying with a fresh login. Check the debug screenshot/log above for the real cause.');
//                     return { success: false, attempts, error: err.message, failedAfterLogin: true, username: this.username, password: this.password, stb: this.stbNumber };
//                 }

//                 if (attempts >= maxRetries) {
//                     return { success: false, attempts, error: err.message, username: this.username, password: this.password, stb: this.stbNumber };
//                 }
//                 await this.page.waitForTimeout(2000).catch(() => {});
//             }
//         }

//         return { success: false, attempts, username: this.username, password: this.password, stb: this.stbNumber };
//     }
// }

// module.exports = LoginAutomation;


// hehhehehehehhe +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const HybridCaptchaSolver = require('./hybrid-captcha-solver'); // <-- keep your existing file

class LoginAutomation {
    /**
     * @param {Object} opts
     * @param {string} opts.username
     * @param {string} opts.password
     * @param {string} opts.stbNumber   - STB serial number to search for on the Renew page
     * @param {boolean} [opts.headless] - run browser headless (default false, good for debugging)
     * @param {string} [opts.label]     - label used in console logs, defaults to username.
     *                                    Important when running many accounts at once so you
     *                                    can tell their logs apart.
     */
    constructor({ username, password, stbNumber, headless = false, label = '' } = {}) {
        this.username = username;
        this.password = password;
        this.stbNumber = stbNumber;
        this.headless = headless;
        this.label = label || username || 'automation';

        this.browser = null;
        this.context = null;
        this.page = null;
        this.baseUrl = 'https://gtplsaathi.com/';
        this.captchaSolver = new HybridCaptchaSolver();
    }

    log(msg) {
        console.log(`[${this.label}] ${msg}`);
    }

    async initialize() {
        // NOTE: each LoginAutomation instance launches its OWN browser + context.
        // That's what makes it safe to run many of these in parallel (see run-automation.js
        // and api-server.js) - they never share cookies/session/state with each other.
        this.browser = await chromium.launch({
            headless: this.headless,
            slowMo: this.headless ? 0 : 300,
        });

        this.context = await this.browser.newContext({
            viewport: { width: 1280, height: 720 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        });

        this.page = await this.context.newPage();
    }

    async navigateToLogin() {
        this.log('Navigating to login page...');
        await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
        await this.page.waitForTimeout(2000);
    }

    async fillCredentials() {
        this.log('Filling login credentials...');
        await this.page.fill('#txtuser', this.username);
        await this.page.fill('#txtpassword', this.password);
    }

    async refreshCaptcha() {
        this.log('Refreshing CAPTCHA...');
        await this.page.click('#imgRefresh');
        await this.page.waitForTimeout(2000);
    }

    async solveCaptcha() {
        this.log('Solving CAPTCHA...');
        await this.page.waitForSelector('#imgSecurityCode', { timeout: 10000 });

        const captchaElement = await this.page.$('#imgSecurityCode');
        const base64Data = await captchaElement.evaluate((el) => el.src);

        // Use the label in the filename so parallel runs don't overwrite each other's captcha.png
        const captchaPath = path.join(__dirname, `captcha_${this.label}_${Date.now()}.png`);
        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Image, 'base64');
        fs.writeFileSync(captchaPath, imageBuffer);

        const result = await this.captchaSolver.solveCaptcha(imageBuffer, captchaPath);
        if (!result.success) {
            throw new Error(`CAPTCHA solving failed: ${result.error}`);
        }

        const captchaText = result.captcha;
        this.log(`CAPTCHA solved: "${captchaText}" (${result.confidence}% confidence)`);
        await this.page.fill('#txtSecurityCode', captchaText);

        // clean up the captcha screenshot, we don't need it once solved
        fs.unlink(captchaPath, () => {});

        return captchaText;
    }

    async submitForm() {
        this.log('Submitting login form...');
        await this.page.click('#btn_login');

        try {
            await this.page.waitForLoadState('networkidle', { timeout: 15000 });
        } catch (err) {
            this.log(`Navigation wait warning: ${err.message}`);
        }
        await this.page.waitForTimeout(1500);

        const currentUrl = this.page.url();
        this.log(`URL after submit: ${currentUrl}`);
        return !currentUrl.toLowerCase().includes('login');
    }

    /**
     * "Your password is expiring soon" popup with "I'll do it later" /
     * "Change password" buttons. Not guaranteed to show up every login, so
     * we just check briefly and click through it if present, otherwise move on.
     */
    async handlePasswordExpiryPopup(timeout = 8000) {
        this.log('Checking for password-expiry popup...');

        // IMPORTANT: isVisible() does NOT wait/poll - it checks once, instantly.
        // waitFor({ state: 'visible' }) actually polls until the timeout, which is
        // what we need since the popup can take a moment to render after login.
        //
        // Matching by regex (not an exact string with a straight apostrophe) also
        // protects against sites that render the button text with a curly
        // apostrophe (’) via &rsquo; - a hardcoded "I'll do it later" would silently
        // never match that.
        const laterBtn = this.page.getByText(/do it later/i).first();

        try {
            await laterBtn.waitFor({ state: 'visible', timeout });
            this.log('Password-expiry popup detected — clicking "I\'ll do it later"');
            await laterBtn.click();
            await this.page.waitForTimeout(1000);
        } catch (err) {
            this.log('No password-expiry popup detected, continuing.');
        }
    }

    /**
     * The blank "auto redirect in 5 seconds" screen is transient and
     * disappears on its own within ~5-10s, after which the real dashboard
     * (with "GTPL SAATHI" logo / sidebar) appears. We race the URL changing
     * against the logo becoming visible, whichever comes first.
     */
    async waitForDashboard(timeout = 40000) {
        this.log('Waiting for dashboard to finish loading...');
        try {
            // NOTE: "text=Wallet Balance" used to match 2 elements on this site -
            // a hidden nav link plus the real visible balance widget - and
            // Playwright kept waiting on whichever one it resolved first, which
            // could be the hidden one. Racing the URL change against the visible
            // logo text avoids that ambiguity entirely.
            await Promise.race([
                this.page.waitForURL(/home\.aspx/i, { timeout }),
                this.page.waitForSelector('text=GTPL SAATHI', { timeout }),
            ]);
            this.log('Dashboard loaded.');
        } catch (err) {
            this.log(`Dashboard wait warning: ${err.message}`);
            // Defensive: if the dashboard never showed up, it's often because the
            // password-expiry popup rendered later than expected and is still
            // blocking the page. Check for it one more time before giving up.
            await this.handlePasswordExpiryPopup(5000);
        }
        // small buffer in case the redirect splash is still fading out
        await this.page.waitForTimeout(1500);
    }

    /**
     * Sidebar item "Renew". We click the text label itself, not the dropdown
     * caret next to it, and scroll it into view first since it's further
     * down the sidebar.
     */
    async clickRenew() {
        this.log('Looking for the "Renew" sidebar item...');
        const renewItems = this.page.locator('a:text-is("Renew"), li:text-is("Renew"), span:text-is("Renew")');

        // Poll for the sidebar item to actually exist first, with visible
        // progress logging. If the dashboard is slow to render (e.g. slower
        // network on a server run), this waits patiently instead of jumping
        // straight into scrollIntoViewIfNeeded's own long actionability wait.
        let countBefore = await renewItems.count();
        const deadline = Date.now() + 30000;
        while (countBefore === 0 && Date.now() < deadline) {
            this.log('"Renew" not in the sidebar yet - still waiting for dashboard to render...');
            await this.page.waitForTimeout(2000);
            countBefore = await renewItems.count();
        }

        this.log(`Found ${countBefore} element(s) matching "Renew" before click.`);
        if (countBefore === 0) {
            const debugPath = path.join(__dirname, `debug_no_renew_${this.label}_${Date.now()}.png`);
            await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
            this.log(`Debug screenshot: ${debugPath}`);
            throw new Error('The "Renew" sidebar item never appeared - dashboard may not have loaded.');
        }

        const first = renewItems.first();
        await first.scrollIntoViewIfNeeded();
        await first.waitFor({ state: 'visible', timeout: 10000 });
        await first.click();
        this.log('Clicked "Renew" (first match).');
        await this.page.waitForTimeout(2000);

        // Some sidebar menus only *expand* a submenu on the first click of a
        // parent item, and the real navigable link (sometimes labelled the
        // same, e.g. a child item also called "Renew") only appears after
        // that. Do a quick, non-blocking check: if the STB field still isn't
        // there, try again - clicking a newly-revealed match if one appeared,
        // otherwise just clicking "Renew" a second time.
        const stbAlreadyThere = await this.page
            .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
            .first()
            .isVisible()
            .catch(() => false);

        if (!stbAlreadyThere) {
            this.log('STB field not visible yet after first click - trying again...');
            const countAfter = await renewItems.count();
            if (countAfter > countBefore) {
                this.log(`A new "Renew"-labelled element appeared (${countAfter} total) - clicking the last one.`);
                await renewItems.last().click();
            } else {
                await first.click();
            }
            await this.page.waitForTimeout(2000);
        }
    }

    /**
     * Renew page with "STB SERIAL #" input and "Search" button.
     */
    async searchStb() {
        this.log(`Entering STB serial number: ${this.stbNumber}`);
        // case-insensitive, partial match - tolerant of minor spacing/casing
        // differences from the literal placeholder text in the screenshot
        const stbInput = this.page
            .locator('input[placeholder*="STB SERIAL" i], input[placeholder*="STB Serial" i]')
            .first();

        try {
            await stbInput.waitFor({ state: 'visible', timeout: 20000 });
        } catch (err) {
            // We couldn't find it - dump what's actually on the page so we can
            // see the real placeholder text/selector instead of guessing again.
            const debugPath = path.join(__dirname, `debug_renew_${this.label}_${Date.now()}.png`);
            await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});

            const visibleInputs = await this.page
                .$$eval('input', (els) =>
                    els
                        .filter((e) => e.offsetParent !== null)
                        .map((e) => ({ placeholder: e.placeholder, id: e.id, name: e.name }))
                )
                .catch(() => []);

            this.log(`STB input not found. Debug screenshot saved: ${debugPath}`);
            this.log(`Visible inputs on page: ${JSON.stringify(visibleInputs)}`);
            this.log(`Current URL: ${this.page.url()}`);
            throw err;
        }

        await stbInput.fill(this.stbNumber);

        // exact match so this doesn't accidentally hit "Advance Search"
        const searchBtn = this.page.getByRole('button', { name: 'Search', exact: true });
        await searchBtn.click();
        this.log('Clicked "Search".');
        await this.page.waitForTimeout(3000);
    }

    /**
     * Search results page: a "PACKAGE DETAILS" section lists the customer's
     * package(s), each with a checkbox in front of the name, and a green
     * "Renew" button below to confirm. This "Renew" is a distinct <button>
     * element from the sidebar "Renew" link clicked earlier - scoping to
     * role "button" with an exact name keeps the two from colliding.
     *
     * Per requirement: we do NOT check for any error before clicking this
     * green Renew button (e.g. the "EXPIRED" badge on the package row is
     * normal/expected here - that's the whole reason it's being renewed).
     * The only error check happens AFTER the click, on the resulting page -
     * see the block right after renewBtn.click() below.
     */
    async selectPackagesAndRenew() {
        this.log('Waiting for package details to load...');
        try {
            await this.page.waitForSelector('text=PACKAGE DETAILS', { timeout: 15000 });
        } catch (err) {
            const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
            await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
            this.log(`PACKAGE DETAILS section not found. Debug screenshot saved: ${debugPath}`);
            throw err;
        }

        // Confirmed from a live debug dump: the package checkbox is a real
        // <input type="checkbox"> from an ASP.NET repeater, with id/name
        // containing "chk_cn" (e.g. ContentPlaceHolder1_rptDC_chk_cn_0).
        // Targeting that directly is far more reliable than trying to scope
        // via the "PACKAGE DETAILS" header text, which wasn't matching it.
        let packageCheckboxes = this.page.locator(
            'input[type="checkbox"][id*="chk_cn"], input[type="checkbox"][name*="chk_cn"]'
        );

        // The row can render slightly after the header (AJAX), so poll
        // instead of checking count() once.
        let count = 0;
        const deadline = Date.now() + 15000;
        while (Date.now() < deadline) {
            count = await packageCheckboxes.count();
            if (count > 0) break;
            await this.page.waitForTimeout(500);
        }

        this.log(`Found ${count} package checkbox(es) via "chk_cn" id/name pattern.`);

        if (count === 0) {
            // Fallback: if that id pattern ever changes, fall back to any
            // checkbox on the page.
            this.log('No "chk_cn" checkboxes found - falling back to any checkbox on the page.');
            packageCheckboxes = this.page.locator('input[type="checkbox"]');
            count = await packageCheckboxes.count();
            this.log(`Found ${count} checkbox(es) via page-wide fallback.`);
        }

        if (count === 0) {
            const debugPath = path.join(__dirname, `debug_packages_${this.label}_${Date.now()}.png`);
            await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
            this.log(`Debug screenshot: ${debugPath}`);
            throw new Error('No package checkbox found on the page. See debug screenshot above.');
        }

        for (let i = 0; i < count; i++) {
            const checkbox = packageCheckboxes.nth(i);
            const alreadyChecked = await checkbox.isChecked().catch(() => false);
            if (!alreadyChecked) {
                await checkbox.check();
                this.log(`Checked package checkbox #${i + 1}.`);
            }
        }

        // ---- No error-checking above this line. Click the green Renew ----
        // ---- confirm button, THEN check the resulting page for a real ----
        // ---- error banner.                                            ----
        const renewBtn = this.page.getByRole('button', { name: 'Renew', exact: true });
        await renewBtn.waitFor({ state: 'visible', timeout: 10000 });
        await renewBtn.click();
        this.log('Clicked the green "Renew" confirm button.');
        await this.page.waitForTimeout(3000);

        // IMPORTANT: clicking "Renew" does NOT guarantee the pack was
        // actually renewed. The site can reject it and show a red error
        // banner at the top instead (e.g. "-1:Contracts can not be renewed
        // or topup prior 7 days to the contract end", or
        // "-1422:ORA-01422: ..."). If that banner is present, fail the run
        // right here with that exact message instead of continuing on to
        // fetch a stale due date.
        const renewError = await this.getOnScreenErrorText();
        if (renewError) {
            throw new Error(`Renewal rejected by the website: ${renewError}`);
        }
        this.log('No error banner found after Renew - proceeding to fetch the updated due date.');
    }

    /**
     * Only reached if selectPackagesAndRenew() found NO error banner after
     * clicking Renew. The site lands back on the Renew search page with STB
     * + account prefilled. We click Search once to pull fresh details and
     * read whatever Due Date is showing right away - no waiting for Status
     * to flip to ACTIVE.
     */
    async confirmRenewalAndGetDueDate() {
        this.log('Fetching updated due date...');

        const searchBtn = this.page.getByRole('button', { name: 'Search', exact: true });
        await searchBtn.waitFor({ state: 'visible', timeout: 15000 });
        await searchBtn.click();
        this.log('Clicked "Search" to pull the updated details.');
        await this.page.waitForTimeout(3000);

        const pageText = await this.page.evaluate(() => document.body.innerText).catch(() => '');

        const dueDateMatch = pageText.match(/Due Date\s*:\s*([\d/.\-]+)/i);
        const dueDate = dueDateMatch ? dueDateMatch[1].trim() : null;

        this.log(`Due date: ${dueDate}`);

        if (!dueDate) {
            const debugPath = path.join(__dirname, `debug_duedate_${this.label}_${Date.now()}.png`);
            await this.page.screenshot({ path: debugPath, fullPage: true }).catch(() => {});
            this.log(`Could not find a Due Date on the page. Debug screenshot saved: ${debugPath}`);
        }

        return { dueDate };
    }

    /**
     * Reads any REAL error banner the website itself is showing, e.g.
     * "-1422:ORA-01422: exact fetch returns more than requested number of
     * rows" or "-1:Contracts can not be renewed or topup prior 7 days to
     * the contract end". Matches only this site's specific
     * "-<code>:<message>" error convention.
     *
     * IMPORTANT: there is deliberately NO generic "any element styled as
     * danger/error/alert" fallback here anymore. That used to false-positive
     * on the normal "EXPIRED" status badge shown on the package row (which
     * is expected/normal - it's the whole reason the pack is being renewed
     * in the first place) and wrongly reported it as a site rejection. The
     * numeric error-code pattern is specific enough to real error banners
     * that it will not match a plain status badge like "EXPIRED" or
     * "INACTIVE".
     */
    // async getOnScreenErrorText() {
    //     try {
    //         return await this.page.evaluate(() => {
    //             const bodyText = document.body ? document.body.innerText : '';
    //             // const errorCodeMatch = bodyText.match(/-\d+:[^\n]+/);
    //             const errorCodeMatch = bodyText.match(
    //                 /(?:-\d+\s*:[^\n]+|\d{3,}\s*=\s*[^\n]+)/
    //             );
    //             return errorCodeMatch ? errorCodeMatch[0].trim() : null;
    //         });
    //     } catch (_) {
    //         return null;
    //     }
    // }

    /**
     * Turns a caught error (plus whatever the website itself is showing on
     * screen, if anything) into a short, non-technical message suitable for
     * reporting back through the API. Deliberately avoids selector/button-
     * level detail (e.g. never says "could not click element X").
     */

    async getOnScreenErrorText() {
        try {
            return await this.page.evaluate(() => {
                const bodyText = document.body ? document.body.innerText : '';

                // Strategy 1: match any error-code style line, whatever separator
                // the site uses between code and message. Covers all of these:
                //   -1422:ORA-01422: exact fetch returns more than requested number of rows
                //   -1:Contracts can not be renewed or topup prior 7 days to the contract end
                //   80741=Renewal is not allowed for disconnected contracts before expiry
                //   -1234 - some other message
                // Requires at least 3 digits in the code so it never false-matches
                // normal badges like "EXPIRED" or "INACTIVE".
                const codeStyleMatch = bodyText.match(
                    /-?\d{3,}\s*[:=\-]\s*[^\n]+/
                );
                if (codeStyleMatch) {
                    return codeStyleMatch[0].trim();
                }

                // Strategy 2 (fallback): the site always renders its real errors
                // as red text next to a warning triangle at the top of the content
                // area. If the code-style regex above missed a new format the site
                // introduces later, walk the DOM looking for that banner. We
                // deliberately exclude anything that is just a status word like
                // EXPIRED / INACTIVE / ACTIVE.
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_ELEMENT,
                    null
                );

                const IGNORE_EXACT = new Set([
                    'EXPIRED', 'INACTIVE', 'ACTIVE', 'SUSPENDED', 'DISCONNECTED',
                ]);

                let el;
                while ((el = walker.nextNode())) {
                    const style = window.getComputedStyle(el);
                    const color = style.color || '';
                    const isRed =
                        /rgb\(\s*2[0-5][0-9]\s*,\s*(0|[1-9]?\d|1[0-9]?\d)\s*,\s*(0|[1-9]?\d|1[0-9]?\d)\s*\)/.test(color) ||
                        /rgb\(\s*255\s*,\s*0\s*,\s*0\s*\)/.test(color);

                    if (!isRed) continue;

                    // Only consider leaf-ish elements so we don't grab a big
                    // container that also happens to be styled red.
                    if (el.children.length > 0) continue;

                    const text = (el.innerText || el.textContent || '').trim();
                    if (!text) continue;
                    if (text.length < 5) continue;
                    if (IGNORE_EXACT.has(text.toUpperCase())) continue;

                    // Must contain a digit somewhere - real error banners always
                    // include an error code. This is the key guard that prevents
                    // false-positives on decorative red text.
                    if (!/\d/.test(text)) continue;

                    return text;
                }

                return null;
            });
        } catch (_) {
            return null;
        }
    }
    async buildFailureMessage(err) {
        const onScreenError = await this.getOnScreenErrorText();
        if (onScreenError) return onScreenError;

        const msg = (err && err.message ? err.message : '').toLowerCase();

        if (msg.includes('captcha')) {
            return 'Could not read the CAPTCHA - please retry.';
        }
        if (msg.includes('has been closed')) {
            return 'The website closed the session unexpectedly - please retry.';
        }
        if (msg.includes('renew') && msg.includes('sidebar')) {
            return 'Could not find the Renew section on the dashboard.';
        }
        if (msg.includes('stb serial')) {
            return 'Could not find the STB search field - please check the STB number.';
        }
        if (msg.includes('checkbox')) {
            return 'No renewable package found for this STB number.';
        }
        if (msg.includes('due date')) {
            return 'Could not read the updated due date after renewal.';
        }
        if (msg.includes('timeout')) {
            return 'The website took too long to respond - please retry.';
        }

        return 'Automation failed - please check the STB number and account details.';
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.log('Browser closed.');
        }
    }

    /**
     * Full end-to-end flow for ONE account: login -> popup -> dashboard ->
     * Renew -> search STB -> select package -> click Renew -> check for
     * error -> fetch due date. Retries the whole login on failure (fresh
     * captcha each time) up to maxRetries.
     */
    async run(maxRetries = 3) {
        let attempts = 0;

        while (attempts < maxRetries) {
            attempts++;
            let loggedInThisAttempt = false;
            try {
                this.log(`--- Attempt ${attempts} of ${maxRetries} ---`);

                await this.navigateToLogin();
                await this.fillCredentials();
                const captchaText = await this.solveCaptcha();
                const loggedIn = await this.submitForm();

                if (!loggedIn) {
                    this.log('Login did not succeed, refreshing CAPTCHA and retrying...');
                    await this.refreshCaptcha();
                    continue;
                }

                loggedInThisAttempt = true;

                await this.handlePasswordExpiryPopup();
                await this.waitForDashboard();
                await this.clickRenew();
                await this.searchStb();
                await this.selectPackagesAndRenew();
                const renewalResult = await this.confirmRenewalAndGetDueDate();

                return {
                    success: true,
                    attempts,
                    captcha: captchaText,
                    username: this.username,
                    password: this.password,
                    stb: this.stbNumber,
                    dueDate: renewalResult.dueDate,
                    message: 'Successfully renewed the pack.',
                    finalUrl: this.page.url(),
                };
            } catch (err) {
                this.log(`Attempt ${attempts} failed: ${err.message}`);

                const pageIsClosed = this.page?.isClosed?.() || /has been closed/i.test(err.message);
                if (pageIsClosed) {
                    this.log('Browser/page closed unexpectedly - stopping retries for this run instead of continuing on a dead page.');
                    this.log('(This is often the site itself closing the session after several rapid login attempts. Consider spacing out retries or lowering concurrency if this happens often.)');
                    const message = 'The website closed the session unexpectedly - please retry.';
                    return { success: false, attempts, error: err.message, message, username: this.username, password: this.password, stb: this.stbNumber };
                }

                const message = await this.buildFailureMessage(err).catch(() => 'Automation failed - please check the STB number and account details.');

                if (loggedInThisAttempt) {
                    // We were already past login when this failed - almost
                    // certainly a selector/timing issue on a post-login page,
                    // or a real site rejection (e.g. renewal too close to
                    // contract end) - not a bad CAPTCHA. Re-attempting a
                    // full fresh login won't fix that, and repeated rapid
                    // logins risk the site closing the browser as an
                    // anti-automation measure. Fail fast instead.
                    this.log('Failure happened after a successful login - not retrying with a fresh login. Check the debug screenshot/log above for the real cause.');
                    return { success: false, attempts, error: err.message, message, failedAfterLogin: true, username: this.username, password: this.password, stb: this.stbNumber };
                }

                if (attempts >= maxRetries) {
                    return { success: false, attempts, error: err.message, message, username: this.username, password: this.password, stb: this.stbNumber };
                }
                await this.page.waitForTimeout(2000).catch(() => {});
            }
        }

        return {
            success: false,
            attempts,
            message: 'Login failed after multiple attempts - invalid credentials or CAPTCHA mismatch.',
            username: this.username,
            password: this.password,
            stb: this.stbNumber,
        };
    }
}

module.exports = LoginAutomation;