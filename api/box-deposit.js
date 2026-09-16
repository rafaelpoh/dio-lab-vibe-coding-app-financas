// api/box-deposit.js - Processamento de aporte direto em Caixinha pelo Dashboard
const { getFirestoreDb, FieldValue } = require('./lib/firebaseAdmin');

module.exports = async (req, res) => {
    // CORS Handling
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { userId, boxId, amount } = req.body;
    if (!userId || !boxId) {
        return res.status(400).json({ error: 'userId e boxId são obrigatórios' });
    }

    try {
        const db = getFirestoreDb();
        const boxRef = db.collection('boxes').doc(boxId);
        const boxDoc = await boxRef.get();

        if (!boxDoc.exists) {
            return res.status(404).json({ error: 'Caixinha não encontrada' });
        }

        const boxData = boxDoc.data();
        if (boxData.userId !== userId) {
            return res.status(403).json({ error: 'Não autorizado para alterar esta caixinha' });
        }

        // Determina a quantia do aporte (se não especificada, usa a meta mensal)
        const depositAmount = Number(amount) > 0 
            ? Number(amount) 
            : Number(boxData.monthlyTarget) || Number((boxData.targetAmount / (boxData.deadlineMonths || 1)).toFixed(2));

        if (depositAmount <= 0) {
            return res.status(400).json({ error: 'Valor de aporte inválido' });
        }

        const updatedCurrent = Number(boxData.currentAmount || 0) + depositAmount;
        const existingDeposits = Array.isArray(boxData.deposits) ? boxData.deposits : [];

        existingDeposits.push({
            amount: depositAmount,
            date: new Date().toISOString()
        });

        // Atualiza a caixinha com o novo aporte e histórico
        await boxRef.update({
            currentAmount: updatedCurrent,
            deposits: existingDeposits,
            updatedAt: FieldValue.serverTimestamp()
        });

        // Registra a transação de investimento para impactar o saldo geral e a dedução de receita
        await db.collection('transactions').add({
            userId,
            amount: depositAmount,
            category: 'Investimento',
            description: `Aporte Caixinha: ${boxData.name || 'Projeto'}`,
            type: 'investment',
            date: new Date(),
            createdAt: FieldValue.serverTimestamp()
        });

        return res.status(200).json({
            success: true,
            message: `Aporte de R$ ${depositAmount.toFixed(2)} guardado com sucesso na caixinha ${boxData.name}!`,
            currentAmount: updatedCurrent,
            depositedAmount: depositAmount
        });

    } catch (error) {
        console.error('Box Deposit Error:', error);
        return res.status(500).json({ error: `Erro ao processar aporte: ${error.message}` });
    }
};
