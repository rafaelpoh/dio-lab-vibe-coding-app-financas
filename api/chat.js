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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Você é um Assistente Financeiro Pessoal integrado a um aplicativo. 
        Sua tarefa é analisar a mensagem do usuário, que geralmente contém um gasto ou uma receita, e extrair os dados estruturados E gerar uma resposta amigável.
        
        Regras para a Resposta Amigável (botMessage):
        1. Seja cordial, educado e encorajador quanto à organização financeira.
        2. É ESTRITAMENTE PROIBIDO fazer comentários sobre o corpo, peso, dieta, ou estilo de vida pessoal do usuário (ex: se ele comeu fast food, não fale de calorias ou saúde). Foque APENAS no aspecto financeiro.
        3. A resposta deve ser curta, como uma mensagem de chat.
        
        A mensagem do usuário foi: "${message}"
        
        Retorne APENAS um JSON válido no seguinte formato exato (sem formatação markdown como \`\`\`json, apenas o texto puro do JSON):
        {
          "amount": <numero float, ex: 35.50>,
          "category": "<Uma categoria fixa: Alimentação, Transporte, Lazer, Saúde, Moradia, Outros, ou Renda para recebimentos>",
          "description": "<breve descricao, ex: Hamburguer>",
          "type": "<expense ou income>",
          "botMessage": "<Sua mensagem amigável seguindo as regras>"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Limpar possíveis formatações markdown do Gemini antes de fazer o parse
        const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const extractedData = JSON.parse(cleanJsonText);

        // Salvar no MongoDB
        const db = await connectToDatabase();
        const transactionsCollection = db.collection('transactions');
        
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
