//configuring the env file
import dotenv from 'dotenv';
dotenv.config();  

import express from 'express';
import cors from 'cors';
//backend API HERE!!!
import apiRoutes from './routes/studyset.js';

const app = express();
const PORT = 5001;

//will need to change this in deployment for cors to work
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Backend running!');
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
