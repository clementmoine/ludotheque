import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import api from 'api';
import middlewares from 'middlewares';

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
