const redis = require('redis-promisify');

class ServersManager{
    constructor(redisOpts){
        this.db = redis.createClient(redisOpts);
    }


    addServer(host){
        return this.db.saddAsync('servers', host);
    }

    removeServer(host){
        return this.db.sremAsync('servers',host)
    }

    getServers(){
        return this.db.smembersAsync('servers');
    }
}

module.exports = ServersManager;