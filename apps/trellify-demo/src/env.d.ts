/// <reference types="vite/client" />

interface ImportMetaEnv
{
  readonly VITE_VAPI_ASSISTANT_ID: string;
  readonly VITE_VAPI_PUBLIC_API_KEY: string;
  readonly VITE_MAKE_WEBHOOK_URL?: string;
}

interface ImportMeta
{
  readonly env: ImportMetaEnv;
} 