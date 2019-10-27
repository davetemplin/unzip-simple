"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch_1 = __importDefault(require("minimatch"));
const yauzl = __importStar(require("yauzl"));
async function extractEntry(zipfile, entry) {
    return new Promise(resolve => zipfile.openReadStream(entry, (err, r) => {
        if (r) {
            const chunks = [];
            r.on('data', chunk => chunks.push(chunk));
            r.on('end', () => resolve(Buffer.concat(chunks)));
        }
        else if (err) {
            resolve(err);
        }
    }));
}
function extractAll({ zipfile, filter, extract, err, resolve, reject }) {
    const result = [];
    if (zipfile) {
        zipfile.readEntry();
        zipfile.on('entry', async (entry) => {
            const name = entry.fileName;
            if (!name.endsWith('/') && (!filter || minimatch_1.default(name, filter, { matchBase: true }))) {
                const buffer = extract ? await extractEntry(zipfile, entry) : undefined;
                if (!(buffer instanceof Error)) {
                    result.push({
                        name,
                        buffer,
                        compressed: entry.compressedSize,
                        uncompressed: entry.uncompressedSize
                    });
                    zipfile.readEntry();
                }
                else {
                    reject(buffer);
                }
            }
            else {
                zipfile.readEntry();
            }
        });
        zipfile.on('end', () => resolve(result));
    }
    else {
        reject(err);
    }
}
async function unzip(options) {
    return new Promise((resolve, reject) => {
        if (typeof options.input === 'string')
            yauzl.open(options.input, { lazyEntries: true }, (err, zipfile) => extractAll({ ...options, err, zipfile, resolve, reject }));
        else if (typeof options.input === 'number')
            yauzl.fromFd(options.input, { lazyEntries: true }, (err, zipfile) => extractAll({ ...options, err, zipfile, resolve, reject }));
        else if (options.input instanceof Buffer)
            yauzl.fromBuffer(options.input, { lazyEntries: true }, (err, zipfile) => extractAll({ ...options, err, zipfile, resolve, reject }));
        else
            reject(new Error('Invalid argument'));
    });
}
function default_1(options) {
    return unzip({
        extract: true,
        ...options instanceof Buffer || typeof options === 'string' || typeof options === 'number' ? { input: options } : options
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map