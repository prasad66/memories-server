import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'


const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const PORT = process.env.PORT || 5000;

    
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected to MongoDB') })
    .then(() => { app.listen(PORT, () => { console.log(`Server started on port ${PORT}`) }) })
    .catch(err => { console.log('Could not connect to MongoDB', err) });