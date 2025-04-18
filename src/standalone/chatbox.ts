import { h, render } from 'preact';
import { ChatboxWidget } from '../components/ChatboxWidget.js';
import { applyColorOverrides, getScriptParams } from '../core/utils.js';

import '../global.css';

console.log('Chatbox script loaded (Preact version)');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  const { agentId, token, colors, containerId, restApiHost } =
    getScriptParams();

  if (!agentId || !token) {
    console.error(
      'Fleek Chatbox: Missing agentId or token in script parameters. Cannot initialize.',
    );
    return;
  }

  let container: HTMLElement | null = null;
  let useFixedPosition = true;

  // If containerId is provided, try to find that element
  if (containerId) {
    container = document.getElementById(containerId);
    if (!container) {
      console.warn(
        `Fleek Chatbox: Container with ID "${containerId}" not found. Creating a new container.`,
      );
    } else {
      useFixedPosition = false;
    }
    if (container) {
      container.classList.add('fleek-chatbox');
    }
  }

  // If no containerId provided or element not found, create a new container
  if (!container) {
    container = document.createElement('div');
    container.id = 'fleek-chatbox-container';
    document.body.appendChild(container);
  }

  container.style = 'position: relative;';

  // Apply color overrides if provided
  if (colors && Object.keys(colors).length > 0) {
    applyColorOverrides(container, colors);
  }

  console.log(`Initializing ChatboxWidget with agentId: ${agentId}`);
  render(
    h(ChatboxWidget, {
      agentId,
      token,
      colors,
      useFixedPosition,
      restApiHost,
    }),
    container,
  );
});
