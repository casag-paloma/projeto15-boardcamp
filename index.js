import express from 'express';
import cors from 'cors';
import pg from 'pg';


const app =  express();
const {Pool} = pg;

app.use(express.json())
app.use(cors())

const user = 'bootcamp_role';
const password = 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp';
const host = 'localhost';
const port = 5432;
const database = 'boardcamp';

const connection = new Pool({
    user,
    password,
    host,
    port,
    database
});


const query = connection.query('SELECT * FROM categories');

query.then(result => {
    console.log(result.rows);
});

app.get('/', (req, res)=> {
    console.log('oii');
    res.sendStatus(201);
})

app.listen(4000, ()=> console.log('Server on'))