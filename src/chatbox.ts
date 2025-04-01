import { render, h } from 'preact';
import { getScriptParams, applyColorOverrides } from './utils.js';
import { ChatboxWidget } from './components/ChatboxWidget.js';

import './global.css';

console.log('Chatbox script loaded (Preact version)');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  const { agentId, apiKey, colors } = getScriptParams();

  if (!agentId || !apiKey) {
    console.error(
      'Fleek Chatbox: Missing agentId or apiKey in script parameters. Cannot initialize.',
    );
    return;
  }

  const container = document.createElement('div');
  container.id = 'fleek-chatbox-container';
  document.body.appendChild(container);

  // Apply color overrides if provided
  if (colors && Object.keys(colors).length > 0) {
    applyColorOverrides(container, colors);
  }

  console.log(`Initializing ChatboxWidget with agentId: ${agentId}`);
  render(h(ChatboxWidget, { agentId, apiKey, colors }), container);
});
