// Basic express app will serve client application until it is time to implement
// multiplayer (socket.io) functionality.
import app from './ExpressApp.js';
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
