import express from 'express';
import cors from 'cors';
import categoriesRouter from './routes/categoriesRouter.js';

const app =  express();

app.use(express.json());
app.use(cors());

app.use(categoriesRouter);

app.listen(4000, ()=> console.log('Server on'))