# 💸 Agente Financeiro Inteligente

> Aplicativo moderno de gestão financeira pessoal assistido por Inteligência Artificial (Google Gemini), combinando uma experiência conversacional intuitiva, metas financeiras em caixinhas, dashboard em tempo real e gráficos em CSS puro com arquitetura Serverless.

---

## 🌟 Visão Geral

O **Agente Financeiro Inteligente** elimina a complexidade, a frieza e o atrito cognitivo de planilhas manuais ou formulários extensos. Em vez de preencher cadastros repetitivos de valores, categorias e datas, você simplesmente **conversa com o Agente em linguagem natural**.

A Inteligência Artificial interpreta a intenção do usuário, extrai dados estruturados, valida saldos disponíveis, categoriza despesas e receitas, gerencia aportes em caixinhas de objetivos e atualiza o painel analítico instantaneamente.

```
                  ┌───────────────────────────────┐
                  │    Usuário (Linguagem Natural)│
                  └───────────────┬───────────────┘
                                  │
                                  ▼
    ┌───────────────────────────────────────────────────────────┐
    │  💬 Chat Assistido com Google Gemini (Fallback Resiliente) │
    └──────┬──────────────────────┬──────────────────────┬──────┘
           │                      │                      │
           ▼                      ▼                      ▼
  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │ 📊 Dashboard     │  │ 🎯 Caixinhas     │  │ 🔐 Firebase      │
  │ Saldo & Gráfico  │  │ Metas & Aportes  │  │ Auth & Firestore │
  │ em CSS Puro      │  │ com Saldo Livre  │  │ em Tempo Real    │
  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 🚀 Exemplos de Interação Conversacional

- **Registrar Despesas:**  
  > *"Gastei R$ 65,00 no almoço com amigos"*  
  > ➜ O Agente classifica como **Despesa**, categoria **Alimentação** e debita do seu saldo.

- **Adicionar Renda / Saldo:**  
  > *"Recebi meu salário de 3500 reais"* ou *"Adicionar saldo de 500"*  
  > ➜ O Agente registra uma **Receita**, eleva seu **Saldo Disponível** e orienta sobre a regra de divisão de orçamento (ex.: 50-30-20).

- **Criar e Alimentar Caixinhas de Metas:**  
  > *"Quero criar uma caixinha de Reserva de Emergência com meta de 6000 e guardar 300 agora"*  
  > ➜ O Agente cria a meta, valida se você tem saldo em conta e direciona o aporte para a caixinha.

- **Consultoria e Educação Financeira:**  
  > *"Sobrou R$ 400 este mês, onde posso investir?"*  
  > ➜ O Agente fornece orientações educativas sobre renda fixa com liquidez diária (Tesouro Selic/CDBs), sempre acompanhadas de alertas claros sobre risco de mercado.

- **Zerar Carteira (Reset):**  
  > *"Zere minha carteira"*  
  > ➜ O Agente atende o comando com confirmação e limpa os dados de teste da conta.

---

## ✨ Principais Funcionalidades

### 🤖 1. IA Conversacional Resiliente (Google Gemini)
- Processamento semântico nativo via SDK oficial `@google/generative-ai`.
- **Estratégia de Fallback em Cascata:** Se um modelo específico estiver temporariamente indisponível ou rate-limited, o sistema alterna automaticamente entre modelos homologados (`gemini-3.5-flash`, `gemini-flash-latest`, `gemini-3.5-flash-lite`, `gemini-2.5-flash`).
- **Guardrails Educativos:** Respostas estruturadas em passos práticos, sem promessas irrealistas de ganhos e com avisos éticos de risco.

### 🎯 2. Caixinhas de Metas & Sonhos
- Mapeamento de objetivos financeiros (ex.: Reserva de Emergência, Carro Novo, Viagem de Férias).
- Acompanhamento de **Meta Total**, **Meta Mensal Sugerida**, **Valor Acumulado** e barra de progresso percentual.
- **Validação de Saldo Livre:** O sistema impede aportes que excedam o saldo disponível em conta.
- Botão de **Aporte Mensal Rápido** diretamente no card da caixinha com feedback de sucesso/erro.

### 📊 3. Dashboard Analítico em Tempo Real
- Cards de resumo: **Saldo Disponível**, **Receitas**, **Despesas** e **Investimentos**.
- **Gráfico de Pizza em CSS Puro:** Desenvolvido 100% com matemática JavaScript nativa e a propriedade `conic-gradient` do CSS3, eliminando o peso de bibliotecas gráficas pesadas (zero Chart.js ou D3).
- Detalhamento de gastos categorizados com cálculo de participação percentual.

### 🔐 4. Autenticação & Persistência Segura
- Autenticação gerenciada via **Firebase Authentication** (email/senha) com persistência de sessão.
- Banco de dados em nuvem em tempo real com **Cloud Firestore** e isolamento completo por usuário (`userId`).
- Validação estrita de contratos de dados na fronteira com **Zod** (filosofia Zero Trust).

### 🎨 5. Design System, Dark Mode & Acessibilidade
- Alternância fluida entre tema **Escuro** e **Claro** baseada em variáveis CSS nativas (`tokens.css`).
- Componentes acessíveis com navegação por teclado, atributos ARIA e avisos de tela.
- **Tooltips em CSS Puro:** Dicas de contexto nos cards e cabeçalhos sem custos de re-renderização JavaScript.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Finalidade |
| :--- | :--- | :--- |
| **Frontend** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Interface reativa, modular e fortemente tipada (`strict: true`) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Empacotamento ultraveloz e Hot Module Replacement (HMR) |
| **Estilização** | CSS Modules + Vanilla CSS Tokens | Design system modular, temas claro/escuro e zero runtime de CSS |
| **Validação** | [Zod](https://zod.dev/) | Validação de esquemas e contratos de dados na borda |
| **Backend** | Node.js Serverless Functions | Endpoints desacoplados e escaláveis na pasta `/api` |
| **Plataforma Nuvem** | [Vercel](https://vercel.com/) | Hospedagem de frontend e execução de Serverless Functions |
| **Banco & Auth** | [Firebase](https://firebase.google.com/) (Auth, Firestore, Admin SDK) | Autenticação de usuários e persistência NoSQL |
| **Inteligência Artificial** | [Google Gemini API](https://ai.google.dev/) | Processamento de linguagem natural e categorização financeira |

---

## 📂 Estrutura do Projeto

```plaintext
dio-lab-vibe-coding-app-financas/
├── api/                         # Backend Serverless Functions (Vercel)
│   ├── lib/
│   │   ├── balanceUtils.js      # Utilitários de cálculo de saldo livre e caixinhas
│   │   └── firebaseAdmin.js     # Inicialização resiliente do Firebase Admin SDK
│   ├── box-deposit.js           # Rota para aporte rápido em caixinha
│   ├── chat.js                  # Orquestração do chat com Gemini e persistência
│   ├── dashboard.js             # Agregação analítica de métricas financeiras
│   └── login.js                 # Verificação/utilitário de sessão
├── public/                      # Ativos estáticos públicos
│   └── favicon.svg              # Favicon oficial do aplicativo
├── src/                         # Código-fonte do Frontend (React + TypeScript)
│   ├── components/              # Componentes de UI genéricos (Button, Sidebar, Tooltip)
│   ├── features/                # Módulos funcionais isolados
│   │   ├── Auth/                # Login, cadastro e estado de sessão
│   │   ├── Chat/                # Interface do chat, input, histórico e badge de saldo
│   │   └── Dashboard/           # Cards, gráfico em CSS, caixinhas e categorias
│   ├── hooks/                   # Hooks customizados globais (ex.: useTheme)
│   ├── lib/                     # Inicialização do Firebase Client SDK
│   ├── styles/                  # Design tokens, variáveis CSS e reset global
│   ├── types/                   # Tipagens TypeScript compartilhadas
│   ├── utils/                   # Utilitários de formatação e chamadas de API
│   ├── App.tsx                  # Componente principal e orquestrador de estado
│   └── main.tsx                 # Ponto de entrada da aplicação React
├── .env.example                 # Modelo documentado de variáveis de ambiente
├── index.html                   # HTML base com fontes tipográficas e meta tags
├── package.json                 # Dependências e scripts de automação
├── tsconfig.json                # Configurações do compilador TypeScript
├── vercel.json                  # Roteamento e configurações da Vercel
└── vite.config.ts               # Configuração do Vite e plugins
```

---

## ⚙️ Como Executar Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior instalada.
- Uma conta no [Firebase Console](https://console.firebase.google.com/) com um projeto configurado (Authentication e Cloud Firestore ativados).
- Uma chave de API gratuita do [Google AI Studio](https://aistudio.google.com/).

### 2. Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/rafaelpoh/dio-lab-vibe-coding-app-financas.git
cd dio-lab-vibe-coding-app-financas
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto copiando como referência o arquivo `.env.example`:

```bash
cp .env.example .env
```

Preencha as chaves no arquivo `.env`:
```env
# Firebase Client (Frontend)
VITE_FIREBASE_API_KEY="sua_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu-projeto-id"
VITE_FIREBASE_STORAGE_BUCKET="seu-projeto.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu_messaging_sender_id"
VITE_FIREBASE_APP_ID="seu_firebase_app_id"

