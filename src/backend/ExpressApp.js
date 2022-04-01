import express from 'express';
const app = express();

app.use(express.static('./src/frontend'));

export default app;
