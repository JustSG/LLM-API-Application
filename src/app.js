import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api/chat', chatRoutes);

export default app;