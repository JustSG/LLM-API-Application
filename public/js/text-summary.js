const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

let conversationHistory = [];

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  conversationHistory.push({ role: 'user', content: text });
  userInput.value = '';

  chatWindow.innerHTML = '';
  const botMessageDiv = appendMessage('', 'bot-message');

  try {
    const response = await fetch('/api/text-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory }),
    });

    if (!response.ok) throw new Error('Error while connecting to the server.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let botResponseText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const parsed = JSON.parse(line.slice(6));
          if (parsed.content) {
            botResponseText += parsed.content;
            const rawHtml = marked.parse(botResponseText);
            botMessageDiv.innerHTML = DOMPurify.sanitize(rawHtml);
            chatWindow.scrollTop = chatWindow.scrollHeight;
          }
        } catch (e) {
          continue;
        }
      }
    }

    conversationHistory.push({ role: 'assistant', content: botResponseText });
  } catch (error) {
    console.error(error);
    botMessageDiv.innerText = 'An error occurred while fetching the response.';
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