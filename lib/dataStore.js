/*
 SQL data layer (initially backed by PostgreSQL)
 */
 const path = require('path')

 const { Client } = require('pg')
 

// Connect to local database by default
const client = new Client( { host:"localhost", database:"sqlCatalog", user:"postgres", password:"admin" } )

client.connect().then( () => {
    console.log( 'PostgreSQL connected');
}, err => {
    console.log( `PostgreSQL connection error. ${err}`)
    process.exit(-1)
})

/*
 Refresh the database for development / testing
 */
async function refresh(){
    
    await client.query('DROP TABLE IF EXISTS "comics"'); 
    
    const text = `
        CREATE TABLE IF NOT EXISTS "comics"
        (
            name text NOT NULL,
            pages integer NOT NULL,
            cover bytea
        );`;

    return  client.query(text)
}

/*
 Save a given comic in the database
 */
async function save(location, pages, cover){

    const base64data = cover.toString('base64');
    const name = path.basename(location);

    return  client.query(
        `INSERT INTO "comics" ("name", "pages", "cover")  
         VALUES ($1, $2, $3)`, [name, pages, base64data]);
}

module.exports = {refresh, save}
