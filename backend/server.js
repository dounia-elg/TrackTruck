import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'


const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('TrackTruck is running');
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});