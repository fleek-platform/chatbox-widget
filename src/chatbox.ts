import { getScriptParams } from './utils.js';
import { initUI, toggleChatWindow } from './ui.js';
import { initMessageHandler } from './messageHandler.js';
import { addStyles } from './styles.js';
import { ApiClient, createDummyApiClient } from './api.js';
import { UIComponents } from './types.js';

console.log('Chatbox script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  addStyles();

  const { agentId, apiKey } = getScriptParams();

  const uiComponents: UIComponents | Record<string, never> = initUI(
    agentId,
    apiKey
  );
  if (Object.keys(uiComponents).length === 0) return;

  const { toggleButton, chatWindow, messagesContainer, textarea, sendButton } =
    uiComponents as UIComponents;

  toggleButton.onclick = () => toggleChatWindow(chatWindow);
  const closeButton = chatWindow.querySelector(
    'button[aria-label="close"]'
  ) as HTMLButtonElement;
  closeButton.onclick = () => toggleChatWindow(chatWindow);

  // Force dummy client for now since BE isn't ready
  const apiClient = createDummyApiClient();
  console.log('Using ApiClient:', apiClient); // Debug log

  if (agentId) {
    initMessageHandler(
      agentId,
      apiClient,
      messagesContainer,
      textarea,
      sendButton
    );
  } else {
    console.error('No agentId provided');
  }
});
