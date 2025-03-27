import { UIComponents } from './types.js';

export function initUI(
  agentId: string | null,
  apiKey: string | null
): UIComponents | Record<string, never> {
  if (!agentId || !apiKey) {
    console.error('Missing agentId or apiKey in script parameters');
    return {};
  }

  console.log('Initializing chatbox with agentId:', agentId);

  const agent = { name: 'Test Agent', avatar: 'https://picsum.photos/38' };
  const user = { name: 'You', avatar: 'https://picsum.photos/38' };

  const chatbox = document.createElement('div');
  chatbox.className = 'fleek-chatbox';
  chatbox.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-family: Arial, sans-serif;
    z-index: 10000;
  `;

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
  closeButton.setAttribute('aria-label', 'close');
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
  textarea.onfocus = () => {
    textarea.style.borderColor = '#3b82f6';
  };
  textarea.onblur = () => {
    textarea.style.borderColor = '#d1d5db';
  };
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
  sendButton.onmouseover = () => {
    sendButton.style.background = '#2563eb';
  };
  sendButton.onmouseout = () => {
    sendButton.style.background = '#3b82f6';
  };

  chatbox.appendChild(toggleButton);
  chatbox.appendChild(chatWindow);
  chatWindow.appendChild(header);
  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputContainer);
  inputContainer.appendChild(textarea);
  inputContainer.appendChild(sendButton);
  document.body.appendChild(chatbox);

  return {
    chatbox,
    toggleButton,
    chatWindow,
    messagesContainer,
    textarea,
    sendButton,
  };
}

export function toggleChatWindow(chatWindow: HTMLDivElement): void {
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
    setTimeout(() => {
      chatWindow.style.display = 'none';
    }, 300);
  }
}
