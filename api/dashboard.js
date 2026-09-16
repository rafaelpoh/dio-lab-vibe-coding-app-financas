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
        let rawIncome = 0;
        let expense = 0;
        let investment = 0;
        const categoryTotals = {};

        transactionsSnapshot.forEach((doc) => {
            const t = doc.data();
            const amount = Number(t.amount) || 0;
            if (t.type === 'income') {
                rawIncome += amount;
            } else if (t.type === 'investment') {
                investment += amount;
            } else if (t.type === 'expense') {
                expense += amount;
                const catName = t.category || 'Outros';
                categoryTotals[catName] = (categoryTotals[catName] || 0) + amount;
            }
        });

        // Saldo líquido disponível em conta: Receitas - Despesas - Investimentos
        const availableBalance = Math.max(0, Number((rawIncome - expense - investment).toFixed(2)));

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

        // Buscar caixinhas / metas do usuário
        const boxesSnapshot = await db.collection('boxes').where('userId', '==', userId).get();
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0 a 11

        const boxesArray = [];
        boxesSnapshot.forEach((doc) => {
            const b = doc.data();
            const targetAmount = Number(b.targetAmount) || 1000;
            const currentAmount = Number(b.currentAmount) || 0;
            const deadlineMonths = Number(b.deadlineMonths) || 12;
            const monthlyTarget = Number(b.monthlyTarget) || Number((targetAmount / (deadlineMonths || 1)).toFixed(2));
            const deposits = Array.isArray(b.deposits) ? b.deposits : [];

            // Calcula o valor total guardado no mês atual
            let savedThisMonth = 0;
            deposits.forEach((dep) => {
                if (dep.date) {
                    const d = new Date(dep.date);
                    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
                        savedThisMonth += Number(dep.amount) || 0;
                    }
                }
            });

            // Sinal Verde se guardou o valor mensal (ou no mínimo 95% dele), caso contrário Vermelho
            const isMonthTargetReached = monthlyTarget > 0 ? (savedThisMonth >= (monthlyTarget * 0.95)) : false;
            const progressPercentage = targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;

            boxesArray.push({
                id: doc.id,
                name: b.name || 'Projeto',
                targetAmount,
                currentAmount,
                deadlineMonths,
                monthlyTarget,
                progressPercentage,
                savedThisMonth,
                isMonthTargetReached
            });
        });

        const dashboardData = {
            balance: {
                income: rawIncome,
                totalIncome: rawIncome,
                expense,
                investment,
                current: availableBalance
            },
            categories: categoriesArray,
            boxes: boxesArray
        };

        return res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Dashboard Error:', error);
        return res.status(500).json({ error: `Erro ao buscar dados: ${error.message}` });
    }
};
