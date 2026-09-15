// api/lib/firebaseAdmin.js - Singleton para Firebase Admin SDK em Serverless
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  let credential = null;

  // 1. Variável de ambiente contendo o JSON completo (recomendado na Vercel)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = admin.credential.cert(parsed);
    } catch (err) {
      console.error('Falha ao processar FIREBASE_SERVICE_ACCOUNT:', err);
    }
  }

  // 2. Arquivo local serviceAccountKey.json
  if (!credential) {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(keyPath)) {
      try {
        const fileContent = fs.readFileSync(keyPath, 'utf8');
        const serviceAccount = JSON.parse(fileContent);
        credential = admin.credential.cert(serviceAccount);
      } catch (err) {
        console.error('Falha ao ler serviceAccountKey.json:', err);
      }
    }
  }

  // 3. Fallback para Application Default Credentials
  if (!credential) {
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    projectId: 'agente-financas-2026'
  });

  return admin;
}

function getFirestoreDb() {
  const adminApp = getFirebaseAdmin();
  const db = adminApp.firestore();
  return db;
}

module.exports = {
  getFirebaseAdmin,
  getFirestoreDb
};
