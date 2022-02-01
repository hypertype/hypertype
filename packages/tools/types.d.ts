export type TRunMode = 'development' | 'production' | 'test';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: TRunMode;
    }
  }
}

declare module "*.less" {
  const style: string;
  export default style;
}

declare module "*.css" {
  const style: string;
  export default style;
}

declare module "*.html" {
  const html: string;
  export default html;
}
