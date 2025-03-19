// chatbox.js (v0.1.2)

console.log('Chatbox script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  // Extract query params from script tag
  function getScriptParams() {
    try {
      const script = document.currentScript || document.querySelector('script[src*="chatbox.js"]');
      if (!script) {
        console.error('No script tag found for chatbox.js');
        return { agentId: null, apiKey: null };
      }
      const url = new URL(script.src);
      const params = {
        agentId: url.searchParams.get('agentId'),
        apiKey: url.searchParams.get('apiKey'),
      };
      console.log('Script params:', params);
      return params;
    } catch (e) {
      console.error('Error parsing script params:', e);
      return { agentId: null, apiKey: null };
    }
  }

  // Local storage helpers for messages
  function loadMessages(agentId) {
    console.log('Loading messages for agentId:', agentId);
    const messages = localStorage.getItem(`chatbox-messages-${agentId}`);
    return messages ? JSON.parse(messages) : [];
  }

  function saveMessages(agentId, messages) {
    console.log('Saving messages for agentId:', agentId);
    localStorage.setItem(`chatbox-messages-${agentId}`, JSON.stringify(messages));
  }

  // Main chatbox function
  function initChatbox(agentId, apiKey) {
    if (!agentId || !apiKey) {
      console.error('Missing agentId or apiKey in script parameters');
      return;
    }

    console.log('Initializing chatbox with agentId:', agentId);

    // Dummy agent data (replace with API call later)
    const agent = { name: "Test Agent", avatar: "https://picsum.photos/38" };
    const user = { name: "You", avatar: "https://picsum.photos/38" };

    // State
    let messages = loadMessages(agentId);
    let isAgentTyping = false;
    let error = null;

    // Create chatbox container
    const chatbox = document.createElement('div');
    chatbox.className = 'fleek-chatbox';
    chatbox.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-family: Arial, sans-serif;
      z-index: 10000;
    `;
    console.log('Chatbox element created');

    // Floating toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Chat';
    toggleButton.style.cssText = `
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    // Chat window
    const chatWindow = document.createElement('div');
    chatWindow.style.cssText = `
      display: none;
      width: 300px;
      height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      border: 1px solid #e5e7eb;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 13px 16px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      font-weight: 500;
      color: #1f2937;
    `;
    header.textContent = `Chat with ${agent.name}`;

    // Messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.style.cssText = `
      flex-grow: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: #f3f4f6;
    `;

    // Input area
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      border-top: 1px solid #e5e7eb;
      padding: 12px;
      display: flex;
      gap: 8px;
      background: #f9fafb;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    `;
    const textarea = document.createElement('textarea');
    textarea.placeholder = `Message ${agent.name}...`;
    textarea.style.cssText = `
      flex-grow: 1;
      resize: none;
      border: 1px solid #e5e7eb;
      outline: none;
      min-height: 40px;
      max-height: 200px;
      font-family: Arial, sans-serif;
      border-radius: 8px;
      padding: 8px;
      background: white;
    `;
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.cssText = `
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Assemble UI
    chatbox.appendChild(toggleButton);
    chatbox.appendChild(chatWindow);
    chatWindow.appendChild(header);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputContainer);
    inputContainer.appendChild(textarea);
    inputContainer.appendChild(sendButton);
    document.body.appendChild(chatbox);
    console.log('Chatbox appended to document.body');

    // Toggle chat window
    toggleButton.onclick = () => {
      console.log('Toggle button clicked');
      chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    };

    // Render messages
    function renderMessages() {
      console.log('Rendering messages');
      messagesContainer.innerHTML = '';
      if (error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'text-align: center; color: #6b7280; margin-top: 40px; display: flex; flex-direction: column; gap: 8px; align-items: center;';
        errorDiv.innerHTML = `<span>${error.message}</span><button style="background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Retry</button>`;
        errorDiv.querySelector('button').onclick = () => { error = null; renderMessages(); };
        messagesContainer.appendChild(errorDiv);
        return;
      }

      if (!messages.length) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.cssText = 'text-align: center; color: #6b7280; margin-top: 40px;';
        emptyDiv.textContent = `${agent.name} is ready to chat`;
        messagesContainer.appendChild(emptyDiv);
      }

      messages.forEach((msg) => {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'display: flex; gap: 12px;';
        const sender = msg.sender === 'agent' ? agent : user;
        const avatar = document.createElement('img');
        avatar.src = sender.avatar;
        avatar.style.cssText = 'width: 38px; height: 38px; border-radius: 50%;';
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'flex-grow: 1;';
        const nameDiv = document.createElement('div');
        nameDiv.textContent = sender.name;
        nameDiv.style.cssText = 'font-weight: 500; color: #1f2937;';
        const timestampDiv = document.createElement('div');
        timestampDiv.textContent = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timestampDiv.style.cssText = 'font-size: 10px; color: #6b7280; display: inline; margin-left: 8px;';
        const textDiv = document.createElement('div');
        textDiv.textContent = msg.content;
        textDiv.style.cssText = 'color: #374151;';
        contentDiv.appendChild(nameDiv);
        nameDiv.appendChild(timestampDiv);
        contentDiv.appendChild(textDiv);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
      });

      if (isAgentTyping) {
        const typingDiv = document.createElement('div');
        typingDiv.style.cssText = 'display: flex; gap: 12px;';
        const avatar = document.createElement('img');
        avatar.src = agent.avatar;
        avatar.style.cssText = 'width: 38px; height: 38px; border-radius: 50%;';
        const contentDiv = document.createElement('div');
        contentDiv.textContent = `${agent.name} is typing...`;
        contentDiv.style.cssText = 'color: #6b7280; font-style: italic;';
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(contentDiv);
        messagesContainer.appendChild(typingDiv);
      }

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
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

  const { agentId, apiKey } = getScriptParams();
  initChatbox(agentId, apiKey);
});
