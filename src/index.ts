import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/config';
import Logging from './library/Logging';
import { router as v1 } from './routes/v1/index';
import HttpError from './utils/httpError';
import { Server } from 'socket.io';
import { socketTasks } from './socket';
import path from 'path';
import cors from 'cors';

mongoose.set('strictQuery', false);

const router = express();
router.use(cors());

const server = http.createServer(router);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socketTasks.forEach((task) => task(socket));
});

//CONNECTION TO MONGOOSE DATABASE
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info(`Running on ENV = ${process.env.NODE_ENV}`);
        Logging.info('Connected to mongoDB.');
        StartServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect.');
        Logging.error(error);
    });

//ONLY START THE SERVER IF MONGOOSE IS CONNECTS
const StartServer = async () => {
    Logging.info('Starting Socket Connection');

    router.use((req, res, next) => {
        Logging.info(
            `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
        );
        res.on('finish', () => {
            Logging.info(
                `Incoming -> Method: [${req.method}] - Url: [${req.url}] IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
            );
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    //RULES OF OUR APIS
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin,X-Requested-with,Content-Type,Accept,Authorization'
        );

        if (req.method == 'OPTIONS') {
            res.header(
                'Access-Control-Allow-Methods',
                'PUT,POST,PATCH,DELETE,GET'
            );
            return res.status(200).json({});
        }
        next();
    });

    //API ROUTES WITH VERSION
    router.use('/api', v1);

    //API HEALTHCHECK
    router.get('/health', (req, res, next) =>
        res.status(200).json({ message: 'ok' })
    );

    const frontendPath = path.join(__dirname, '../../frontend/dist');
    router.use(express.static(frontendPath));
    router.get('/', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
    //API ERROR HANDLING
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);
        return res.status(404).json({ success: false, message: error.message });
    });

    //HANDEL ALL ERROR THROW BY CONTROLLERS
    router.use(function (err: any, req: any, res: any, next: any) {
        Logging.error(err.stack);

        if (err instanceof HttpError) {
            return err.sendError(res);
        } else {
            return res.status(500).json({
                error: {
                    title: 'general_error',
                    detail: 'An error occurred, Please retry again later',
                    code: 500,
                },
            });
        }
    });

    //YOUR SERVER LISTEN
    server.listen(config.server.port, () =>
        Logging.info(`Server is running on port ${config.server.port}.`)
    );
};
