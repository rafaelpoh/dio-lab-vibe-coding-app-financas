// api/dashboard.js - Consulta e agregação analítica no Cloud Firestore
const { getFirestoreDb } = require('./lib/firebaseAdmin');

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
        const db = getFirestoreDb();
        const transactionsSnapshot = await db.collection('transactions').where('userId', '==', userId).get();

        // Agrupar dados
        let income = 0;
        let expense = 0;
        let investment = 0;
        const categoryTotals = {};

        transactionsSnapshot.forEach((doc) => {
            const t = doc.data();
            const amount = Number(t.amount) || 0;
            if (t.type === 'income') {
                income += amount;
            } else if (t.type === 'investment') {
                investment += amount;
            } else if (t.type === 'expense') {
                expense += amount;
                const catName = t.category || 'Outros';
                categoryTotals[catName] = (categoryTotals[catName] || 0) + amount;
            }
        });

        // Formatar para o frontend
        const categoriesArray = Object.keys(categoryTotals).map((name) => {
            return {
                id: name,
                name,
                current: categoryTotals[name]
            };
        });

        // Garantir categorias padrão mesmo sem gastos
        const defaultCats = ['Alimentação', 'Transporte', 'Lazer'];
        defaultCats.forEach((cat) => {
            if (!categoriesArray.find((c) => c.name === cat)) {
                categoriesArray.push({ id: cat, name: cat, current: 0 });
            }
        });

        const dashboardData = {
            balance: {
                income,
                expense,
                investment,
                current: income - expense - investment
            },
            categories: categoriesArray
        };

        return res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Dashboard Error:', error);
        return res.status(500).json({ error: `Erro ao buscar dados: ${error.message}` });
    }
};
