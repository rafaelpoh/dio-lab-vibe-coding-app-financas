// js/utils.js

/**
 * Cria um elemento HTML de forma segura, sem usar innerHTML.
 * @param {string} tag - A tag do elemento (ex: 'div', 'p', 'span').
 * @param {object} attributes - Objeto com os atributos (class, id, etc).
 * @param {string|HTMLElement|Array} content - Texto, elemento ou array de elementos para adicionar dentro.
 * @returns {HTMLElement} O elemento criado.
 */
export function createElementSafe(tag, attributes = {}, content = null) {
    const el = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            el.className = value;
        } else if (key.startsWith('data-')) {
            el.setAttribute(key, value);
        } else {
            el[key] = value;
        }
    }

    if (content) {
        if (typeof content === 'string' || typeof content === 'number') {
            el.textContent = content;
        } else if (content instanceof HTMLElement) {
            el.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(child => {
                if (typeof child === 'string' || typeof child === 'number') {
                    el.appendChild(document.createTextNode(child));
                } else if (child instanceof HTMLElement) {
                    el.appendChild(child);
                }
            });
        }
    }

    return el;
}

/**
 * Formata um número para moeda BRL.
 */
export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Retorna a data atual formatada (YYYY-MM-DD).
 */
export function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}
