import 'reflect-metadata';

import serverless from 'serverless-http';
import express from 'express';
import { registerControllers } from './src/core/utils/route.utils';

const app = express();

registerControllers(app, true);

app.use(express.json());

export const api = serverless(app);