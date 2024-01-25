import app from './app.js';
import { init } from './socket.js'
import { initDB } from './db/mongodb.js'
import config from './config/config.js';

await initDB();

const PORT = config.port;

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} (${config.env}) 🚀`);
});

init(httpServer);


