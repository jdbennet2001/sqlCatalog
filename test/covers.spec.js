const path = require('path');
const fs = require('fs')

const {cover, pages} = require('../lib/zip');
const {refresh, save, get} = require('../lib/dataStore')
const {resize} = require('../lib/image')
const {Base64} = require('js-base64');

const archive = path.join(__dirname, './data/IM-007.cbz')


describe('Abstracted CBZ workflow routines', () => {

    it('can extract a cover', async () => {
        const page = await cover(archive);
        fs.writeFileSync('foo.jpg', page)
        expect(page).toBeDefined();
    });

    it('can count an archives pages', async () => {
        const files = await pages(archive);
        expect(files).toHaveLength(23)
    });

    it( 'can save a cover to db', async() => {

        // Get data to persist
        const page = await cover(archive);
        const contents = pages(archive)

        // Refresh table
        await refresh()

        // Save the cover
        await save( archive, contents.length, page)

        // Get it again
        const name = path.basename(archive)
        let rows = await get(name);

        try{

            const [row,] = rows;
            fs.writeFileSync( 'bar.jpg', row.cover)
        }
        catch(err){
            console.log( `Decode error: ${err}`)
        }
        expect(rows).toHaveLength(1);
    })

    it( 'can resize a cover', async () => {
        const page = await cover(archive);
        const thumbnail = await resize(page)
        fs.writeFileSync( 'th.jpg', thumbnail);
        expect(thumbnail).toBeDefined();
    })

 });