// const {gzip, ungzip} = require("pako");
// const jsondiffpatch = require('jsondiffpatch').create({});
//
// export class Serializer {
//     static serLastData = null;
//     static deserLastData = null;
//
//     static serialize(data: any) {
//         return data;
//         return JSON.stringify(data);
//         if (!this.serLastData) {
//             this.serLastData = data;
//             return JSON.stringify(data);
//         }
//         const diff = jsondiffpatch.diff(this.serLastData, data);
//         this.serLastData = data;
//         return JSON.stringify(diff);
//
//         // return gzip(JSON.stringify(data), {to: 'string'});
//     }
//
//     static deserialize(bytes: any) {
//         return bytes;
//         return JSON.parse(bytes);
//         if (!this.deserLastData) {
//             return this.deserLastData = JSON.parse(bytes);
//         }
//         if (bytes) {
//             jsondiffpatch.patch(this.deserLastData, JSON.parse(bytes));
//         }
//         console.log(this.deserLastData);
//         return this.deserLastData;
//         // const str = ungzip(bytes, { to: 'string' });
//         // return  JSON.parse(str);
//     }
// }
