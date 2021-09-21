/*
 SQL data layer (initially backed by PostgreSQL)
 */
 const path = require('path')

 const { Client, ClientBase } = require('pg')
 const {Base64} = require('js-base64');
 var SqlString = require('sqlstring');
 

// Connect to local database by default
const client = new Client( { host:"localhost", database:"sqlCatalog", user:"postgres", password:"admin" } )

client.connect();


// client.connect().then( () => {
//     console.log( 'PostgreSQL connected');
// }, err => {
//     console.log( `PostgreSQL connection error. ${err}`)
// })



/*
 Refresh the database for development / testing
 */
async function refresh(){
    
    const drop = 'DROP TABLE IF EXISTS "comics"';

    const create = `
        CREATE TABLE IF NOT EXISTS "comics"
        (
            name text NOT NULL,
            pages integer NOT NULL,
            cover text
        );`;

    try{
        
        await client.query(drop)
        await client.query(create)
        await client.end();
    }catch(err){
        console.error(`.. db init error ${err}`)
        process.exit(-1)
    }
    
}

/*
 Ensure all database tables exist and are good to go.
 */
async function init(){

    const create = `
        CREATE TABLE IF NOT EXISTS "comics"
        (
            name text NOT NULL,
            pages integer NOT NULL,
            cover text
        );`;

    return client.query(create)
}

/*
 Save a given comic in the database
 */
async function save(location, pages, cover){

    const base64data = Base64.encode(cover)
    const name = path.basename(location);

    const client = new Client( { host:"localhost", database:"sqlCatalog", user:"postgres", password:"admin" } )
    await client.connect();

    console.log( `.. storing: ${name}, ${base64data.length} bytes`)
 
    try{

        await  client.query(
            `INSERT INTO "comics" ("name", "pages", "cover")  
            VALUES ($1, $2, $3)`, [name, pages, base64data]);
        await client.end();
    }catch(err){
        console.log( `.. insertion error: ${err}`)
        process.exit(-2)
    }
}

/*
 Return information for a given comic
 */
async function get(name){

    const query = `SELECT * FROM "comics" where name = $1::text`
  
    const client = new Client( { host:"localhost", database:"sqlCatalog", user:"postgres", password:"admin" } )
    await client.connect();

    let { rows } = await client.query(query, [name]);
    await client.end();
    rows = rows.map( row => {
        row.cover = new Buffer(row.cover, 'base64')
        return row;
    })
    return rows;
}

module.exports = {refresh, init, save, get}
