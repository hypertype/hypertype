module.exports = function nodeLoader() {
	
  return (`
	const p = require('path').join(__dirname,'${this.query.path || this.resourcePath}');
	try {global.process.dlopen(module, p); } catch(e) {` +
    `throw new Error('node-loader: Cannot open ' + p + ': ' + e);}`
  );
};
