/* eslint-disable no-else-return */
/* eslint-disable no-restricted-syntax */
// NPM require
const express = require('express');
const logger = require('./utils/logger');
const getboard = require('./services/getboard');
const calculator = require('./services/calculator');
const auth = require('./services/auth');
require('dotenv').config()
var http = require('http');
const { Auth } = require('./services/auth');
const { exit } = require('process');
const { userInfo } = require('os');

// Express declaration
const app = express();

const config = {
    port: process.env.PORT || 3001,
    initSalary: '',
    leageId: ''
  };
  //const bodyParser = require('body-parser')
  //app.use(bodyParser.urlencoded({ extended: false }))
  //app.use(bodyParser.json());
  


// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

  //app.use(express.json());
  /*
 * Serve static files
 */
app.use('/', express.static(`${process.cwd()}/public/`));
//app.use('/output', express.static(`${process.cwd()}/output/`));
app.use(express.json()) 
app.use (express.urlencoded({extended: false}))
/*
 * Endpoint Definition
 */
app.post('/calculator/', (req, res) => {
    console.log(req.body);
    if (req.body.mail && req.body.password) {
        const authInstance = new auth.Auth();
        authInstance.getUserInfo(req.body.mail, req.body.password).then((userInfo) => {
            console.log(userInfo);
            const board = new getboard.GetBoard();
            respuesta = board.getBoard(userInfo).then((board) => {
            const calc = new calculator.Calculator();
            calc.calculator(userInfo, board).then( salaries => {
                res.send(salaries);
            });
        });
        }); 
    } else {
        res.send(
        {
            "508284": {
                "id": 508284,
                "name": "Blondies warriors",
                "salary": 8824
            },
        }
        );
    }
    
});

// Start app
app.listen(config.port, () => {
    logger.info(`Application running on port ${config.port}`);
  });