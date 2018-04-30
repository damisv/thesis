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

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server/main.bundle');
const PORT = process.env.PORT || config.node.port || 8080;
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const CLIENT_DIR = join(process.cwd(), 'dist', 'client');

enableProdMode();

const app = express();

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

app.use('/api', apiRouter); // api routes

app.get('*.*', express.static(CLIENT_DIR));
app.get('*', (req, res) => {
  res.render(join(CLIENT_DIR, 'index.html'), { req, res });
});

app.listen(PORT, async () => {
  try {
    await DbClient.connect(); // Connecting DB
    console.log(`Application is running at http://localhost:${PORT}`);
  } catch (error) { console.log('Unable to connect to db'); }
});
