/*
 SQL data layer (initially backed by PostgreSQL)
 */
 const path = require('path')

 const { Client, Pool } = require('pg')
 const {Base64} = require('js-base64');


 const pool = new Pool({ host:"localhost", database:"sqlCatalog", user:"postgres", password:"admin" } )
 
 pool.connect().catch( err => {
    console.error( `.. DB connection error: ${err}`)
    process.exit(-1)
 }) 


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
        const client = await pool.connect();
        await client.query(drop)
        await client.query(create)
        client.release();
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

    const client = await pool.connect();
    await client.query(create);
    client.release();

}

/*
 Save a given comic in the database
 */
async function save(location, pages, cover){

    const base64data = Base64.encode(cover)
    const name = path.basename(location);

    const client = await pool.connect();
    
    console.log( `.. storing: ${name}, ${base64data.length} bytes`)
 
    try{

        await  client.query(
            `INSERT INTO "comics" ("name", "pages", "cover")  
            VALUES ($1, $2, $3)`, [name, pages, base64data]);
        client.release();
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
  
    const client = await pool.connect();
    
    let { rows } = await client.query(query, [name]);
    client.release();

    rows = rows.map( row => {
        return Object.assign( {}, row, {cover: Buffer(row.cover, 'base64')})
    })
    return rows;
}

module.exports = {refresh, init, save, get}
