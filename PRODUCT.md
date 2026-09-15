# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuários individuais que buscam gerenciar suas finanças pessoais de forma ágil, sem o atrito cognitivo de preencher planilhas manuais ou formulários complexos. Pessoas em movimento que preferem expressar transações financeiras em linguagem natural através de chat.

## Product Purpose

Democratizar o controle financeiro pessoal eliminando o trabalho manual de categorização. O produto transforma conversas em registros financeiros estruturados em tempo real, calculando balanços de receitas, despesas e investimentos e oferecendo orientações conscientes assistidas por Inteligência Artificial (Google Gemini).

## Positioning

Diferente de aplicativos tradicionais de finanças que exigem cadastros manuais e exaustivos de formulários, o Agente Financeiro Inteligente utiliza um agente de IA conversacional que compreende contextos informais (gírias, valores fracionados, pedidos de conselho e comandos de reset de carteira), unindo o fluxo de bate-papo a um painel analítico dinâmico e gráfico em CSS puro.

## Operating Context

Acessado via navegador desktop ou mobile, em sessões curtas e recorrentes após a ocorrência de gastos, recebimentos ou momentos de decisão financeira (ex: "onde investir esse dinheiro sobressalente?"). Funciona tanto em ambientes claros quanto escuros (modo noturno fluido).

## Capabilities and Constraints

- **Entrada em Linguagem Natural:** Interpretação semântica com Google Gemini 2.5 Flash via Serverless Functions.
- **Visualização Reativa:** Painel analítico com cálculo de saldos (receitas, despesas, investimentos) e gráfico em pizza gerado com CSS3 `conic-gradient` nativo.
- **Persistência Segura:** Autenticação nativa via Firebase Authentication e armazenamento reativo isolado por usuário no Cloud Firestore.
- **Desempenho Estrito e Zero Trust:** Validação de entradas e contratos de dados com Zod, sem bibliotecas pesadas de visualização gráfica ou frameworks desnecessários de CSS.

## Brand Commitments

- **Nome:** Agente Financeiro Inteligente.
- **Tom de Voz:** Confiável, inteligente, encorajador, transparente e prático.
- **Identidade:** Visual limpo, sem ruídos ornamentais, priorizando clareza numérica e contraste rigoroso.

## Evidence on Hand

- Implementação funcional com React 18, TypeScript e CSS Modules.
- Arquitetura de API serverless em `/api/agent.ts`, `/api/chat.ts`, `/api/dashboard.ts`.
- Validação robusta de esquemas de dados em `src/features/*/schemas.ts`.

## Product Principles

1. **Atrito Cognitivo Zero:** A linguagem natural é o formulário definitivo; a interface deve acolher a intenção do usuário instantaneamente.
2. **Confiança e Transparência Numérica:** Valores, saldos e categorias devem ser apresentados com precisão inquestionável e alinhamento visual perfeito.
3. **Leveza e Desempenho Nativo:** Aproveitar ao máximo as capacidades nativas do navegador (Vanilla CSS, CSS Tokens, conic-gradient) antes de recorrer a dependências externas.
4. **Privacidade e Segurança:** Respeito absoluto aos dados financeiros do usuário com validação defensiva em todas as fronteiras de entrada.
