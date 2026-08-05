const chatWindow = document.getElementById('chat-window');

let conversationHistory = [];

startGame();

async function startGame() {
  await sendPrompt('Start Game.');
}

function makeDecision(decision) {
  const buttonA = document.getElementById('decision-A');
  const buttonB = document.getElementById('decision-B');
  const buttonC = document.getElementById('decision-C');
  const buttonD = document.getElementById('decision-D');

  [buttonA, buttonB, buttonC, buttonD].forEach((btn) => {
    btn.disabled = true;
    btn.removeAttribute('id');
  });

  const selectedButton = { A: buttonA, B: buttonB, C: buttonC, D: buttonD }[decision];
  selectedButton.classList.add('selected-decision');

  sendPrompt(decision);
}

async function sendPrompt(prompt) {
  conversationHistory.push({ role: 'user', content: prompt });
  const botMessageDiv = appendMessage('', 'bot-message');

  try {
    const response = await fetch('/api/text-game', {
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

    renderDecisionButtons(botMessageDiv);
    conversationHistory.push({ role: 'assistant', content: botResponseText });
  } catch (error) {
    console.error(error);
    botMessageDiv.innerText = 'An error occurred while fetching the response.';
    botMessageDiv.style.color = 'red';
  }
}

function renderDecisionButtons(botMessageDiv) {
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('decision-buttons-container');

  const html = botMessageDiv.innerHTML;
  const letters = ['A', 'B', 'C', 'D'];
  let searchFrom = 0;
  let rangeStart = null;
  let rangeEnd = null;

  for (const letter of letters) {
    const start = html.indexOf(`[${letter} -`, searchFrom);
    if (start === -1) break;

    const end = html.indexOf(']', start);
    if (end === -1) break;

    const button = document.createElement('button');
    button.id = `decision-${letter}`;
    button.setAttribute('onclick', `makeDecision('${letter}')`);
    button.innerHTML = html.slice(start + 4, end);
    buttonContainer.appendChild(button);

    if (rangeStart === null) rangeStart = start;
    rangeEnd = end;
    searchFrom = end;
  }

  if (rangeStart !== null) {
    botMessageDiv.innerHTML = html.slice(0, rangeStart) + html.slice(rangeEnd + 1);
  }
  botMessageDiv.appendChild(buttonContainer);
}

function appendMessage(text, className) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message-game', className);
  messageDiv.innerText = text;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return messageDiv;
}