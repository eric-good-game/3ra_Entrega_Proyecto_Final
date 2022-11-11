import dotenv from 'dotenv';
dotenv.config();
import app from './src/app';
import minimist from 'minimist';
import logger from './src/config/logger';
import cluster from 'cluster';

const args = minimist(process.argv.slice(2));

if(args.clusterOn && cluster.isPrimary) {
    const numCPUs = require('os').cpus().length;
    logger.info(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        logger.info(`worker ${worker.process.pid} died`);
    });
}else{
    const PORT = args.port || 8080;
    const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
    server.on('error', (err)=>logger.error(`Server error: ${err}`));
}

