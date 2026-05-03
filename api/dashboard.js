// api/dashboard.js
const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI não definida');
    
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    cachedDb = client.db('app_financas');
    return cachedDb;
}

module.exports = async (req, res) => {
    // CORS Handling
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório' });

    try {
        const db = await connectToDatabase();
        const transactionsCollection = db.collection('transactions');

        // Buscar todas as transações do usuário
        const transactions = await transactionsCollection.find({ userId }).toArray();

        // Agrupar dados
        let income = 0;
        let expense = 0;
        const categoryTotals = {};

        transactions.forEach(t => {
            if (t.type === 'income') {
                income += t.amount;
            } else {
                expense += t.amount;
                if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
                categoryTotals[t.category] += t.amount;
            }
        });

        // Formatar para o frontend (Categorias fixas simulando um "limite")
        const categoriesArray = Object.keys(categoryTotals).map((name, idx) => {
            // Um limite falso (ex: 1000) apenas para o gráfico do frontend
            const limit = 1000 + (idx * 200); 
            return {
                id: idx,
                name,
                limit,
                current: categoryTotals[name]
            };
        });

        // Garantir categorias padrão mesmo sem gastos
        const defaultCats = ['Alimentação', 'Transporte', 'Lazer'];
        defaultCats.forEach(cat => {
            if (!categoriesArray.find(c => c.name === cat)) {
                categoriesArray.push({ id: Math.random(), name: cat, limit: 1000, current: 0 });
            }
        });

        const dashboardData = {
            balance: {
                income,
                expense,
                current: income - expense
            },
            categories: categoriesArray
        };

        return res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Dashboard Error:', error);
        return res.status(500).json({ error: `Erro ao buscar dados: ${error.message}` });
    }
};
