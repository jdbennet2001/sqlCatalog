/*
 Command line code to index a catalog
 */

const path = require('path')

 const {cover, pages} = require('../lib/zip')
 const {init, refresh, save, get}  = require('../lib/dataStore')
 const {walk} = require('../lib/catalog') 
 const {resize} = require('../lib/image')

 async function index(root = '/Volumes/Media/comics'){


    let {files} = walk(root);

    let comics = files.filter( file => {
        return path.extname(file) == '.cbz'
    })

    // Refresh table
    await refresh()

    while( comics.length ){

        const archive = comics.pop();

 
        // Check if data already exists
        let rows = await get( path.basename(archive) );

        if (rows.length){
            console.log( `.. skipping ${archive}, data already in storage`)
            continue;
        }



        console.log( `.. indexing ${comics.length},  ${archive}`)

        // Get data to persist
        try{
            const page = await cover(archive);
            const contents = pages(archive)
            const thumbnail = await resize(page)

            await save( archive, contents.length, thumbnail)
        }catch(err){
            console.error( `.. error processing ${archive}, ${err}`)
        }
    }
 }

 index('/Volumes/Seagate Expansion Drive/comics').then(() => {
     console.log( '.. done')
 }, err => {
     console.log( `.. ${err}`)
 }).finally(()=>{
     process.exit(0)
 })