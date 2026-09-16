// api/lib/firebaseAdmin.js - Singleton para Firebase Admin SDK v14+ em Serverless
const { initializeApp, getApps, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

let cachedDb = null;

function getFirebaseAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  let credential = null;

  // 1. Variável de ambiente contendo o JSON completo (Vercel)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      if (parsed.private_key) {
        // Corrige quebra de linha caso venha escapada como literal '\n'
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      credential = cert(parsed);
    } catch (err) {
      console.error('Falha ao processar FIREBASE_SERVICE_ACCOUNT:', err);
    }
  }

  // 2. Arquivo local serviceAccountKey.json (desenvolvimento local)
  if (!credential) {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(keyPath)) {
      try {
        const fileContent = fs.readFileSync(keyPath, 'utf8');
        const serviceAccount = JSON.parse(fileContent);
        if (serviceAccount.private_key) {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        credential = cert(serviceAccount);
      } catch (err) {
        console.error('Falha ao ler serviceAccountKey.json:', err);
      }
    }
  }

  // 3. Fallback para Application Default Credentials
  if (!credential) {
    try {
      credential = applicationDefault();
    } catch (err) {
      console.error('Falha ao carregar credenciais padrão:', err);
    }
  }

  return initializeApp({
    credential,
    projectId: 'agente-financas-2026'
  });
}

function getFirestoreDb() {
  if (cachedDb) return cachedDb;
  const app = getFirebaseAdminApp();
  cachedDb = getFirestore(app);
  return cachedDb;
}

module.exports = {
  getFirebaseAdminApp,
  getFirestoreDb,
  FieldValue
};
