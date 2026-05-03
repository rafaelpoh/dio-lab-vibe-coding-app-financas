// api/login.js
const { MongoClient } = require('mongodb');

// Reutilização da conexão de banco de dados em funções serverless
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    
    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }
    
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('app_financas');
    cachedDb = db;
    return db;
}

module.exports = async (req, res) => {
    // CORS Handling
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        let user = await usersCollection.findOne({ username });

        if (user) {
            // Verifica a senha crua (sem hash para MVP)
            if (user.password === password) {
                return res.status(200).json({ message: 'Login bem-sucedido!', userId: user.username });
            } else {
                return res.status(401).json({ error: 'Senha incorreta.' });
            }
        } else {
            // Cria um novo usuário se não existir
            await usersCollection.insertOne({ username, password, createdAt: new Date() });
            return res.status(201).json({ message: 'Usuário criado com sucesso!', userId: username });
        }
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};
