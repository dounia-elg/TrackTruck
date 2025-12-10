import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('TrackTruck is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});