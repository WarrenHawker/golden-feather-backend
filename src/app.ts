//import packages
import cors from 'cors';
import express from 'express';

//initialise express app
export const app = express();

//middleware
app.use(express.json());
app.use(cors());
