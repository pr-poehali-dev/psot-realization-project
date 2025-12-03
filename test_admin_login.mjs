import crypto from 'crypto';

function computeSHA256(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function testLogin() {
  console.log('='.repeat(60));
  console.log('ADMIN LOGIN TEST');
  console.log('='.repeat(60));
  
  const password = "admin123";
  const passwordHash = computeSHA256(password);
  
  console.log('\n--- PASSWORD HASH INFO ---');
  console.log(`Plain Password: ${password}`);
  console.log(`SHA256 Hash: ${passwordHash}`);
  console.log(`Hash Length: ${passwordHash.length} characters`);
  
  const url = "https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5";
  const payload = {
    action: "login",
    email: "admin@test.com",
    password: "admin123"
  };
  
  console.log('\n--- REQUEST INFO ---');
  console.log(`Endpoint: ${url}`);
  console.log(`Method: POST`);
  console.log(`Content-Type: application/json`);
  console.log(`Payload:`);
  console.log(JSON.stringify(payload, null, 2));
  
  console.log('\n--- SENDING REQUEST ---');
  
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const endTime = Date.now();
    
    console.log(`Request completed in ${endTime - startTime}ms`);
    
    console.log('\n--- RESPONSE INFO ---');
    console.log(`Status Code: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    console.log(`OK: ${response.ok}`);
    
    console.log('\n--- RESPONSE HEADERS ---');
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    const responseBody = await response.text();
    console.log('\n--- RESPONSE BODY (RAW) ---');
    console.log(responseBody);
    
    console.log('\n--- RESPONSE BODY (PARSED) ---');
    try {
      const responseJson = JSON.parse(responseBody);
      console.log(JSON.stringify(responseJson, null, 2));
      
      console.log('\n--- RESULT ANALYSIS ---');
      if (responseJson.success) {
        console.log('SUCCESS - Login successful');
        console.log(`  User ID: ${responseJson.userId || 'N/A'}`);
        console.log(`  Name: ${responseJson.fio || 'N/A'}`);
        console.log(`  Company: ${responseJson.company || 'N/A'}`);
        console.log(`  Position: ${responseJson.position || 'N/A'}`);
        console.log(`  Role: ${responseJson.role || 'N/A'}`);
      } else {
        console.log('FAILED - Login unsuccessful');
        console.log(`  Error: ${responseJson.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.log('WARNING - Response is not valid JSON');
      console.log(`Parse Error: ${e.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
    
  } catch (error) {
    console.log('\n--- ERROR OCCURRED ---');
    console.error(`Error Type: ${error.constructor.name}`);
    console.error(`Error Message: ${error.message}`);
    if (error.stack) {
      console.error(`Stack Trace:\n${error.stack}`);
    }
    console.log('\n' + '='.repeat(60));
  }
}

testLogin();
