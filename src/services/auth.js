const fs = require('fs');
var http = require('http');
var querystring = require('querystring');
const axios = require('axios');


class Auth { 
     async getUserInfo(mail, password) {

        var user = {
            token : '',
            id: '',
            leagueId : '',
            leagueName: '',
            leaguePlayers:{}
        }
        
        await axios.post('https://biwenger.as.com/api/v2/auth/login', {
            'email' : mail,
            'password': password,
          })
        .then((response) => {
              user.token = response.data.token;
             return axios.get('https://biwenger.as.com/api/v2/account', {
                headers: {
                    'Authorization': 'Bearer ' + user.token
                }
                });
            })
        .then((res) => {
            // If user is in more than one league get only the first
            var bool = false;
                res.data.data.leagues.forEach(league => {
                    if (!bool) {
                        user.leagueId = league.id;
                        user.leagueName = league.name;
                        user.id = league.user.id; 
                    } 
                    bool = true;
                     
                });
            })
        .catch((error) => {
                console.error(error)
            }
        );
        return user = await axios.get('https://biwenger.as.com/api/v2/league?include=all&fields=*,standings,tournaments,group,settings(description)', {
                headers: {
                    'Authorization': 'Bearer ' + user.token,
                    'X-League': user.leagueId,
                    'X-User': user.id
                }
                }).then((responseLeague) => {
                    if (Array.isArray(responseLeague.data.data)) {
                        
                        responseLeague.data.data.forEach(leagueInfo => {
                            leagueInfo.standings.forEach(player => {
                                user.leaguePlayers[player.id] = {'id': player.id, 'name' : player.name, salary: 50000000};
                            });
                        });
                    } else {
                        responseLeague.data.data.standings.forEach(player => {
                            user.leaguePlayers[player.id] = {'id': player.id, 'name' : player.name, salary: 50000000};
                        });
                    }
                    return user;
            });
    }
    

}


module.exports.Auth = Auth;