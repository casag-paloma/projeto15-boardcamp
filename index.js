import express from 'express';
import cors from 'cors';
import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js'

const app =  express();

app.use(express.json());
app.use(cors());

app.use(categoriesRouter);
app.use(gamesRouter);

app.listen(4000, ()=> console.log('Server on'))