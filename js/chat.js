// js/chat.js
import { createElementSafe } from './utils.js';
import { sendMessageToAI } from './api.js';

export function initChat(userId) {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatHistory = document.getElementById('chat-history');

    if (!chatForm || !chatInput || !chatHistory) return;

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // 1. Append user message securely
        appendMessage(messageText, 'user');
        chatInput.value = '';
        
        // 2. Append typing indicator
        const typingId = 'typing-' + Date.now();
        appendTypingIndicator(typingId);
        
        // Scroll to bottom
        scrollToBottom(chatHistory);

        // 3. Send to API (Real)
        try {
            const response = await sendMessageToAI(messageText, userId);
            removeTypingIndicator(typingId);
            appendMessage(response.text, 'bot');
            
            // Avisar o main.js para recarregar o dashboard
            window.dispatchEvent(new CustomEvent('transactionAdded'));
        } catch (error) {
            removeTypingIndicator(typingId);
            appendMessage(`❌ Ops: ${error.message}`, 'bot');
        }

        scrollToBottom(chatHistory);
    });

    function appendMessage(text, sender) {
        // Create Bubble: <div class="message-bubble">Text</div>
        const bubble = createElementSafe('div', { className: 'message-bubble' }, text);
        
        // Create Container: <div class="message user|bot">...</div>
        const messageContainer = createElementSafe('div', { className: `message ${sender}` }, bubble);
        
        chatHistory.appendChild(messageContainer);
    }

    function appendTypingIndicator(id) {
        const bubble = createElementSafe('div', { className: 'message-bubble' }, "Digitando...");
        const messageContainer = createElementSafe('div', { className: 'message bot', id: id }, bubble);
        chatHistory.appendChild(messageContainer);
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom(container) {
        container.scrollTop = container.scrollHeight;
    }
}
