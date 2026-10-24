declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    readonly NEXT_PUBLIC_READLY_API_URL: string;
    readonly NEXT_PUBLIC_TERMS_URL?: string;
    readonly NEXT_PUBLIC_PRIVACY_URL?: string;
    readonly NEXT_PUBLIC_CLIENT_URL: string;
    readonly NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY: string;
  }
}
