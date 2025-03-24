import { getScriptParams } from './utils.js';
import { initUI, toggleChatWindow } from './ui.js';
import { initMessageHandler } from './messageHandler.js';
import { addStyles } from './styles.js';

console.log('Chatbox script loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  // Initialize styles
  addStyles();

  // Get script parameters
  const { agentId, apiKey } = getScriptParams();

  // Initialize UI and message handling
  const { chatbox, toggleButton, chatWindow, messagesContainer, textarea, sendButton } = initUI(agentId, apiKey);
  if (!chatbox) return; // Exit if initialization failed

  // Set up toggle functionality
  toggleButton.onclick = () => toggleChatWindow(chatWindow);
  chatWindow.querySelector('button[aria-label="close"]').onclick = () => toggleChatWindow(chatWindow);

  // Initialize message handling
  initMessageHandler(agentId, messagesContainer, textarea, sendButton);
});