import app from './app.js';
import { init } from './socket.js'
import { initDB } from './db/mongodb.js'
import config from './config/config.js';
import cluster from 'cluster';
import { cpus } from 'os';

if(cluster.isPrimary) {
    const cpusNumber = cpus().length;
    console.log(`Proceso principal con PID: ${process.pid} y tengo ${cpusNumber} procesadores`);
    for (let i = 0; i < cpusNumber; i++){
        cluster.fork();
    };
    cluster.on('exit', (worker, code, signal) =>{
        console.log(`EL worker ${worker.process.pid} ha finalizado`, code, signal);
        if(String(signal) !== 'SIGTERM') {
            cluster.fork();
        }
    });
} else {
    await initDB();
    console.log(`Proceso worker con PID: ${process.pid}`);
    const PORT = config.port;
    const httpServer = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT} (${config.env}) 🚀`);
    });
    init(httpServer);
}


