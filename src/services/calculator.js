const fs = require('fs');
const { isSetAccessor } = require('typescript');

class Calculator { 
    async calculator(user, board) {
       let rawdata = fs.readFileSync('stats.json');
       let dataObject = JSON.parse(rawdata);
       var initSalary = 50000000;
       var players = {
            508284: { name : "Blondie's warriors", salary:initSalary},
            5040992: { name :"Vodka Juniors", salary:initSalary},
            3809272: { name :"Uni Di Noi", salary:initSalary},
            5040904: { name :"Boqueron", salary:initSalary},
            5042178: { name :"Luti", salary:initSalary},
            3810930: { name :"Willow", salary:initSalary},
            3735851: { name :"Errekerre", salary:initSalary},
            5040913: { name :"Johan", salary:initSalary},
            5040964: { name :"Su Notissima", salary:initSalary},
        }
        var jugadas = [];
        dataObject.data.forEach(element => {
            if(element.type == 'market') {
                var tipus = 'resta';  
                if (!Array.isArray(element.content)) {
                } else {
                    element.content.forEach( (single, index) => {
                        var amount = single.amount;
                        if (single.to) {
                            var id = single.to.id;
                            
                        } else if (single.from){
                            var id = single.from.id;
                        }
                        jugadas.push({'id': id, 'amount':amount,'tipus':tipus });
                    })
                }
            } else if (element.type == 'transfer') {
          
                var tipus = 'suma';  
                if (!Array.isArray(element.content)) {
                    console.log(element);
                } else {
                    element.content.forEach( (single, index) => {
                        if (single.amount) {
                            var amount = single.amount;
                        } else {
                            var amount = 0;
                        }
                        if (single.from) {
                            var id = single.from.id;
                            jugadas.push({'id': id, 'amount':amount,'tipus':tipus });
                            if (single.to){
                                var toid = single.to.id;
                                jugadas.push({'id': toid, 'amount':amount,'tipus':'resta' });                     
                            }
                            
                        }
                        
                        
                    })
                }

            } else if (element.type == 'roundFinished') {
                var tipus = 'suma';
                element.content.results.forEach(result => {
                    if (result.bonus) {
                        var amount =  result.bonus;
                    } else {
                        var amount = 0;
                    }
                    var id = result.user.id;
                    jugadas.push({'id': id, 'amount':amount,'tipus':tipus });  
                })
            }
        });
       
        jugadas.forEach(jugada => {
            if (jugada.tipus == 'suma') {
                user.leaguePlayers[jugada.id].salary = user.leaguePlayers[jugada.id].salary + jugada.amount;
            }
            else if (jugada.tipus == 'resta') {
                user.leaguePlayers[jugada.id].salary = user.leaguePlayers[jugada.id].salary - jugada.amount
            }
        })
        console.log(user.leaguePlayers);
        return user.leaguePlayers;
    }

}


module.exports.Calculator = Calculator;