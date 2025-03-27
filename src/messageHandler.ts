// src/messageHandler.ts
import { loadMessages, saveMessages } from './utils.js';
import { Agent, Message, User } from './types.js';
import { ApiClient } from './api.js';

export function initMessageHandler(
  agentId: string,
  apiClient: ApiClient,
  messagesContainer: HTMLDivElement,
  textarea: HTMLTextAreaElement,
  sendButton: HTMLButtonElement
): void {
  // Initialize with placeholder agent data; will be updated after fetch
  let agent: Agent = {
    name: 'Test Agent',
    avatar: 'https://picsum.photos/38',
    fleekAgentId: agentId,
  };
  const user: User = { name: 'You', avatar: 'https://picsum.photos/38' };

  let messages: Message[] = loadMessages(agentId);
  let isAgentTyping: boolean = false;
  let error: Error | null = null;
  const renderedMessageIds: Set<string> = new Set();

  // Fetch agent details on initialization
  apiClient
    .fetchAgentDetails(agentId)
    .then(agentData => {
      agent = {
        ...agent,
        name: agentData.name,
        avatar: agentData.avatar || agent.avatar,
        elizaAgentId: agentData.elizaAgentId,
      };
      renderMessages();
    })
    .catch(err => {
      error = err;
      renderMessages();
    });

  function renderMessages(): void {
    console.log('Rendering messages');

    if (error) {
      messagesContainer.innerHTML = '';
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText =
        'text-align: center; color: #6b7280; margin-top: 40px; display: flex; flex-direction: column; gap: 8px; align-items: center; font-size: 14px;';
      errorDiv.innerHTML = `
        <span>${error.message}</span>
        <button style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.2s ease;">Retry</button>
      `;
      const retryButton = errorDiv.querySelector('button') as HTMLButtonElement;
      retryButton.onmouseover = () => {
        retryButton.style.background = '#2563eb';
      };
      retryButton.onmouseout = () => {
        retryButton.style.background = '#3b82f6';
      };
      retryButton.onclick = () => {
        error = null;
        apiClient
          .fetchAgentDetails(agentId)
          .then(agentData => {
            agent = {
              ...agent,
              name: agentData.name,
              avatar: agentData.avatar || agent.avatar,
              elizaAgentId: agentData.elizaAgentId,
            };
            renderMessages();
          })
          .catch(err => {
            error = err;
            renderMessages();
          });
      };
      messagesContainer.appendChild(errorDiv);
      return;
    }

    if (!messages.length && !isAgentTyping) {
      messagesContainer.innerHTML = '';
      const emptyDiv = document.createElement('div');
      emptyDiv.style.cssText =
        'text-align: center; color: #6b7280; margin-top: 40px; font-size: 14px; font-style: italic;';
      emptyDiv.textContent = `${agent.name} is ready to chat`;
      messagesContainer.appendChild(emptyDiv);
      return;
    }

    messages.forEach((msg: Message) => {
      if (renderedMessageIds.has(msg.id)) return;

      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = `
        display: flex;
        gap: 12px;
        align-items: flex-start;
      `;
      const sender: Agent | User = msg.sender === 'agent' ? agent : user;
      const avatar = document.createElement('img');
      avatar.src = sender.avatar;
      avatar.style.cssText =
        'width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;';
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = 'flex-grow: 1;';
      const nameDiv = document.createElement('div');
      nameDiv.style.cssText = 'display: flex; align-items: center; gap: 8px;';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = sender.name;
      nameSpan.style.cssText =
        'font-weight: 600; font-size: 14px; color: #1f2937;';
      const timestampDiv = document.createElement('span');
      timestampDiv.textContent = new Date(msg.timestamp).toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      );
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

    const typingDiv = messagesContainer.querySelector(
      '.typing-indicator'
    ) as HTMLDivElement | null;
    if (isAgentTyping) {
      if (!typingDiv) {
        const newTypingDiv = document.createElement('div');
        newTypingDiv.className = 'typing-indicator';
        newTypingDiv.style.cssText =
          'display: flex; gap: 12px; align-items: center;';
        const avatar = document.createElement('img');
        avatar.src = agent.avatar;
        avatar.style.cssText =
          'width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;';
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText =
          'background: #e5e7eb; padding: 8px 12px; border-radius: 12px; border-bottom-left-radius: 4px;';
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
      behavior: 'smooth',
    });
  }

  async function sendMessage(): Promise<void> {
    const content = textarea.value.trim();
    if (!content || !agent.elizaAgentId) return; // Ensure we have an ElizaOS agent ID

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: Date.now(),
    };
    messages.push(newMessage);
    saveMessages(agentId, messages);
    textarea.value = '';
    renderMessages();

    try {
      isAgentTyping = true;
      renderMessages();
      // Simulate network delay (remove when using real BE)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const agentResponse = await apiClient.sendMessage(
        agentId,
        agent.elizaAgentId,
        content
      );
      const agentMessage: Message = {
        id: agentResponse.id,
        sender: 'agent',
        content: agentResponse.content,
        timestamp: agentResponse.timestamp,
      };
      messages.push(agentMessage);
      saveMessages(agentId, messages);
    } catch (err) {
      error = err as Error;
    } finally {
      isAgentTyping = false;
      renderMessages();
    }
  }

  sendButton.onclick = sendMessage;
  textarea.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Initial render
  renderMessages();
}
