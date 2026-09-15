# 💸 Agente Financeiro Inteligente

Um aplicativo de controle financeiro moderno e inteligente, construído com foco em **Performance** (Vanilla JS/CSS) e **Arquitetura Serverless**. A principal proposta é eliminar a necessidade de planilhas complexas ou formulários longos: você simplesmente *conversa* com uma Inteligência Artificial, e ela organiza todo o seu dinheiro.

## 🚀 Como Funciona

Em vez de preencher formulários com valores, categorias e datas, você interage com o **Agente Financeiro (Google Gemini)** via Chat. O agente interpreta a linguagem natural, extrai os dados estruturados e os salva e categoriza automaticamente no seu Dashboard.

**Exemplos de Interação:**
- *"Gastei R$ 45 com pizza ontem"* -> O Agente registra uma **Despesa** na categoria **Alimentação**.
- *"Recebi 2000 reais de salário"* -> O Agente registra uma **Receita**.
- *"Tenho 1000 reais, onde devo investir?"* -> O Agente atua como consultor, fornecendo dicas com **alertas de risco de mercado** e já salva o valor na nova aba de Investimentos.
- *"Zere a minha carteira"* -> O Agente atende seu comando e reinicia sua conta, apagando os registros de teste.

## ✨ Principais Recursos

- **🤖 Inteligência Artificial Integrada:** Processamento de linguagem natural focado e rápido usando o modelo mais avançado `gemini-2.5-flash` via API do Google.
- **📊 Dashboard Dinâmico:** Um painel visual, sem a necessidade de refresh na página, que exibe Receitas, Despesas e Investimentos.
- **🎨 Gráfico Vanilla CSS:** Um belíssimo gráfico de distribuição da carteira construído 100% com matemática JavaScript nativa e a propriedade `conic-gradient` do CSS3 (zero bibliotecas externas pesadas).
- **☁️ Arquitetura Serverless:** Rotas de backend (`/api`) seguras, escaláveis e prontas para rodar no ambiente Vercel com Firebase Admin SDK.
- **🔥 Firebase Authentication & Cloud Firestore:** Autenticação gerenciada e banco de dados NoSQL em nuvem em tempo real.
- **🌗 Dark Mode e Temas:** Alternância de tema fluida utilizando variáveis de CSS nativo.
- **💡 Hover Cards (CSS Tooltips):** Instruções elegantes e velozes espalhadas pela interface, feitas inteiramente em CSS (Hover e z-index), sem depender de renderização JS.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18+, TypeScript (ES2022+ com `strict: true`), Vite, Zod (Validação de Fronteira e Zero Trust), Firebase Client SDK, CSS Modules e Design Tokens em CSS nativo.
- **Backend:** Node.js (Vercel Serverless Functions) com Firebase Admin SDK.
- **Banco de Dados & Auth:** Google Cloud Firestore e Firebase Authentication.
- **IA:** SDK Oficial do Google Gemini (`@google/generative-ai`).

## ⚙️ Como Rodar Localmente (Desenvolvimento)

Para rodar este projeto em sua máquina local simulando a exata arquitetura Serverless:

1. **Instale as dependências e o Vercel CLI:**
   ```bash
   npm install
   npm install -g vercel
   ```

2. **Configure as Variáveis de Ambiente:**
   Crie um arquivo chamado `.env` na pasta principal do projeto (ele não subirá para o github) contendo as seguintes chaves:
   ```env
   VITE_FIREBASE_API_KEY="sua_api_key_do_firebase"
   VITE_FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="seu_projeto_id"
   VITE_FIREBASE_STORAGE_BUCKET="seu_projeto.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="seu_sender_id"
   VITE_FIREBASE_APP_ID="seu_app_id"
   FIREBASE_SERVICE_ACCOUNT_PATH="./serviceAccountKey.json"
   GEMINI_API_KEY="sua_chave_do_google_ai_studio"
   ```

3. **Inicie o Servidor:**
   ```bash
   vercel dev
   ```
   Acesse no navegador: `http://localhost:3000`.

## 📦 Deploy na Vercel

A infraestrutura está otimizada para CI/CD via **Vercel**. 
Basta fazer o push (envio) deste código para o seu repositório do GitHub e vincular na Vercel. A plataforma vai detectar a pasta `api/` automaticamente e gerar os endpoints serverless.
Lembre-se de configurar as variáveis de ambiente do Firebase e do Gemini nas configurações do projeto no painel da Vercel (incluindo `FIREBASE_SERVICE_ACCOUNT` com o conteúdo JSON da chave privada para produção).
