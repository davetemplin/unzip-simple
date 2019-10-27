import minimatch from 'minimatch';
import * as yauzl from 'yauzl';

export interface UnzipFile {
    name: string;
    buffer?: Buffer;
    compressed: number;
    uncompressed: number;
}

export interface UnzipOptions {
    input: string|Buffer|number;
    filter: string;
    extract: boolean;
}

interface ExtractOptions extends Partial<UnzipOptions> {
    err: Error|undefined;
    zipfile: yauzl.ZipFile|undefined;
    resolve: (files: UnzipFile[]) => void;
    reject: (err?: any) => void;
}

async function extractEntry(zipfile: yauzl.ZipFile, entry: yauzl.Entry) {
    return new Promise<Buffer|Error>(resolve =>
        zipfile.openReadStream(entry, (err, r) => {
            if (r) {
                const chunks = [] as Uint8Array[];
                r.on('data', chunk =>
                    chunks.push(chunk));
                r.on('end', () =>
                    resolve(Buffer.concat(chunks)));
            }
            else if (err) {
                resolve(err);
            }
        }));
}

function extractAll({zipfile, filter, extract, err, resolve, reject}: ExtractOptions) {
    const result = [] as UnzipFile[];
    if (zipfile) {
        zipfile.readEntry();
        zipfile.on('entry', async entry => {
            const name = entry.fileName as string;
            if (!name.endsWith('/') && (!filter || minimatch(name, filter, {matchBase: true}))) {
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
        zipfile.on('end', () =>
            resolve(result));
    }
    else {
        reject(err);
    }
}

async function unzip(options: Partial<UnzipOptions>) {
    return new Promise<UnzipFile[]>((resolve, reject) => {
        if (typeof options.input === 'string')
            yauzl.open(options.input, {lazyEntries: true}, (err, zipfile) =>
                extractAll({...options, err, zipfile, resolve, reject}));
        else if (typeof options.input === 'number')
            yauzl.fromFd(options.input, {lazyEntries: true}, (err, zipfile) =>
                extractAll({...options, err, zipfile, resolve, reject}));
        else if (options.input instanceof Buffer)
            yauzl.fromBuffer(options.input, {lazyEntries: true}, (err, zipfile) =>
                extractAll({...options, err, zipfile, resolve, reject}));
        else
            reject(new Error('Invalid argument'));
    });
}

export default function(options: Partial<UnzipOptions>|string|Buffer|number) {
    return unzip({
        extract: true,
        ...options instanceof Buffer || typeof options === 'string' || typeof options === 'number' ? {input: options} : options
    });
}