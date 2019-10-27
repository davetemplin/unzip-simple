import * as path from 'path';
import {expect} from 'chai';
import unzip, {UnzipFile} from '..';

const zipfile = path.resolve(__dirname, 'example1.zip');

describe('filter-negation', () => {
    let files = [] as UnzipFile[];
    before(async () =>
        files = await unzip({input: zipfile, filter: '!*.txt'}));

    it('is an array of length 1', () =>
        expect(files).to.be.an.instanceOf(Array).that.has.lengthOf(1));

    it('has expected file names', () =>
        expect(files.map(file => file.name)).to.have.members([
            'example1/bar.log'
        ]));
});