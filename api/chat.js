// api/chat.js
const { MongoClient } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    const { message, userId } = req.body;
    if (!message || !userId) return res.status(400).json({ error: 'Mensagem e userId obrigatórios' });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY não configurada' });

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Você é um Assistente Financeiro Pessoal integrado a um aplicativo. 
        Sua tarefa é analisar a mensagem do usuário e extrair os dados estruturados E gerar uma resposta amigável.
        
        Regras para a Resposta Amigável (botMessage):
        1. Seja cordial, educado e encorajador quanto à organização financeira.
        2. É ESTRITAMENTE PROIBIDO fazer comentários sobre o corpo, peso, dieta, ou estilo de vida pessoal do usuário.
        3. A resposta deve ser curta, como uma mensagem de chat.
        4. SE o usuário pedir para zerar, resetar, limpar ou apagar a carteira/saldo/gastos, você deve entender isso como uma ação de reset. Defina o "type" como "reset" e o "amount" como 0.
        5. SE o usuário perguntar sobre investimentos ou decidir investir um valor: classifique como type "investment". Forneça uma dica educacional, mas INCLUA UM ALERTA CLARO sobre os riscos do mercado financeiro e recomende estudar antes de aplicar.
        
        A mensagem do usuário foi: "${message}"
        
        Retorne APENAS um JSON válido no seguinte formato exato (sem formatação markdown):
        {
          "amount": <numero float, ex: 35.50 ou 0 para reset>,
          "category": "<Uma categoria fixa: Alimentação, Transporte, Lazer, Saúde, Moradia, Outros, Renda, Investimento ou Reset>",
          "description": "<breve descricao>",
          "type": "<expense, income, investment ou reset>",
          "botMessage": "<Sua mensagem amigável>"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Limpar possíveis formatações markdown do Gemini antes de fazer o parse
        const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const extractedData = JSON.parse(cleanJsonText);

        const db = await connectToDatabase();
        const transactionsCollection = db.collection('transactions');
        
        // Se a IA identificou que o usuário quer resetar a conta
        if (extractedData.type === 'reset') {
            await transactionsCollection.deleteMany({ userId });
            return res.status(200).json({
                text: extractedData.botMessage || "Carteira zerada com sucesso!",
                transaction: extractedData
            });
        }

        // Caso contrário, é um gasto ou receita normal
        await transactionsCollection.insertOne({
            userId,
            amount: extractedData.amount,
            category: extractedData.category,
            description: extractedData.description,
            type: extractedData.type,
            date: new Date()
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
