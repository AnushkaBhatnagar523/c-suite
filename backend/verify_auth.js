const http = require('http');

async function makeRequest(path, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: JSON.parse(body)
                });
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function verify() {
    try {
        console.log('--- Step 3: Register fresh user ---');
        const regRes = await makeRequest('/api/auth/register', {
            username: "admin",
            password: "1234"
        });
        console.log('Registration Status:', regRes.statusCode);
        console.log('Registration Body:', regRes.body);

        console.log('\n--- Step 4: Login ---');
        const loginRes = await makeRequest('/api/auth/login', {
            username: "admin",
            password: "1234"
        });
        console.log('Login Status:', loginRes.statusCode);
        console.log('Login Body:', loginRes.body);

        if (loginRes.statusCode === 200 && loginRes.body.token) {
            console.log('\n✅ Verification Successful!');
        } else {
            console.log('\n❌ Verification Failed.');
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
}

// Small delay to ensure server is ready
setTimeout(verify, 3000);
