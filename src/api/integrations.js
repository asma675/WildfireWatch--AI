import { apiClient } from './client';

// Compatibility exports for earlier code organization.
// Prefer calling apiClient.ai.invokeLLM directly.
export const InvokeLLM = apiClient.ai.invokeLLM;
