/*
 SQL data layer (initially backed by PostgreSQL)
 */
 const path = require('path')

 const { Client } = require('pg')
 

// Connect to local database by default
const client = new Client( { host:"localhost", database:"sqlCatalog", user:"postgres", password:"admin" } )

/*
 Test if the connection is good.
 */
async function test(){

    return client.connect().then( () => {
        console.log( 'PostgreSQL connected');
        return true;
    }, err => {
        console.log( `PostgreSQL connection error. ${err}`)
        return false;
    })

}

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
            cover text
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

/*
 Return information for a given comic
 */
async function get(location){
    const name = path.basename(location);
    const { rows } = await client.query(`SELECT * FROM "comics" where name = '${name}'`);
    return rows;
}

module.exports = {refresh, save, get, test}
