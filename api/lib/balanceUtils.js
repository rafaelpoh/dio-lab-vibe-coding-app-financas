// api/lib/balanceUtils.js - Utilitário compartilhado para apuração de saldo e caixinhas
async function getUserAvailableBalance(db, userId) {
    const transactionsSnapshot = await db.collection('transactions').where('userId', '==', userId).get();
    
    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvestment = 0;

    transactionsSnapshot.forEach((doc) => {
        const t = doc.data();
        const amount = Number(t.amount) || 0;
        if (t.type === 'income') {
            totalIncome += amount;
        } else if (t.type === 'expense') {
            totalExpense += amount;
        } else if (t.type === 'investment') {
            totalInvestment += amount;
        }
    });

    const availableBalance = Number((totalIncome - totalExpense - totalInvestment).toFixed(2));

    return {
        totalIncome,
        totalExpense,
        totalInvestment,
        availableBalance: Math.max(0, availableBalance),
        rawBalance: availableBalance
    };
}

async function getUserBoxes(db, userId) {
    const boxesSnapshot = await db.collection('boxes').where('userId', '==', userId).get();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const boxes = [];
    boxesSnapshot.forEach((doc) => {
        const b = doc.data();
        const targetAmount = Number(b.targetAmount) || 1000;
        const currentAmount = Number(b.currentAmount) || 0;
        const deadlineMonths = Number(b.deadlineMonths) || 12;
        const monthlyTarget = Number(b.monthlyTarget) || Number((targetAmount / (deadlineMonths || 1)).toFixed(2));
        const deposits = Array.isArray(b.deposits) ? b.deposits : [];

        let savedThisMonth = 0;
        deposits.forEach((dep) => {
            if (dep.date) {
                const d = new Date(dep.date);
                if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
                    savedThisMonth += Number(dep.amount) || 0;
                }
            }
        });

        const remainingTotal = Math.max(0, targetAmount - currentAmount);
        const remainingThisMonth = Math.max(0, monthlyTarget - savedThisMonth);

        boxes.push({
            id: doc.id,
            name: b.name || 'Projeto',
            targetAmount,
            currentAmount,
            deadlineMonths,
            monthlyTarget,
            savedThisMonth,
            remainingTotal,
            remainingThisMonth,
            isMonthTargetReached: monthlyTarget > 0 ? savedThisMonth >= (monthlyTarget * 0.95) : false
        });
    });

    return boxes;
}

module.exports = {
    getUserAvailableBalance,
    getUserBoxes
};
