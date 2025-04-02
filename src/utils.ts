import type { Message, ScriptParams } from './types.js';

export function getScriptParams(): ScriptParams {
  try {
    const script = (document.currentScript ||
      document.querySelector(
        'script[src*="chatbox.js"]',
      )) as HTMLScriptElement | null;
    if (!script) {
      console.error('No script tag found for chatbox.js');
      return { agentId: null, apiKey: null };
    }
    const url = new URL(script.src);
    const params: ScriptParams = {
      agentId: url.searchParams.get('agentId'),
      apiKey: url.searchParams.get('apiKey'),
    };

    // Parse color overrides if provided
    const colorsParam = url.searchParams.get('colors');
    if (colorsParam) {
      try {
        params.colors = JSON.parse(decodeURIComponent(colorsParam));
      } catch (e) {
        console.error('Error parsing colors parameter:', e);
      }
    }

    console.log('Script params:', params);
    return params;
  } catch (e) {
    console.error('Error parsing script params:', e);
    return { agentId: null, apiKey: null };
  }
}

export function loadMessages(agentId: string): Message[] {
  console.log('Loading messages for agentId:', agentId);
  const messages = localStorage.getItem(`chatbox-messages-${agentId}`);
  return messages ? JSON.parse(messages) : [];
}

export function saveMessages(agentId: string, messages: Message[]): void {
  console.log('Saving messages for agentId:', agentId);
  localStorage.setItem(`chatbox-messages-${agentId}`, JSON.stringify(messages));
}

/**
 * Apply color overrides to the container element
 */
export function applyColorOverrides(
  container: HTMLElement,
  colors: Record<string, string>,
): void {
  for (const [key, value] of Object.entries(colors)) {
    container.style.setProperty(`--${key}`, value);
    console.log(`Applied color override: --${key}: ${value}`);
  }
}
