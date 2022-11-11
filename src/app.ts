import express from 'express';
import passport from 'passport';
import indexRouter from './routes/index';
import cors from 'cors';

import './config/mongoose';
import './config/twilio';
import './config/passport';

const app = express();

const allowedOrigins = ['http://localhost:3000']
const options: cors.CorsOptions = {
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: allowedOrigins,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
    ]
};

app.use(cors(options));

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/', indexRouter);

export default app;