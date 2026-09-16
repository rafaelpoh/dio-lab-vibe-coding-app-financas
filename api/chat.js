const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getFirestoreDb, FieldValue } = require('./lib/firebaseAdmin');
const { getUserAvailableBalance, getUserBoxes } = require('./lib/balanceUtils');

const CANDIDATE_MODELS = [
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite'
];

async function generateContentWithFallback(genAI, prompt) {
    let lastError = null;
    for (const modelName of CANDIDATE_MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return { result, modelName };
        } catch (err) {
            console.warn(`[Gemini Fallback] Modelo ${modelName} falhou: ${err.message}. Tentando próximo modelo...`);
            lastError = err;
        }
    }
    throw lastError || new Error('Todos os modelos de IA disponíveis falharam.');
}

module.exports = async (req, res) => {
    // CORS Handling
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { message, userId } = req.body;
    if (!message || !userId) return res.status(400).json({ error: 'Mensagem e userId obrigatórios' });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY não configurada' });

    try {
        const db = getFirestoreDb();
        const { availableBalance } = await getUserAvailableBalance(db, userId);
        const userBoxes = await getUserBoxes(db, userId);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const boxesContextText = userBoxes.length === 0
            ? "Nenhuma caixinha criada até o momento."
            : userBoxes.map(b => `- "${b.name}": Meta R$ ${b.targetAmount.toFixed(2)}, Guardado R$ ${b.currentAmount.toFixed(2)}, Meta mensal R$ ${b.monthlyTarget.toFixed(2)}, Guardado este mês R$ ${b.savedThisMonth.toFixed(2)}, Falta para a meta final R$ ${b.remainingTotal.toFixed(2)}.`).join('\n');

        const prompt = `
        Você é o Educador Financeiro Inteligente, um assistente virtual voltado para orientar usuários com vida financeira ativa a organizarem suas finanças pessoais.
        Seu objetivo principal é ajudar o usuário a superar o hábito de gastar mais do que ganha no início do mês, fornecendo métodos simples de controle de gastos, metas de economia realistas e noções básicas de investimentos para o dinheiro poupado.

        DADOS FINANCEIROS REAIS DO USUÁRIO NO MOMENTO:
        - Saldo Livre Disponível em Conta: R$ ${availableBalance.toFixed(2)}
        - Caixinhas / Metas Ativas do Usuário:
        ${boxesContextText}

        DIRETRIZES DE TOM DE VOZ E COMUNICAÇÃO:
        - Amigável, acolhedor e encorajador, sem julgamentos sobre os erros financeiros do usuário.
        - Linguagem simples, direta e acessível.
        - Proibido o uso de jargões técnicos ou conceitos complexos sem explicação prévia.
        - Respostas sempre formatadas em listas curtas, tópicos diretos e exemplos práticos do cotidiano.
        - É ESTRITAMENTE PROIBIDO fazer comentários sobre o corpo, peso, dieta ou estilo de vida pessoal do usuário.

        FUNCIONALIDADES E CONDUTAS:
        1. Controle Simples de Gastos:
           - Auxiliar no mapeamento de despesas essenciais logo ao receber a renda.
           - Propor limites de gastos semanais para evitar que o dinheiro acabe nos primeiros dias do mês.
           - Sugerir divisões básicas de orçamento (como necessidades, desejos e poupança).
        2. Simulação de Metas de Economia:
           - Propor metas alcançáveis de curto e médio prazo.
           - Demonstrar o impacto de pequenas economias diárias ou semanais com exemplos numéricos claros.
        3. Dicas Personalizadas e Orientação de Investimentos:
           - Adequar as sugestões à renda mensal, faixa etária e objetivos informados pelo usuário.
           - Apresentar opções básicas para iniciantes (ex.: Reserva de Emergência em Tesouro Selic ou CDBs com liquidez diária).

        ENTRADAS DE RENDA / ADIÇÃO DE SALDO:
        - Sempre que o usuário informar que recebeu dinheiro, salário, renda, pagamento, freela, ou informar saldo atual/inicial, ou pedir para "adicionar saldo", "colocar saldo", "adicionar dinheiro", "depósito em conta", "tenho X de saldo" (ex: "adicionei 500 de saldo", "recebi 3000 de salário", "adicionar saldo de 1000", "adicionar 500", "coloquei 200 de saldo", "meu saldo é 1500"):
          - Defina "type": "income"
          - Defina "category": "Renda"
          - Defina "amount": <valor numérico positivo informado>
          - Defina "description": "Adição de Saldo" ou a descrição informada (ex: "Salário", "Rendimento", "Saldo Adicionado")
          - Defina "box": null (a menos que ele especifique guardar expressamente em uma caixinha)
          - No botMessage: celebre calorosamente a entrada financeira, oriente como planejar o uso desse novo saldo (método de divisão 50-30-20 ou similar) e apresente as 4 partes padrão.

        GUARDRAILS E REGRAS OBRIGATÓRIAS:
        - Risco de Investimentos: Sempre informe expressamente que qualquer investimento envolve riscos e que rendimentos passados não garantem rentabilidade futura.
        - Sem Promessas de Retorno: É estritamente proibido prometer lucros certos, ganhos garantidos ou retornos fixos sem base técnica.
        - Caráter Educativo: Atue exclusivamente como educador financeiro, sem realizar recomendações formais de corretoras, recomendações agressivas ou consultoria vinculada a produtos específicos.
        - Adaptabilidade: Caso o usuário não tenha informado renda, idade ou objetivo, peça esses dados de forma breve antes de sugerir planos complexos.
        - Reset: Se o usuário pedir para zerar, resetar, limpar ou apagar a carteira/saldo/gastos/dados, classifique type como "reset" e amount como 0.

        CAIXINHAS / METAS DE PROJETOS E VERIFICAÇÃO DE SALDO:
        1. Verificação de Saldo Livre:
           - O usuário só pode guardar na caixinha até o limite do seu "Saldo Livre Disponível em Conta" (R$ ${availableBalance.toFixed(2)}).
           - Se o usuário tentar guardar um valor superior ao saldo livre disponível, ACOLHA o usuário, informe que o saldo atual de R$ ${availableBalance.toFixed(2)} é insuficiente para esse montante, NÃO processe o débito ("box": null), e oriente-o a guardar uma quantia menor compatível com o saldo ou registrar novas receitas.
        2. Criação de Caixinha:
           - Se o usuário manifestar intenção de criar caixinha ou juntar dinheiro para uma meta (ex: "quero criar uma caixinha para uma viagem daqui a 12 meses e preciso guardar 10 mil no total"):
           - Preencha o objeto "box" com action="create", o nome do projeto (ex: "Viagem"), o valor total (targetAmount), o prazo em meses (deadlineMonths) e o valor mensal calculado (monthlyTarget = targetAmount / deadlineMonths).
           - No botMessage, calcule e informe expressamente quanto o usuário precisará guardar por mês (ex: "R$ 833,33 por mês"), parabenize pelo objetivo e aplique a estrutura padrão.
        3. Depósito em Caixinha (Parcela Cheia ou Quantia Menor):
           - O usuário pode pedir para guardar a parcela inteira ou uma QUANTIA MENOR caso não consiga guardar a parcela cheia no mês (ex: "este mês só consigo guardar 200 na caixinha da viagem", "guardei 300 para a viagem", "guarda 400 na caixinha"):
           - Se o valor estiver dentro do saldo disponível:
             - Preencha "box" com action="deposit", name="<nome>", depositAmount=<valor menor ou informado>.
             - Defina type="investment", category="Investimento", amount=<valor informado>.
             - No botMessage:
               a) Celebre e encoraje o esforço de poupar, mesmo que seja uma quantia menor!
               b) RECALCULE e mostre exatamente:
                  - Quanto já foi guardado no total com esse aporte.
                  - Quanto ainda falta para atingir a meta total.
                  - Como fica o valor das próximas parcelas ou quanto falta para atingir a meta deste mês.
        4. Se a mensagem não envolver criação ou aporte de caixinha, defina "box": null.

        ESTRUTURA PADRÃO DAS RESPOSTAS (botMessage):
        Sempre estruture o texto do botMessage seguindo estas 4 partes (utilizando quebras de linha e tópicos para ótima legibilidade):
        1. Diagnóstico e Acolhimento: Breve comentário empático sobre a situação apresentada, registro feito ou acolhimento da quantia menor poupada.
        2. Plano de Ação Imediato: Lista de 2 a 4 passos práticos para organizar o dinheiro da semana/mês ou atingir a meta.
        3. Simulação ou Meta: Um exemplo numérico simples de economia ou progresso (incluindo o recálculo do que falta quando aplicável).
        4. Sugestão de Destino/Investimento: Onde guardar a economia/caixinha gerada (ex.: Reserva de Emergência em Tesouro Selic ou CDB de liquidez diária), acompanhada obrigatoriamente do aviso de risco.
        (Exceção: em caso de reset, responda com acolhimento e confirme claramente a reinicialização da carteira).

        A mensagem do usuário foi: "${message}"

        Retorne APENAS um JSON válido no seguinte formato exato (sem formatação markdown ou blocos de código adicionais):
        {
          "amount": <numero float positivo, ou 0 se for duvida/conversa/reset>,
          "category": "<Alimentação, Transporte, Lazer, Saúde, Moradia, Renda, Investimento, Outros ou Reset>",
          "description": "<breve descricao>",
          "type": "<expense, income, investment, reset ou other>",
          "botMessage": "<Texto da resposta estruturada com as 4 partes e quebras de linha>",
          "box": {
            "action": "<create, deposit ou null>",
            "name": "<nome da caixinha ou null>",
            "targetAmount": <numero float da meta total ou null>,
            "deadlineMonths": <numero inteiro de meses ou null>,
            "monthlyTarget": <numero float da meta por mes ou null>,
            "depositAmount": <numero float do valor aportado agora ou null>
          }
        }
        `;

        const { result } = await generateContentWithFallback(genAI, prompt);
        const responseText = result.response.text();
        
        // Limpar possíveis formatações markdown do Gemini antes de fazer o parse
        const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        let jsonPayload = cleanJsonText;
        const jsonMatch = cleanJsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonPayload = jsonMatch[0];
        }

        let extractedData;
        try {
            extractedData = JSON.parse(jsonPayload);
        } catch (parseErr) {
            console.error('Falha no parse do JSON gerado pela IA:', responseText);
            extractedData = {
                amount: 0,
                category: 'Outros',
                description: 'Conversa',
                type: 'other',
                botMessage: responseText,
                box: null
            };
        }

        const transactionsRef = db.collection('transactions');
        const boxesRef = db.collection('boxes');
        
        // Se a IA identificou que o usuário quer resetar a conta
        if (extractedData.type === 'reset') {
            const batch = db.batch();

            const snapshotTransactions = await transactionsRef.where('userId', '==', userId).get();
            snapshotTransactions.forEach((doc) => {
                batch.delete(doc.ref);
            });

            const snapshotBoxes = await boxesRef.where('userId', '==', userId).get();
            snapshotBoxes.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            return res.status(200).json({
                text: extractedData.botMessage || "Carteira e caixinhas zeradas com sucesso!",
                transaction: extractedData
            });
        }

        // Processamento de Caixinhas (Criação de Meta ou Aporte)
        if (extractedData.box && extractedData.box.action) {
            const boxAction = extractedData.box.action.toLowerCase();

            if (boxAction === 'create') {
                const targetAmount = Number(extractedData.box.targetAmount) || 1000;
                const deadlineMonths = Number(extractedData.box.deadlineMonths) || 12;
                const monthlyTarget = Number((targetAmount / (deadlineMonths || 1)).toFixed(2));
                const depositAmount = Number(extractedData.box.depositAmount) || 0;

                const newBoxDoc = {
                    userId,
                    name: extractedData.box.name || 'Projeto',
                    targetAmount,
                    currentAmount: depositAmount,
                    deadlineMonths,
                    monthlyTarget,
                    deposits: depositAmount > 0 ? [{ amount: depositAmount, date: new Date().toISOString() }] : [],
                    createdAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp()
                };

                await boxesRef.add(newBoxDoc);

                if (depositAmount > 0) {
                    await transactionsRef.add({
                        userId,
                        amount: depositAmount,
                        category: 'Investimento',
                        description: `Aporte inicial caixinha: ${newBoxDoc.name}`,
                        type: 'investment',
                        date: new Date(),
                        createdAt: FieldValue.serverTimestamp()
                    });
                }

                return res.status(200).json({
                    text: extractedData.botMessage,
                    transaction: extractedData
                });
            }

            if (boxAction === 'deposit') {
                const depositAmount = Number(extractedData.box.depositAmount || extractedData.amount) || 0;
                const targetName = (extractedData.box.name || '').trim().toLowerCase();

                // Validação de saldo disponível
                if (depositAmount > availableBalance) {
                    return res.status(200).json({
                        text: extractedData.botMessage || `Você não possui saldo livre suficiente em conta (R$ ${availableBalance.toFixed(2)}) para guardar R$ ${depositAmount.toFixed(2)}. Que tal guardar um valor menor compatível com seu saldo atual?`,
                        transaction: {
                            amount: 0,
                            category: 'Investimento',
                            description: 'Tentativa de aporte sem saldo',
                            type: 'other',
                            botMessage: extractedData.botMessage
                        }
                    });
                }

                if (depositAmount > 0) {
                    const boxesSnapshot = await boxesRef.where('userId', '==', userId).get();
                    let matchedDoc = null;

                    boxesSnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (targetName && data.name && data.name.toLowerCase().includes(targetName)) {
                            matchedDoc = doc;
                        }
                    });

                    // Se não encontrou por nome, tenta a primeira caixinha existente
                    if (!matchedDoc && !boxesSnapshot.empty) {
                        matchedDoc = boxesSnapshot.docs[0];
                    }

                    if (matchedDoc) {
                        const boxData = matchedDoc.data();
                        const updatedAmount = Number(boxData.currentAmount || 0) + depositAmount;
                        const existingDeposits = Array.isArray(boxData.deposits) ? boxData.deposits : [];

                        existingDeposits.push({
                            amount: depositAmount,
                            date: new Date().toISOString()
                        });

                        await matchedDoc.ref.update({
                            currentAmount: updatedAmount,
                            deposits: existingDeposits,
                            updatedAt: FieldValue.serverTimestamp()
                        });
                    }

                    // Registra a transação de investimento para refletir no saldo/investimentos
                    await transactionsRef.add({
                        userId,
                        amount: depositAmount,
                        category: 'Investimento',
                        description: `Aporte Caixinha: ${extractedData.box.name || 'Projeto'}`,
                        type: 'investment',
                        date: new Date(),
                        createdAt: FieldValue.serverTimestamp()
                    });

                    return res.status(200).json({
                        text: extractedData.botMessage,
                        transaction: extractedData
                    });
                }
            }
        }

        // Se for apenas uma dúvida, conversa ou sem valor financeiro
        const numericAmount = Number(extractedData.amount) || 0;
        if (extractedData.type === 'other' || numericAmount <= 0) {
            return res.status(200).json({
                text: extractedData.botMessage,
                transaction: extractedData
            });
        }

        // Transação financeira comum (receita, despesa ou investimento com valor real)
        await transactionsRef.add({
            userId,
            amount: numericAmount,
            category: extractedData.category || 'Outros',
            description: extractedData.description || 'Transação',
            type: extractedData.type || 'expense',
            date: new Date(),
            createdAt: FieldValue.serverTimestamp()
        });

        return res.status(200).json({
            text: extractedData.botMessage,
            transaction: extractedData
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: `Erro no processamento: ${error.message}` });
    }
};
