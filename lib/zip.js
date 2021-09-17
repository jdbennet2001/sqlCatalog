/*
 CBZ utility functions
 */

const admZip = require('adm-zip');
const path    = require('path');
const _       = require('lodash');

let images = ['.jpg', '.jpeg', '.png']

/* 
 Return a list of all files inside an archive
 @param   {string} filename
 @return  {zipEntry[]}
 */
function zipContents(filename){

  let zip = new admZip(filename);
  let zip_entries = zip.getEntries();

  //Remove internal / directory entries
  zip_entries = zip_entries.filter(zip_entry => {
    let name = zip_entry.entryName.toLowerCase();
    if ( name.startsWith('___') || zip_entry.isDirectory){
      return false;
    }
    return true;
  })

  return zip_entries;
}

/*
 Return a list of all pages inside an archive (images only)
 @param {string} filename
 @return {zipEntry[]}
*/
function zipPages(filename){

  let zip_entries = zipContents(filename);

  zip_entries = zip_entries.filter( zip_entry => {
    let name = _.toLower(zip_entry.entryName);
    let extname = path.extname(name);
    return _.includes(images, extname);
  })

  // Lexical sort
  zip_entries.sort( (a, b) => {
    return a.entryName.localeCompare(b.entryName)
  })

  return zip_entries;      
}

/* 
 Return a list of all pages inside an archive
 @param {string} filename
 @return {string[]}
 */
function pages(filename){

  let zip_entries = zipPages(filename)
  let zip_pages = zip_entries.map(zip_entry =>{
    return zip_entry.name;
  })
  return zip_pages;

}

/*
 Return the first page in the archive
 */
function cover(filename){
  let zip_entries = zipPages(filename);
  let [zip_cover, ...contents] = zip_entries;
  return zip_cover.getData();
}

/* 
 Return page 'n' in an archive
 */
function page(filename, index){
  let zip_entries = zipPages(filename);
  let zip_entry = zip_entries[index]
  return zip_entry.getData();
}


module.exports = {pages, page, cover};
