#!/usr/bin/env node
import crypto from 'crypto';

// Quick admin login test
const test = async () => {
  const password = "admin123";
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  
  console.log('\nTesting admin login...');
  console.log('Password hash:', hash);
  
  try {
    const res = await fetch('https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: 'admin@test.com', password: 'admin123' })
    });
    
    const data = await res.json();
    
    console.log('\nStatus:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✓ LOGIN SUCCESSFUL');
      console.log('  User:', data.fio);
      console.log('  Role:', data.role);
    } else {
      console.log('\n✗ LOGIN FAILED');
      console.log('  Error:', data.error);
    }
  } catch (err) {
    console.error('\n✗ REQUEST FAILED');
    console.error('  Error:', err.message);
  }
};

test();
