const inputField = document.getElementById('user-input');
const messageForm = document.getElementById('chat-form');
const maxHeight = 128;

function resizeInput() {
  inputField.style.height = 'auto';
  const newHeight = inputField.scrollHeight;

  if (newHeight > maxHeight) {
    inputField.style.height = maxHeight + 'px';
    inputField.style.overflowY = 'auto';
  } else {
    inputField.style.height = newHeight + 'px';
    inputField.style.overflowY = 'hidden';
  }
}

resizeInput();

inputField.addEventListener('input', resizeInput);

inputField.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    messageForm.requestSubmit();
  }
});