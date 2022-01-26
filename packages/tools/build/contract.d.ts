export interface IOptions {

  bundler?: string; // type

  entryPoint: string; // index
  outputFilename?: string; // target
  outputPath?: string; // output

  template?: string; // html

  host?: string;
  port?: number;

  publicPath?: string; // https://webpack.js.org/configuration/output/#outputpublicpath

}
