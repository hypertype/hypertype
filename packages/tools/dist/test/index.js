"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = exports.test = exports.suite = exports.use = exports.should = exports.assert = exports.expect = void 0;
const chai_1 = require("chai");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return chai_1.expect; } });
Object.defineProperty(exports, "assert", { enumerable: true, get: function () { return chai_1.assert; } });
Object.defineProperty(exports, "should", { enumerable: true, get: function () { return chai_1.should; } });
Object.defineProperty(exports, "use", { enumerable: true, get: function () { return chai_1.use; } });
const jest_1 = require("@testdeck/jest");
Object.defineProperty(exports, "suite", { enumerable: true, get: function () { return jest_1.suite; } });
Object.defineProperty(exports, "test", { enumerable: true, get: function () { return jest_1.test; } });
Object.defineProperty(exports, "timeout", { enumerable: true, get: function () { return jest_1.timeout; } });
//# sourceMappingURL=index.js.map