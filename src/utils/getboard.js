var http = require('http');
const fs = require('fs');

require('dotenv').config()

class GetBoard { 
    async getBoard() {
       

        var options = {
            host: 'biwenger.as.com',
            path:'/api/v2/' + `${process.env.LEGUE}` +'/board?type=transfer,market,roundFinished,exchange,loan,loanReturn,clauseIncrement&offset=0&limit=440',
            //This is the only line that is new. `headers` is an object with the headers to request
            headers: {
                'X-League': `${process.env.LEGUE}`, 
                'X-User': `${process.env.USERID}`, 
                'Authorization': `${process.env.USER_TOKEN}`, 
            }
          };
/*
          var options = {
              host: 'www.google.com',
              port: 80,
              method: 'GET',
          } */
          var data;
          const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
             // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', function () {
                var cleanData = data.slice(9);
                fs.writeFile("stats.json", cleanData, 'utf8', function (err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log("JSON file has been saved.");
                    return cleanData;
                });
              });
           
          })
          
          req.on('error', error => {
            console.error(error)
          })
          
          req.end()

          
    }

}


module.exports.GetBoard = GetBoard;