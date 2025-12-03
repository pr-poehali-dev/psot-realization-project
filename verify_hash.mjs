import crypto from 'crypto';

const password = "admin123";
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('Password:', password);
console.log('Computed SHA256:', hash);
console.log('Expected SHA256:', 'ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d');
console.log('Match:', hash === 'ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d');
