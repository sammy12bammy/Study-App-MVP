//configuring the env file
import dotenv from 'dotenv';
dotenv.config();  

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Backend running!');
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
