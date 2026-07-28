const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Tablica przechowująca całą historię rozmowy dla zachowania kontekstu
let conversationHistory = [];

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Dodaj wiadomość użytkownika do UI i historii
    appendMessage(text, 'user-message');
    conversationHistory.push({ role: 'user', content: text });
    userInput.value = '';

    // 2. Przygotuj kontener na odpowiedź bota (efekt streamingu)
    const botMessageDiv = appendMessage('', 'bot-message');

    try {
        // 3. Wyślij żądanie do naszego backendu Express
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory })
        });

        if (!response.ok) throw new Error('Błąd połączenia z serwerem.');

        // 4. Odczytywanie strumienia danych (ReadableStream)
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let botResponseText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Dekodowanie binarnego fragmentu na tekst
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonStr = line.slice(6);
                        const parsed = JSON.parse(jsonStr);
                        
                        if (parsed.content) {
                            botResponseText += parsed.content;
                            const rawHtml = marked.parse(botResponseText);
                            botMessageDiv.innerHTML = DOMPurify.sanitize(rawHtml);
                            chatWindow.scrollTop = chatWindow.scrollHeight;
                        }
                    } catch (e) {
                        // Ignoruj niepełne linie JSON w strumieniu
                    }
                }
            }
        }

        console.log(botResponseText);
        // 5. Po zakończeniu streamu zapisz pełną odpowiedź w historii
        conversationHistory.push({ role: 'assistant', content: botResponseText });

    } catch (error) {
        console.error(error);
        botMessageDiv.innerText = 'Wystąpił błąd podczas pobierania odpowiedzi.';
        botMessageDiv.style.color = 'red';
    }
});

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return messageDiv;
}