# Firebase Admin (Backend local)
# Baixe a chave privada JSON no Firebase Console (Configurações do Projeto > Contas de Serviço)
FIREBASE_SERVICE_ACCOUNT_PATH="./serviceAccountKey.json"

# Google Gemini API
GEMINI_API_KEY="sua_gemini_api_key"
```

> ⚠️ **Atenção:** Os arquivos `.env` e `serviceAccountKey.json` estão protegidos no `.gitignore` e nunca devem ser enviados ao repositório público.

### 4. Executar em Desenvolvimento

#### Opção A: Ambiente Completo com Vercel CLI (Recomendado)
Para simular localmente tanto o frontend React quanto as Serverless Functions da pasta `/api`:
```bash
npm install -g vercel
vercel dev
```
O aplicativo estará acessível em: `http://localhost:3000`.

#### Opção B: Apenas o Frontend Vite
```bash
npm run dev
```
O aplicativo estará acessível em: `http://localhost:5173`.

---

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento rápido do Vite.
- `npm run build`: Executa a verificação estrita de tipagem com TypeScript (`tsc`) e compila o bundle de produção otimizado em `dist/`.
- `npm run preview`: Inicia um servidor local para inspecionar o bundle de produção gerado.

---

## ☁️ Deploy na Vercel

