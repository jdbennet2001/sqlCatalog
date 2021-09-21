const path = require('path')
const {walk} = require('../lib/catalog')


describe('Catalog', () => {

    it('can locate files.', async () => {
        const root = '/Volumes/Media/comics';
        const issue = 'Iron Man - Big Iron (2021) (Digital) (Shanhara).cbz';
        const archive = path.join(root, issue)
        const {files} = walk(root)
        expect(files).toContain(archive)
    });
})