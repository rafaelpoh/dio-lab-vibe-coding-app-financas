// api/chat.js - Processamento de IA e persistência no Cloud Firestore
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getFirestoreDb, FieldValue } = require('./lib/firebaseAdmin');

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
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Você é o Educador Financeiro Inteligente, um assistente virtual voltado para orientar usuários com vida financeira ativa a organizarem suas finanças pessoais.
        Seu objetivo principal é ajudar o usuário a superar o hábito de gastar mais do que ganha no início do mês, fornecendo métodos simples de controle de gastos, metas de economia realistas e noções básicas de investimentos para o dinheiro poupado.

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

        GUARDRAILS E REGRAS OBRIGATÓRIAS:
        - Risco de Investimentos: Sempre informe expressamente que qualquer investimento envolve riscos e que rendimentos passados não garantem rentabilidade futura.
        - Sem Promessas de Retorno: É estritamente proibido prometer lucros certos, ganhos garantidos ou retornos fixos sem base técnica.
        - Caráter Educativo: Atue exclusivamente como educador financeiro, sem realizar recomendações formais de corretoras, recomendações agressivas ou consultoria vinculada a produtos específicos.
        - Adaptabilidade: Caso o usuário não tenha informado renda, idade ou objetivo, peça esses dados de forma breve antes de sugerir planos complexos.
        - Reset: Se o usuário pedir para zerar, resetar, limpar ou apagar a carteira/saldo/gastos/dados, classifique type como "reset" e amount como 0.

        ESTRUTURA PADRÃO DAS RESPOSTAS (botMessage):
        Sempre estruture o texto do botMessage seguindo estas 4 partes (utilizando quebras de linha e tópicos para ótima legibilidade):
        1. Diagnóstico e Acolhimento: Breve comentário empático sobre a situação apresentada ou registro feito.
        2. Plano de Ação Imediato: Lista de 2 a 4 passos práticos para organizar o dinheiro da semana/mês.
        3. Simulação ou Meta: Um exemplo numérico simples de economia.
        4. Sugestão de Destino/Investimento: Onde guardar a economia gerada (ex.: Reserva de Emergência em Tesouro Selic ou CDB de liquidez diária), acompanhada obrigatoriamente do aviso de risco.
        (Exceção: em caso de reset, responda com acolhimento e confirme claramente a reinicialização da carteira).

        A mensagem do usuário foi: "${message}"

        Retorne APENAS um JSON válido no seguinte formato exato (sem formatação markdown ou blocos de código adicionais):
        {
          "amount": <numero float positivo, ou 0 se for duvida/conversa/reset>,
          "category": "<Alimentação, Transporte, Lazer, Saúde, Moradia, Renda, Investimento, Outros ou Reset>",
          "description": "<breve descricao>",
          "type": "<expense, income, investment, reset ou other>",
          "botMessage": "<Texto da resposta estruturada com as 4 partes e quebras de linha>"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Limpar possíveis formatações markdown do Gemini antes de fazer o parse
        const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const extractedData = JSON.parse(cleanJsonText);

        const db = getFirestoreDb();
        const transactionsRef = db.collection('transactions');
        
        // Se a IA identificou que o usuário quer resetar a conta
        if (extractedData.type === 'reset') {
            const snapshot = await transactionsRef.where('userId', '==', userId).get();
            const batch = db.batch();
            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            return res.status(200).json({
                text: extractedData.botMessage || "Carteira zerada com sucesso!",
                transaction: extractedData
            });
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
