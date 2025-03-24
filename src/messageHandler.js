import { loadMessages, saveMessages } from './utils.js';

export function initMessageHandler(agentId, messagesContainer, textarea, sendButton) {
  // Dummy agent data (replace with API call later)
  const agent = { name: "Test Agent", avatar: "https://picsum.photos/38" };
  const user = { name: "You", avatar: "https://picsum.photos/38" };

  // State
  let messages = loadMessages(agentId);
  let isAgentTyping = false;
  let error = null;
  let renderedMessageIds = new Set();

  // Render messages
  function renderMessages() {
    console.log('Rendering messages');

    if (error) {
      messagesContainer.innerHTML = '';
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'text-align: center; color: #6b7280; margin-top: 40px; display: flex; flex-direction: column; gap: 8px; align-items: center; font-size: 14px;';
      errorDiv.innerHTML = `
        <span>${error.message}</span>
        <button style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.2s ease;">Retry</button>
      `;
      errorDiv.querySelector('button').onmouseover = () => { errorDiv.querySelector('button').style.background = '#2563eb'; };
      errorDiv.querySelector('button').onmouseout = () => { errorDiv.querySelector('button').style.background = '#3b82f6'; };
      errorDiv.querySelector('button').onclick = () => { error = null; renderMessages(); };
      messagesContainer.appendChild(errorDiv);
      return;
    }

    if (!messages.length && !isAgentTyping) {
      messagesContainer.innerHTML = '';
      const emptyDiv = document.createElement('div');
      emptyDiv.style.cssText = 'text-align: center; color: #6b7280; margin-top: 40px; font-size: 14px; font-style: italic;';
      emptyDiv.textContent = `${agent.name} is ready to chat`;
      messagesContainer.appendChild(emptyDiv);
      return;
    }

    messages.forEach((msg) => {
      if (renderedMessageIds.has(msg.id)) return;

      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = `
        display: flex;
        gap: 12px;
        align-items: flex-start;
      `;
      const sender = msg.sender === 'agent' ? agent : user;
      const avatar = document.createElement('img');
      avatar.src = sender.avatar;
      avatar.style.cssText = 'width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;';
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = 'flex-grow: 1;';
      const nameDiv = document.createElement('div');
      nameDiv.style.cssText = 'display: flex; align-items: center; gap: 8px;';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = sender.name;
      nameSpan.style.cssText = 'font-weight: 600; font-size: 14px; color: #1f2937;';
      const timestampDiv = document.createElement('span');
      timestampDiv.textContent = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timestampDiv.style.cssText = 'font-size: 12px; color: #6b7280;';
      nameDiv.appendChild(nameSpan);
      nameDiv.appendChild(timestampDiv);
      const textDiv = document.createElement('div');
      textDiv.textContent = msg.content;
      textDiv.style.cssText = `
        background: ${msg.sender === 'user' ? '#3b82f6' : '#e5e7eb'};
        color: ${msg.sender === 'user' ? 'white' : '#1f2937'};
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.5;
        max-width: 80%;
        word-wrap: break-word;
        ${msg.sender === 'user' ? 'margin-left: auto; border-bottom-right-radius: 4px;' : 'border-bottom-left-radius: 4px;'}
      `;
      contentDiv.appendChild(nameDiv);
      contentDiv.appendChild(textDiv);
      messageDiv.appendChild(avatar);
      messageDiv.appendChild(contentDiv);
      messagesContainer.appendChild(messageDiv);

      renderedMessageIds.add(msg.id);
    });

    const typingDiv = messagesContainer.querySelector('.typing-indicator');
    if (isAgentTyping) {
      if (!typingDiv) {
        const newTypingDiv = document.createElement('div');
        newTypingDiv.className = 'typing-indicator';
        newTypingDiv.style.cssText = 'display: flex; gap: 12px; align-items: center;';
        const avatar = document.createElement('img');
        avatar.src = agent.avatar;
        avatar.style.cssText = 'width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;';
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'background: #e5e7eb; padding: 8px 12px; border-radius: 12px; border-bottom-left-radius: 4px;';
        contentDiv.innerHTML = `
          <span style="color: #6b7280; font-size: 14px; font-style: italic;">
            ${agent.name} is typing
            <span class="typing-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </span>
        `;
        newTypingDiv.appendChild(avatar);
        newTypingDiv.appendChild(contentDiv);
        messagesContainer.appendChild(newTypingDiv);
      }
    } else if (typingDiv) {
      typingDiv.remove();
    }

    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });
  }

  // Handle sending messages
  async function sendMessage() {
    const content = textarea.value.trim();
    if (!content) return;

    const newMessage = { id: Date.now().toString(), sender: 'user', content, timestamp: Date.now() };
    messages.push(newMessage);
    saveMessages(agentId, messages);
    textarea.value = '';
    renderMessages();

    try {
      isAgentTyping = true;
      renderMessages();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const shouldFail = Math.random() < 0.2;
      if (shouldFail) throw new Error('Failed to connect to agent');

      const agentMessage = { id: (Date.now() + 1).toString(), sender: 'agent', content: `Hi! I'm ${agent.name}. You said: "${content}"`, timestamp: Date.now() };
      messages.push(agentMessage);
      saveMessages(agentId, messages);
    } catch (err) {
      error = { message: err.message };
    } finally {
      isAgentTyping = false;
      renderMessages();
    }
  }

  sendButton.onclick = sendMessage;
  textarea.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  renderMessages();
}