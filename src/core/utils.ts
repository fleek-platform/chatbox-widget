import type { Environment, Message, ScriptParams } from './types.js';

export function getApiBaseUrl(env?: Environment): string {
  switch (env) {
    case 'dev':
      return 'https://api.dev.fleeksandbox.xyz';
    case 'staging':
      return 'https://api.staging.fleeksandbox.xyz';
    default:
      return 'https://api.fleek.xyz';
  }
}

export function getScriptParams(): ScriptParams {
  try {
    const script = (document.currentScript ||
      document.querySelector(
        'script[src*="chatbox.js"]',
      )) as HTMLScriptElement | null;
    if (!script) {
      console.error('No script tag found for chatbox.js');
      return { agentId: null, pat: null };
    }
    const url = new URL(script.src);
    const params: ScriptParams = {
      agentId: url.searchParams.get('agentId'),
      pat: url.searchParams.get('pat'),
      containerId: url.searchParams.get('containerId') || undefined,
      env: (url.searchParams.get('env') as Environment) || undefined,
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
    return { agentId: null, pat: null };
  }
}

export const saveRoomId = (roomId: string) => {
  console.log(`Setting roomId ${roomId}`);
  sessionStorage.setItem('chatbox-messages-roomId', roomId);
};

export const loadRoomId = () => {
  const roomId = sessionStorage.getItem('chatbox-messages-roomId');
  return roomId;
};

export const loadMessages = (agentId: string, roomId: string): Message[] => {
  console.log(`Loading messages for agentId ${agentId} and roomId ${roomId}`);
  const messages = sessionStorage.getItem(
    `chatbox-messages-${agentId}-${roomId}`,
  );
  return messages ? JSON.parse(messages) : [];
};

export const saveMessages = (
  agentId: string,
  roomId: string,
  messages: Message[],
): void => {
  console.log(`Saving messages for agentId ${agentId} and roomId ${roomId}`);
  sessionStorage.setItem(
    `chatbox-messages-${agentId}-${roomId}`,
    JSON.stringify(messages),
  );
};

export function applyColorOverrides(
  container: HTMLElement,
  colors: Record<string, string>,
): void {
  for (const [key, value] of Object.entries(colors)) {
    container.style.setProperty(`--${key}`, value);
    console.log(`Applied color override: --${key}: ${value}`);
  }
}

export const isValidUrl = (urlString: string) => {
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let url;
  try {
    url = new URL(urlString);
  } catch (e) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};
