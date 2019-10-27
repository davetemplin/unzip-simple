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
describe('filter-multi', () => {
    let files = [];
    before(async () => files = await __1.default({ input: zipfile, filter: '*.txt' }));
    it('is an array of length 3', () => chai_1.expect(files).to.be.an.instanceOf(Array).that.has.lengthOf(3));
    it('has expected file names', () => chai_1.expect(files.map(file => file.name)).to.have.members([
        'example1/foo.txt',
        'example1/foobar.txt',
        'example1/baz/foobaz.txt'
    ]));
});
//# sourceMappingURL=filter-multi.js.map