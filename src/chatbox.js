// chatbox.js (v0.1.3)

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
    let renderedMessageIds = new Set(); // Track rendered messages

    // Create chatbox container (position unchanged)
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

    // Floating toggle button (updated UI)
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    toggleButton.style.cssText = `
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    `;
    toggleButton.onmouseover = () => {
      toggleButton.style.transform = 'scale(1.1)';
      toggleButton.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
    };
    toggleButton.onmouseout = () => {
      toggleButton.style.transform = 'scale(1)';
      toggleButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    };

    // Chat window (updated UI)
    const chatWindow = document.createElement('div');
    chatWindow.style.cssText = `
      display: none;
      width: 350px;
      height: 500px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      border: none;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    // Header (updated UI with close button)
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 16px 20px;
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      font-weight: 600;
      font-size: 16px;
      color: #1f2937;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    const headerTitle = document.createElement('span');
    headerTitle.textContent = `Chat with ${agent.name}`;
    const closeButton = document.createElement('button');
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18"></path>
        <path d="M6 6l12 12"></path>
      </svg>
    `;
    closeButton.style.cssText = `
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    header.appendChild(headerTitle);
    header.appendChild(closeButton);

    // Messages container (updated UI)
    const messagesContainer = document.createElement('div');
    messagesContainer.style.cssText = `
      flex-grow: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f9fafb;
    `;

    // Input area (updated UI)
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      padding: 12px 16px;
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      display: flex;
      gap: 8px;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    `;
    const textarea = document.createElement('textarea');
    textarea.placeholder = `Message ${agent.name}...`;
    textarea.style.cssText = `
      flex-grow: 1;
      resize: none;
      border: 1px solid #d1d5db;
      outline: none;
      min-height: 40px;
      max-height: 120px;
      font-family: inherit;
      font-size: 14px;
      border-radius: 8px;
      padding: 8px 12px;
      background: #f9fafb;
      transition: border-color 0.2s ease;
    `;
    textarea.onfocus = () => { textarea.style.borderColor = '#3b82f6'; };
    textarea.onblur = () => { textarea.style.borderColor = '#d1d5db'; };
    const sendButton = document.createElement('button');
    sendButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    `;
    sendButton.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    `;
    sendButton.onmouseover = () => { sendButton.style.background = '#2563eb'; };
    sendButton.onmouseout = () => { sendButton.style.background = '#3b82f6'; };

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

    // Toggle chat window (updated with animation and close button)
    function toggleChatWindow() {
      console.log('Toggle button clicked');
      if (chatWindow.style.display === 'none') {
        chatWindow.style.display = 'flex';
        setTimeout(() => {
          chatWindow.style.opacity = '1';
          chatWindow.style.transform = 'translateY(0)';
        }, 10);
      } else {
        chatWindow.style.opacity = '0';
        chatWindow.style.transform = 'translateY(20px)';
        setTimeout(() => { chatWindow.style.display = 'none'; }, 300);
      }
    }
    toggleButton.onclick = toggleChatWindow;
    closeButton.onclick = toggleChatWindow;

    // Render messages (updated to append messages instead of re-rendering)
    function renderMessages() {
      console.log('Rendering messages');

      // Handle error state
      if (error) {
        messagesContainer.innerHTML = ''; // Clear for error
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

      // Show empty state if no messages
      if (!messages.length && !isAgentTyping) {
        messagesContainer.innerHTML = ''; // Clear for empty state
        const emptyDiv = document.createElement('div');
        emptyDiv.style.cssText = 'text-align: center; color: #6b7280; margin-top: 40px; font-size: 14px; font-style: italic;';
        emptyDiv.textContent = `${agent.name} is ready to chat`;
        messagesContainer.appendChild(emptyDiv);
        return;
      }

      // Render only new messages
      messages.forEach((msg) => {
        if (renderedMessageIds.has(msg.id)) return; // Skip already rendered messages

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

        renderedMessageIds.add(msg.id); // Mark as rendered
      });

      // Handle typing indicator
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
        typingDiv.remove(); // Remove typing indicator if not typing
      }

      // Smooth scroll to bottom
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

  // Add CSS keyframes for typing dots animation
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .typing-dots span {
      animation: blink 1.4s infinite both;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink {
      0% { opacity: 0.2; }
      20% { opacity: 1; }
      100% { opacity: 0.2; }
    }
  `;
  document.head.appendChild(styleSheet);

  const { agentId, apiKey } = getScriptParams();
  initChatbox(agentId, apiKey);
});
