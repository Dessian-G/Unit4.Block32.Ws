const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_flavors_db')

// app routes
app.use(express.json());
app.use(require('morgan')('dev'));
app.post('/api/flavors', async (req, res, next) => {});
app.get('/api/flavors', async (req, res, next) => {});
app.put('/api/flavors/:id', async (req, res, next) => {});
app.delete('/api/flavors/:id', async (req, res, next) => {});
app.get('/api/flavors', async (req, res, next) => {

    try{
        const SQL = `SELECT * from flavors ORDER BY created_at DESC;`
        const result = await client.query(SQL)
         res.send(result.rows)

    }catch(error) {
        next(error)

    } 
});
    



const init  = async() => {
    await client.connect();
    console.log('connect to database')
    let SQL  = `DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    favorite INTEGER DEFAULT 3 NOT NULL,
    name VARCHAR(255) NOT NULL
    );`
    await client.query( SQL)
    console.log('table created')
    SQL = `INSERT INTO flavors(name, favorite) VALUES('orange', 5);
    INSERT INTO flavors(name, favorite) VALUES('mango', 4);
    INSERT INTO favors(name,  favorite) VALUES('vanilla', 2);`;
    await client.query( SQL);
    console.log('data seeded')

    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`listening on port ${port}`))
    

    
}
init();