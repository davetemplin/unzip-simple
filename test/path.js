"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const chai_1 = require("chai");
const __1 = __importDefault(require(".."));
const zipfile = path.resolve(__dirname, 'example1.zip');
describe('path', () => {
    let files = [];
    before(async () => files = await __1.default(zipfile));
    it('is an array of length 4', () => chai_1.expect(files).to.be.an.instanceOf(Array).that.has.lengthOf(4));
    it('has expected file names', () => chai_1.expect(files.map(file => file.name)).to.have.members([
        'example1/foo.txt',
        'example1/foobar.txt',
        'example1/bar.log',
        'example1/baz/foobaz.txt'
    ]));
    it('has expected file sizes', () => files.forEach(file => chai_1.expect(file.compressed).to.be.a('number').that.is.lessThan(file.uncompressed)));
    it('has expected buffer sizes', () => files.forEach(file => chai_1.expect(file.buffer).to.be.an.instanceOf(Buffer).that.have.lengthOf(file.uncompressed)));
});
//# sourceMappingURL=path.js.map