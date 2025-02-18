import express, { Request, Response } from 'express';
import { Routes } from './routes/routes';
import { config } from './config/config';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors())

const apiRoutes = new Routes().SetRoutes();
app.use('/api', apiRoutes);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
