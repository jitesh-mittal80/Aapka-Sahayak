import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import env from './env.js';
import cors from 'cors';
dotenv.config()

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: env.CORS_ORIGIN
}));

app.use('api/auth', authRouters);
const server = http.createServer(app);

server.listen(env.PORT, () => {
    console.log(`http://localhost:${env.PORT}`);
});
