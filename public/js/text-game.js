const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
let conversationHistory = [];
let initialPromptSended = false;

sendPrompt("You are an API for text RPG game with user. Create a interesting but simple story. Tell what is happening and after that give 4 short decisions in plain text in format\n [A - First decision]\n[B - Second decision]\n[C - Third decision]\n[D - Fourth decision]\nYou will be send corresponding letter.");

// Send initial prompt
/*
async function sendInitalPrompt(initialPrompt) {
    conversationHistory.push({ role: 'user', content: initialPrompt });

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
        let decisionsStart;
        let decisionsEnd;
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("decision-buttons-container")

        if (botMessageDiv.innerHTML.includes('[A') && botMessageDiv.innerHTML.includes(']')) {
            const buttonA = document.createElement("button");
            buttonA.setAttribute("onclick", "sendAnswer('A')");
            let startA = botMessageDiv.innerHTML.indexOf("[A -", 0);
            let endA = botMessageDiv.innerHTML.indexOf("]", startA);
            buttonA.innerHTML = botMessageDiv.innerHTML.slice(startA + 4, endA)
            buttonContainer.appendChild(buttonA);

            if (botMessageDiv.innerHTML.includes('[B') && botMessageDiv.innerHTML.includes(']')) {
                const buttonB = document.createElement("button");
                buttonB.setAttribute("onclick", "sendAnswer('B')");
                let startB = botMessageDiv.innerHTML.indexOf("[B -", endA);
                let endB = botMessageDiv.innerHTML.indexOf("]", startB);
                buttonB.innerHTML = botMessageDiv.innerHTML.slice(startB + 4, endB)
                buttonContainer.appendChild(buttonB);

                if (botMessageDiv.innerHTML.includes('[C') && botMessageDiv.innerHTML.includes(']')) {
                    const buttonC = document.createElement("button");
                    buttonC.setAttribute("onclick", "sendAnswer('C')");
                    let startC = botMessageDiv.innerHTML.indexOf("[C -", endB);
                    let endC = botMessageDiv.innerHTML.indexOf("]", startC);
                    buttonC.innerHTML = botMessageDiv.innerHTML.slice(startC + 4, endC)
                    buttonContainer.appendChild(buttonC);

                    if (botMessageDiv.innerHTML.includes('[D') && botMessageDiv.innerHTML.includes(']')) {
                        const buttonD = document.createElement("button");
                        buttonD.setAttribute("onclick", "sendAnswer('D')");
                        let startD = botMessageDiv.innerHTML.indexOf("[D -", endC);
                        let endD = botMessageDiv.innerHTML.indexOf("]", startD);
                        buttonD.innerHTML = botMessageDiv.innerHTML.slice(startD + 4, endD)
                        buttonContainer.appendChild(buttonD);
                    }
                }
            }
        }
        botMessageDiv.innerHTML = botMessageDiv.innerHTML.slice(0, decisionsStart) + botMessageDiv.innerHTML.slice(decisionsEnd);
        botMessageDiv.appendChild(buttonContainer);

        console.log(botResponseText);
        // 5. Po zakończeniu streamu zapisz pełną odpowiedź w historii
        conversationHistory.push({ role: 'assistant', content: botResponseText });

    } catch (error) {
        console.error(error);
        botMessageDiv.innerText = 'Wystąpił błąd podczas pobierania odpowiedzi.';
        botMessageDiv.style.color = 'red';
    }

}
*/

function makeDecision(decision) {
    buttonA = document.getElementById("decision-A")
    buttonB = document.getElementById("decision-B")
    buttonC = document.getElementById("decision-C")
    buttonD = document.getElementById("decision-D")

    buttonA.disabled = true;
    buttonB.disabled = true;
    buttonC.disabled = true;
    buttonD.disabled = true;
    switch (decision) {
        case 'A':
            buttonA.classList.add('selected-decision');
            sendPrompt('A');
            break;
        case 'B':
            buttonB.classList.add('selected-decision');
            sendPrompt('B');
            break;
        case 'C':
            buttonC.classList.add('selected-decision');
            sendPrompt('C');
            break;
        case 'D':
            buttonD.classList.add('selected-decision');
            sendPrompt('D');
            break;
        default:
            break;
    }
    buttonA.removeAttribute('id');
    buttonB.removeAttribute('id');
    buttonC.removeAttribute('id');
    buttonD.removeAttribute('id');
}

async function sendPrompt(prompt) {
    conversationHistory.push({ role: 'user', content: prompt });

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
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("decision-buttons-container")
        let decisionsStart;
        let decisionsEnd;

        if (botMessageDiv.innerHTML.includes('[A') && botMessageDiv.innerHTML.includes(']')) {
            const buttonA = document.createElement("button");
            buttonA.setAttribute("onclick", "makeDecision('A')");
            buttonA.id = "decision-A";
            let startA = botMessageDiv.innerHTML.indexOf("[A -", 0);
            let endA = botMessageDiv.innerHTML.indexOf("]", startA);
            buttonA.innerHTML = botMessageDiv.innerHTML.slice(startA + 4, endA)
            buttonContainer.appendChild(buttonA);

            if (botMessageDiv.innerHTML.includes('[B') && botMessageDiv.innerHTML.includes(']')) {
                const buttonB = document.createElement("button");
                buttonB.setAttribute("onclick", "makeDecision('B')");
                buttonB.id = "decision-B";
                let startB = botMessageDiv.innerHTML.indexOf("[B -", endA);
                let endB = botMessageDiv.innerHTML.indexOf("]", startB);
                buttonB.innerHTML = botMessageDiv.innerHTML.slice(startB + 4, endB)
                buttonContainer.appendChild(buttonB);

                if (botMessageDiv.innerHTML.includes('[C') && botMessageDiv.innerHTML.includes(']')) {
                    const buttonC = document.createElement("button");
                    buttonC.setAttribute("onclick", "makeDecision('C')");
                    buttonC.id = "decision-C";
                    let startC = botMessageDiv.innerHTML.indexOf("[C -", endB);
                    let endC = botMessageDiv.innerHTML.indexOf("]", startC);
                    buttonC.innerHTML = botMessageDiv.innerHTML.slice(startC + 4, endC)
                    buttonContainer.appendChild(buttonC);

                    if (botMessageDiv.innerHTML.includes('[D') && botMessageDiv.innerHTML.includes(']')) {
                        const buttonD = document.createElement("button");
                        buttonD.setAttribute("onclick", "makeDecision('D')");
                        buttonD.id = "decision-D";
                        let startD = botMessageDiv.innerHTML.indexOf("[D -", endC);
                        let endD = botMessageDiv.innerHTML.indexOf("]", startD);
                        buttonD.innerHTML = botMessageDiv.innerHTML.slice(startD + 4, endD);
                        buttonContainer.appendChild(buttonD);
                        decisionsStart = startA;
                        decisionsEnd = endD;
                    }
                }
            }
        }
        botMessageDiv.innerHTML = botMessageDiv.innerHTML.slice(0, decisionsStart) + botMessageDiv.innerHTML.slice(decisionsEnd + 1);
        botMessageDiv.appendChild(buttonContainer);

        console.log(botResponseText);
        // 5. Po zakończeniu streamu zapisz pełną odpowiedź w historii
        conversationHistory.push({ role: 'assistant', content: botResponseText });

    } catch (error) {
        console.error(error);
        botMessageDiv.innerText = 'Wystąpił błąd podczas pobierania odpowiedzi.';
        botMessageDiv.style.color = 'red';
    }
};

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerText = text;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return messageDiv;
}