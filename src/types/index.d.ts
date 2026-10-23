declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    readonly NEXT_PUBLIC_READLY_API_URL: string;
    readonly NEXT_PUBLIC_TINYMCE_API_KEY: string;
    readonly NEXT_PUBLIC_JWT_SECRET_KEY: string;
    readonly NEXT_PUBLIC_CLIENT_URL: string;
    readonly NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY: string;
  }
}
