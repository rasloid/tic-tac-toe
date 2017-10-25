const args = require('minimist')(process.argv);
let host = args['redishost']|| 'localhost';
let port = args['redisport'] || 6379;
let password = 'lrm234kjhe32wjehr34wkjhr34hwer4h';

if(process.env.REDIS_URL){
    host = 'ec2-34-206-56-226.compute-1.amazonaws.com';
    port = 62079;
    password = 'p458b8e17671cabd266e7e94044dca1ad8faf2c9335ce8bc2a32dbf20308d8a02';
}

module.exports = {
    host: host,
    port: port,
    password: password
};