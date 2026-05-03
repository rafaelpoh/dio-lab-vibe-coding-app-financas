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
- **☁️ Arquitetura Serverless:** Rotas de backend (`/api`) seguras, escaláveis e prontas para rodar no ambiente Vercel.
- **🗄️ Persistência no MongoDB:** Banco de dados ágil para armazenar o histórico de conversas financeiras de cada usuário.
- **🌗 Dark Mode e Temas:** Alternância de tema fluida utilizando variáveis de CSS nativo.
- **💡 Hover Cards (CSS Tooltips):** Instruções elegantes e velozes espalhadas pela interface, feitas inteiramente em CSS (Hover e z-index), sem depender de renderização JS.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5 Semântico, CSS3 Moderno e JavaScript Vanilla (ES6 Modules e Event Delegation).
- **Backend:** Node.js (Vercel Serverless Functions).
- **Banco de Dados:** MongoDB Atlas (pacote `mongodb`).
- **IA:** SDK Oficial do Google Gemini (`@google/generative-ai`).

## ⚙️ Como Rodar Localmente (Desenvolvimento)

Para rodar este projeto em sua máquina local simulando a exata arquitetura Serverless:

1. **Instale as dependências e o Vercel CLI:**
   ```bash
   npm install
   npm install -g vercel
   ```

2. **Configure as Variáveis de Ambiente:**
   Crie um arquivo chamado `.env` na pasta principal do projeto (ele não subirá para o github) contendo as seguintes chaves reais:
   ```env
   MONGODB_URI="sua_string_de_conexao_do_mongodb_atlas"
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
Lembre-se apenas de preencher as variáveis de ambiente (`MONGODB_URI` e `GEMINI_API_KEY`) diretamente nas configurações do projeto lá no painel da Vercel.
