// api/lib/firebaseAdmin.js - Singleton para Firebase Admin SDK v14+ em Serverless
const { initializeApp, getApps, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

let cachedDb = null;

function parseServiceAccount(raw) {
  if (!raw) return null;
  let text = String(raw).trim();

  // Remove aspas simples ou duplas externas que possam ter sido adicionadas na UI da Vercel
  if ((text.startsWith("'") && text.endsWith("'")) || (text.startsWith('"') && text.endsWith('"'))) {
    text = text.slice(1, -1).trim();
  }

  // Se não começa com '{', tenta decodificar de Base64
  if (!text.startsWith('{')) {
    try {
      const decoded = Buffer.from(text, 'base64').toString('utf8');
      if (decoded.trim().startsWith('{')) {
        text = decoded.trim();
      }
    } catch (_) {}
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed.private_key) {
      // Garante que sequências literais '\n' virem quebras de linha reais
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (err) {
    console.error('Falha ao processar credencial FIREBASE_SERVICE_ACCOUNT:', err.message);
    return null;
  }
}

function getFirebaseAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  let credential = null;

  // 1. Variável de ambiente contendo o JSON completo (em texto plano, minificado ou Base64)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const parsed = parseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (parsed) {
      credential = cert(parsed);
    }
  }

  // 2. Variáveis de ambiente individuais (alternativa limpa sem multilinhas)
  if (!credential && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'agente-financas-2026',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });
  }

  // 3. Arquivo local serviceAccountKey.json (desenvolvimento local)
  if (!credential) {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(keyPath)) {
      try {
        const fileContent = fs.readFileSync(keyPath, 'utf8');
        const parsed = parseServiceAccount(fileContent);
        if (parsed) {
          credential = cert(parsed);
        }
      } catch (err) {
        console.error('Falha ao ler serviceAccountKey.json local:', err.message);
      }
    }
  }

  // 4. Se GOOGLE_APPLICATION_CREDENTIALS estiver configurado explicitamente
  if (!credential && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      credential = applicationDefault();
    } catch (err) {
      console.error('Falha ao carregar credenciais padrão do Google Cloud:', err.message);
    }
  }

  // Se mesmo assim não obteve credenciais, lança erro explicativo
  if (!credential) {
    throw new Error(
      'Credenciais do Firebase Admin não encontradas no ambiente. Configure a variável FIREBASE_SERVICE_ACCOUNT (JSON ou Base64) no painel da Vercel e realize um novo Deploy.'
    );
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
