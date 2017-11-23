const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const args = require('minimist')(process.argv);
const ServersManager = require('./RedisAPI/ServersManager');
let password = args['pass'] || 'secret';

let port = process.env.PORT || args['port'] || 3005;

const redisOpts = require('../../redis.config');

const servers = new ServersManager(redisOpts);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

servers.getServers()
    .then(servers=>{
        console.log('Available servers', servers);
        servers.forEach(server=>startPolling(server));
    })
    .catch(console.log);

app.post('/registrate-game-server', (req, res) => {

    if(req.body.pass !== password){
        console.log('wrong password');
        res.statusCode = 401;
        return res.end();
    }
    const host = req.body.host;
    registrateGameServer(host)
        .then(status => {
            if (!status) {
                res.statusCode = 401;
                return res.end();
            }
            res.statusCode = 202;
            res.write(JSON.stringify(redisOpts));
            res.end();
        })
        .catch(console.log);
});


server.listen(port, error => {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Service registry has been started. Listening on port %s.", port)
    }
});


function startPolling(host){
    let timer = setInterval(()=>{
        request
            .head(`http://${host}`)
            .on('error', err => {
                console.log('Error on game server', host,'\n',err);
                connectErrorHandler(timer,host).catch(console.log);
            })
    },3000)
}

async function registrateGameServer(host){
    let status = await servers.addServer(host);
    if(!status){
        return null;
    }
    const serversList = await servers.getServers();
    console.log('Available servers', serversList);
    startPolling(host);
    return true;
}


async function connectErrorHandler(timer,host){
    servers.removeServer(host).catch(console.log);
    clearInterval(timer);
    const serversList = await servers.getServers();
    console.log('Available servers', serversList);
}