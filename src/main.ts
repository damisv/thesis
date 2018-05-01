import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { join } from 'path';
import { config } from './config/config';
import * as express from 'express';
import DbClient = require('./server/database/dbClient');
import * as apiRouter from './server/controller';

import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import {IOServer} from './server/socket';

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server/main.bundle');
const PORT = process.env.PORT || config.node.port || 8080;
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const CLIENT_DIR = join(process.cwd(), 'dist', 'client');

enableProdMode();

const app = express();
const server = createServer(app);
const io = socketIo(server, { serveClient: false});

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

app.set('view engine', 'html');
app.set('views', CLIENT_DIR);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api', apiRouter); // api routes

app.get('*.*', express.static(CLIENT_DIR));
app.get('*', (req, res) => {
  res.render(join(CLIENT_DIR, 'index.html'), { req, res });
});

server.listen(PORT, async () => {
  try {
    await DbClient.connect(); // Connecting DB
    console.log(`Application is running at http://localhost:${PORT}`);
  } catch (error) { console.log('Unable to connect to db'); }
});

const ioServer = new IOServer(io);
export { ioServer };
