import * as path from 'path';
import {expect} from 'chai';
import unzip, {UnzipFile} from '..';

const zipfile = path.resolve(__dirname, 'example1.zip');

describe('dir', () => {
    let files = [] as UnzipFile[];
    before(async () =>
        files = await unzip({input: zipfile, extract: false}));

    it('is an array of length 4', () =>
        expect(files).to.be.an.instanceOf(Array).that.has.lengthOf(4));

    it('has expected file names', () =>
        expect(files.map(file => file.name)).to.have.members([
            'example1/foo.txt',
            'example1/foobar.txt',
            'example1/bar.log',
            'example1/baz/foobaz.txt'
        ]));

    it('has expected file sizes', () => 
        files.forEach(file => expect(file.compressed).to.be.a('number').that.is.lessThan(file.uncompressed)));

    it('has no buffers', () => 
        files.forEach(file => expect(file.buffer).to.be.undefined));
});