import express from 'express';
const app = express();

app.use(express.static('./src/frontend'));

app.use((req, res) => {
  res.redirect('/');
});

export default app;
