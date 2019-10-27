import * as path from 'path';
import {expect} from 'chai';
import unzip, {UnzipFile} from '..';

const zipfile = path.resolve(__dirname, 'example1.zip');

describe('filter-multi', () => {
    let files = [] as UnzipFile[];
    before(async () =>
        files = await unzip({input: zipfile, filter: '*.txt'}));

    it('is an array of length 3', () =>
        expect(files).to.be.an.instanceOf(Array).that.has.lengthOf(3));

    it('has expected file names', () =>
        expect(files.map(file => file.name)).to.have.members([
            'example1/foo.txt',
            'example1/foobar.txt',
            'example1/baz/foobaz.txt'
        ]));
});