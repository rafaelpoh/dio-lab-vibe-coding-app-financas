---
name: Agente Financeiro Inteligente
description: Interface financeira assistida por IA com atrito cognitivo zero e visualização reativa nativa.
colors:
  primary: "#3b82f6"
  primary-hover: "#2563eb"
  primary-light: "#eff6ff"
  success: "#10b981"
  danger: "#ef4444"
  warning: "#f59e0b"
  investment: "#8b5cf6"
  bg-primary: "#f8fafc"
  bg-secondary: "#ffffff"
  bg-tertiary: "#f1f5f9"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-tertiary: "#94a3b8"
  text-inverted: "#ffffff"
  border: "#e2e8f0"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverted}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  button-secondary:
    backgroundColor: "{colors.bg-tertiary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Agente Financeiro Inteligente

## Overview

**Creative North Star: "The Frictionless Financial Atelier"**

O Agente Financeiro Inteligente adota uma filosofia de clareza cirúrgica e ausência total de ruído visual. O ambiente prioriza o ritmo do diálogo financeiro e a imediata compreensão do estado patrimonial, combinando elementos táteis com tipografia geométrica humanista de alta legibilidade.

A densidade é balanceada: o chat opera como uma linha do tempo confortável para trocas em linguagem natural, enquanto o dashboard organiza métricas vitais em cartões respirados e um gráfico de distribuição contínuo renderizado de forma nativa. O modo escuro preserva as mesmas relações de contraste e hierarquia sem sobrecarregar a visão em uso noturno.

**Key Characteristics:**
- Tipografia Manrope com numerais tabulares rigorosos para alinhamento financeiro.
- Camadas suaves de elevação em vez de sombras pesadas ou bordas agressivas.
- Superfícies de navegador totalmente integradas à paleta da marca (seleção, cursor, rolagem).
- Feedback microinterativo táctil em cada botão e campo interativo.

## Colors

A paleta equilibra neutros frios de alta precisão com acentos semânticos nítidos para receitas, despesas e investimentos.

### Primary
- **Active Cobalt** (#3b82f6): Ponto focal de ação principal, navegação ativa e estado de foco interativo.

### Secondary
- **Vibrant Amethyst** (#8b5cf6): Identificação visual reservada para investimentos e patrimônio guardado.

### Tertiary
- **Amber Warning** (#f59e0b): Sinalização de riscos de mercado e confirmações de segurança.

### Neutral
- **Slate Text** (#0f172a): Texto principal com contraste superior a 10:1 no tema claro.
- **Muted Slate** (#475569): Textos de apoio, legendas e indicadores secundários.
- **Porcelain Surface** (#f8fafc): Superfície de fundo geral que reduz a fadiga ocular.
- **Pure Canvas** (#ffffff): Cartões e balões com respiro tonal.

### Named Rules
**The Pure Semantic Hue Rule.** Cores de status (verde para receitas, vermelho para despesas, roxo para investimentos) são reservadas exclusivamente para representação de fluxos monetários. A interface neutra nunca utiliza essas cores para fins meramente decorativos.

## Typography

**Display & Body Font:** Manrope (com fallback nativo para system-ui, -apple-system, sans-serif)  
**Numerical Treatment:** `font-variant-numeric: tabular-nums` em todas as exibições de moeda e dados.

**Character:** Geometria contemporânea com terminação aberta e excelente equilíbrio óptico tanto em títulos expressivos quanto em pequenos valores tabulares.

### Hierarchy
- **Display** (700, 2rem, 1.2): Logotipo de cabeçalho e títulos estruturais.
- **Headline** (600, 1.5rem, 1.3): Títulos de seções (Dashboard, Histórico de Conversa).
- **Title** (600, 1.125rem, 1.4): Títulos de cartões de resumo e gráficos.
- **Body** (400, 1rem, 1.5): Mensagens de conversa e instruções.
- **Label** (500, 0.875rem, 1.4): Rótulos de campos, botões e tags de categorias.

### Named Rules
**The Tabular Money Rule.** Todo valor monetário ou numérico derivado de transações deve obrigatoriamente renderizar com numerais tabulares para evitar que oscilações na largura dos algarismos quebrem o alinhamento visual.

## Layout

Baseado em um modelo de composição fluido e responsivo mobile-first:
- Em telas estreitas (< 768px), o layout se organiza verticalmente com barra de navegação no topo e áreas de trabalho em fluxo contínuo.
- Em desktops (>= 768px), a barra lateral se fixa à esquerda com 250px de largura, dedicando a área restante ao chat ou painel analítico.
- O grid de cartões transita de 1 coluna (mobile) para 3 colunas harmoniosas (desktop).

## Elevation & Depth

O sistema adota elevação tonal suave em camadas. Em repouso, os cartões repousam sobre o fundo com sombras de dispersão ampla e baixo contraste, ganhando foco óptico por meio de contraste de fundo e contornos refinados de 1px.

### Shadow Vocabulary
- **Ambient Low** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)`): Elementos sutis em repouso e balões de bot.
- **Ambient Medium** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.06)`): Cartões de dashboard e tooltips elevados.
- **Elevated Floating** (`box-shadow: 0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)`): Modal de autenticação e sobreposições ativas.

### Named Rules
**The Layered Light Rule.** Toda sombra deve carregar deslocamento vertical e desfoque suave; sombras duras de bloco com desfoque zero são estritamente recusadas.

## Shapes

- Cantos arredondados padronizados: 4px (`sm`) para acentos pontuais, 8px (`md`) para botões e inputs, 16px (`lg`) para cartões e balões de conversa, 9999px (`full`) para badges e botões circulares.
- Linguagem de contornos: bordas nítidas de 1px em `--color-border` delimitando planos sem poluição visual.

## Components

### Buttons
- **Primary:** Fundo azul cobalto, texto invertido, cantos de 8px, padding de 12px 16px, transição táctil com `:active { transform: scale(0.98); }`.
- **Secondary:** Fundo terciário suave com borda sutil, texto primário e hover tonal.
- **Icon:** Botão circular minimalista para alternância de tema e ações rápidas.

### Inputs & Chat Area
- Campo em formato de pílula (`radius-full`) ou cantos de 8px, com borda neutra e iluminação azulada via `:focus-visible` sem anéis recortados.

### Chat Bubbles
- Balão do Usuário: alinhado à direita, fundo primário, cantos de 16px com o canto inferior direito de 4px para ancoragem.
- Balão do Bot: alinhado à esquerda, fundo de cartão com contorno suave e canto inferior esquerdo de 4px.

### Cards & Summary
- Cartões com padding de 24px, cantos de 16px, título em cinza atenuado com tooltip integrado e valor financeiro destacado em tipografia tabular e cor semântica.

## Do's and Don'ts

### Do:
- **Do** aplicar `font-variant-numeric: tabular-nums` em qualquer elemento que represente dinheiro ou percentuais.
- **Do** utilizar variáveis CSS de `tokens.css` para toda e qualquer declaração de cor, espaço e sombra.
- **Do** garantir que todo elemento interativo possua tratamento visual refinado para `:hover`, `:active` e `:focus-visible`.
- **Do** fornecer estados vazios acolhedores e contextualizados em listas sem transações.

### Don't:
- **Don't** utilizar fontes genéricas e saturadas (Inter, Roboto, Geist).
- **Don't** utilizar `innerHTML` ou injeções de HTML dinâmico sob qualquer hipótese.
- **Don't** aplicar gradientes em textos ou sombras tipo "neon glow" puramente decorativas.
- **Don't** aplicar bordas coloridas laterais espessas (> 1px) em cartões ou alertas.
