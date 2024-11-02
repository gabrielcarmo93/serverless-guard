import 'reflect-metadata';
import 'dotenv/config'

import serverless from 'serverless-http';
import express from 'express';
import { registerControllers } from './src/core/utils/route.utils';

const isDevelopment = process.env.NODE_ENV === "development"
const app = express();

app.use(express.json());
registerControllers(app, !isDevelopment);

export const api = serverless(app);