/* eslint-disable no-else-return */
/* eslint-disable no-restricted-syntax */
// NPM require
const express = require('express');
const logger = require('./utils/logger');
const getboard = require('./utils/getboard');
const calculator = require('./utils/calculator');
require('dotenv').config()
var http = require('http');

// Express declaration
const app = express();

const config = {
    port: process.env.PORT || 3001,
    initSalary: '',
    leageId: ''
  };

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

  /*
 * Serve static files
 */
app.use('/', express.static(`${process.cwd()}/public_rules/`));
//app.use('/output', express.static(`${process.cwd()}/output/`));

/*
 * Endpoint Definition
 */
app.get('/calculator/', async (req, res) => {
     // TO DO: Implement auth
    // credentials = auth(req.username, req.email);

    console.log(`process.env.MY_USERNAME: ${process.env.LEGUE}`);

    const board = new getboard.GetBoard();
    respuesta = board.getBoard().then((ret) => {
         const calc = new calculator.Calculator();
         calc.calculator().then( sal => {
            res.send(sal);
         });
      });
});

// Start app
app.listen(config.port, () => {
    logger.info(`Application running on port ${config.port}`);
  });