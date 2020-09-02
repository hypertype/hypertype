export class SharedStore {

  private offset = 0;

  constructor(public input = new SharedArrayBuffer(1024 * 1024 * 10),
              public output = new SharedArrayBuffer(1024 * 1024 * 10)) {
  }

  public Write(data: any, options?) {
    const string = JSON.stringify(data);
    if (this.offset * 2 + string.length * 2 > this.input.byteLength) {
      this.offset = 0;
    }

    const array = new Uint16Array(this.output, this.offset * 2, string.length);
    const length = string.length;
    const position = this.offset;
    this.offset += length;
    for (let i = 0; i < length; i++) {
      array[i] = string.charCodeAt(i);
    }

    if (options?.length > 0){
      const canvases = options.map(canvas => {
        const index = data.args.indexOf(canvas);
        return {index,canvas };
      });
      return {position, length, canvases};
    }
    return {position, length};
    // console.log('write', data, position, length, +new Date());
  }

  public Read({position, length, canvases}) {
    const array = new Uint16Array(this.input, position * 2, length);
    const string = [...array].map(c => String.fromCharCode(c)).join('');
    const data = JSON.parse(string);
    // console.log('read', data, position, length, +new Date());
    if (canvases){
      canvases.forEach(({index,canvas}) => {
        data.args[index] = canvas;
      })
    }
    return data;
  }
}
