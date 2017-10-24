const request = require('request');
const args = require('minimist')(process.argv);
const gameServer = require('./GameServer');

let password = args['pass'] || 'secret';
let serviceRegistry = args['sr'] || 'http://192.168.1.5:3005';
let registrationUrl = `${serviceRegistry}/registrate-game-server`;
let address = args['address'] || '192.168.1.5';
let port = args['port'] || 3000;

let body = JSON.stringify({
    pass: password,
    host: `${address}:${port}`
});

let options = {
    method: 'POST',
    url: registrationUrl,
    headers:{
      'Content-Type': 'application/json'
    },
    body: body

};

request(options,(err,response,body) => {
    if(err){
        return console.log(err);
    }else if(response.statusCode === 202) {
        console.log('Service registry response', response.statusCode);
        const redisOpts = JSON.parse(body);
        console.log('Starting game server', `${address}:${port}`);
        return gameServer(address ,port, redisOpts);
    }
    console.log('Service registry response', response.statusCode);
});
