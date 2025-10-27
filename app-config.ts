import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'InnoIgniterAI',
  pageTitle: 'InnoIgniterAI - AI-Powered Cybersecurity',
  pageDescription: 'A Cyber Security AI Chatbot',

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/logo_light.png',
  accent: '#002cf2',
  logoDark: '/logo_dark.png',
  accentDark: '#1fd5f9',
  startButtonText: 'Start Chatting',

  agentName: undefined,
};
