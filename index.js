const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_flavors_db')
const app = express()

app.use(express.json());
app.use(require('morgan')('dev'));

//app routes
app.post('/api/flavors', async (req, res, next) => {
    try{
        const SQL = `INSERT INTO flavors(name)
        VALUES ($1)
        RETURNING *`
        const result = await client.query(SQL, [req.body.name])
        res.send(result.rows[0])

    }catch(error){
        next(error)
    }
});
app.get('/api/flavors', async (req, res, next) => {
    try{
        const SQL = `SELECT * from flavors ORDER BY is_favorite ASC;`
        const result = await client.query(SQL)
        res.send(result.rows)

    }catch(error){
        next(error)
    }
});
app.put('/api/flavors/:id', async (req, res, next) => {
    try{
        const SQL = `UPDATE flavors
        SET name=$1, is_favorite=$2, updated_at=now()
        WHERE id=$3 RETURNING *`
        const result = await client.query(SQL, [req.body.name, req.body.ranking, req.params.id])
        res.send(result.rows[0])

    }catch(error){
        next(error)
    }
});
app.delete('/api/flavors/:id', async (req, res, next) => {
    try{
        const SQL = `DELETE FROM flavors
        WHERE id=$1`
        const result = await client.query(SQL, [req.params.id])
        res.sendStatus(204)

    }catch(error){
        next(error)
    }
});

const init = async () => {
    await client.connect();
    console.log('connected to database')
    let SQL = `DROP TABLE IF EXISTS flavors;
    CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    is_favorite INTEGER DEFAULT 3 NOT NULL,
    name VARCHAR(255) NOT NULL
    );`
    await client.query(SQL)
    console.log('tables created')
    SQL = ` INSERT INTO notes(name, is_favorite) VALUES('mango', 5);
    INSERT INTO flavors(name, is_fovorite) VALUES('vanilla', 4);
    INSERT INTO flavors(name, is_favorite) VALUES('stawberry', 2);`;
    await client.query(SQL);
    console.log('data seeded');

    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`listening on port ${port}`))
}

init()