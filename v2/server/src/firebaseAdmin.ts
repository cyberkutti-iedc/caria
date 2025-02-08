// firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from './caria-9c751-firebase-adminsdk-fbsvc-c38b833792.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

module.exports = admin;