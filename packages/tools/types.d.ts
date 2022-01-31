export type TRunMode = 'development' | 'production' | 'test';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: TRunMode;
    }
  }
}
