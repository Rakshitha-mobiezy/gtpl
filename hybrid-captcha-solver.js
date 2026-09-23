const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');

class HybridCaptchaSolver {
    // async solveCaptchaPython(imagePath) {
    //     console.log('🐍 Using Python OCR bridge...');
        
    //     try {
    //         // Call Python script
    //         const { stdout, stderr } = await execPromise(`python python_ocr_bridge.py "${imagePath}"`);
            
    //         if (stderr) {
    //             console.log('Python stderr:', stderr);
    //         }
            
    //         // Parse JSON result
    //         const result = JSON.parse(stdout.trim());
            
    //         console.log('🔍 Python OCR result:');
    //         console.log(`   Raw text: "${result.raw_text}"`);
    //         console.log(`   Digits: "${result.digits}"`);
    //         console.log(`   Length: ${result.length}`);
            
    //         if (result.success && result.digits && result.digits.length === 6) {
    //             console.log(`✅ Python OCR SUCCESS: ${result.digits}`);
    //             return {
    //                 success: true,
    //                 captcha: result.digits,
    //                 confidence: 95,
    //                 method: 'python-bridge'
    //             };
    //         } else {
    //             return {
    //                 success: false,
    //                 error: `Python OCR failed - got ${result.length} digits: "${result.digits}"`,
    //                 rawResult: result
    //             };
    //         }
            
    //     } catch (error) {
    //         console.error('💥 Python bridge error:', error.message);
    //         return {
    //             success: false,
    //             error: error.message
    //         };
    //     }
    // }

    async solveCaptchaPython(imagePath) {
        console.log('🐍 Using Python OCR bridge...');
        
        try {
            // const { stdout, stderr } = await execPromise(`python python_ocr_bridge.py "${imagePath}"`);
            const pythonCmd = process.platform === 'win32' ? 'python' : path.join(__dirname, 'venv', 'bin', 'python3');
            const { stdout, stderr } = await execPromise(`"${pythonCmd}" python_ocr_bridge.py "${imagePath}"`);
            
            if (stderr) console.log('Python stderr:', stderr);
            
            const result = JSON.parse(stdout.trim());
            
            console.log('🔍 Python OCR result:');
            console.log(`   Raw: "${result.raw_text}"`);
            console.log(`   Cleaned: "${result.captcha}"`);
            console.log(`   Length: ${result.length}`);
            
            // ⭐ CHANGED: Accept 4-7 ALPHANUMERIC characters (not just 6 digits)
            if (
                result.success &&
                result.captcha &&
                result.captcha.length >= 4 &&
                result.captcha.length <= 7
            ) {
                console.log(`✅ Python OCR SUCCESS: ${result.captcha}`);
                return {
                    success: true,
                    captcha: result.captcha,
                    confidence: 85,
                    method: 'python-bridge'
                };
            }
            
            return {
                success: false,
                error: `OCR produced invalid result: "${result.captcha}" (len=${result.length})`,
                rawResult: result
            };
            
        } catch (error) {
            console.error('💥 Python bridge error:', error.message);
            return { success: false, error: error.message };
        }
    }
    
    async solveCaptcha(imageBuffer, imagePath = 'captcha.png') {
        try {
            // Save buffer to file for Python script
            if (imageBuffer) {
                fs.writeFileSync(imagePath, imageBuffer);
            }
            
            // Use Python OCR
            const result = await this.solveCaptchaPython(imagePath);
            
            return result;
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = HybridCaptchaSolver;