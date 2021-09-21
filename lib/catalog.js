/*
 Indexing and searching functions for the catalog
 */

 const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');
const fs = require('fs');
 const path = require('path')

 

 /* 
  Return all files in a directory, including subdirectories
  */
 function walk(directory){

    console.log( `.. ${directory}`)

    let contents = fs.readdirSync(directory);

    // Weed out internal / hidden files
    contents = contents.filter( entry => {
        return !entry.startsWith('.') && !entry.startsWith('_')
    })

    let directories = [];
    let files = [];

    contents.forEach( entry => {
        let fullPath = path.join(directory, entry)
        let isDir = fs.lstatSync(fullPath).isDirectory();
        if ( isDir )
            directories.push(fullPath)
        else
            files.push(fullPath)
    })

    directories.forEach(dir => {
        let contents = walk(dir);
        files = files.concat( contents.files );
    })

    return {files, directories};
 }

 module.exports = {walk}