O projeto está 100% configurado para CI/CD automático na **Vercel**:

1. Crie um novo projeto na Vercel importando este repositório do GitHub.
2. A plataforma detectará automaticamente o Vite no frontend e os endpoints na pasta `api/`.
3. No painel da Vercel (**Settings > Environment Variables**), adicione as variáveis:
   - Todas as variáveis que iniciam com `VITE_FIREBASE_*`.
   - `GEMINI_API_KEY`.
   - `FIREBASE_SERVICE_ACCOUNT`: Cole o conteúdo de texto JSON completo da sua chave privada de conta de serviço (o backend em `api/lib/firebaseAdmin.js` faz o parse automático dessa variável na nuvem).
4. Clique em **Deploy**.

---

## 🛡️ Segurança e Boas Práticas

- **Prevenção Total contra XSS:** Não há utilização de `innerHTML`, `outerHTML` ou métodos inseguros de injeção de HTML dinâmico. Toda manipulação textual utiliza bindings seguros e `textContent`.
- **Zero Trust & Validação de Fronteiras:** Requisições de formulários e contratos de API são validados rigorosamente em tempo de execução através do Zod.
- **Isolamento de Estilos:** Zero poluição global de CSS graças ao uso de CSS Modules escopados e tokens centralizados em `src/styles/tokens.css`.
- **Proteção de Segredos:** Nenhuma chave privada ou segredo sensível trafega no bundle do cliente; o contato com o Google Gemini e Firestore Admin é restrito ao ambiente isolado do backend.

---

## 📄 Licença

Este projeto é desenvolvido para fins de estudo e portfólio sob a licença **ISC**. Sinta-se livre para explorar, clonar e aprimorar!
