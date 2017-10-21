const ServersManager = require('./RedisAPI/ServersManager');

class LoadBalancer{
    constructor(redisOpts){
        this.servers = new ServersManager(redisOpts);
        this.counter = 0;
    }

    async getServer(){
        try
        {
            const servers = await this.servers.getServers();
            if (!servers.length) {
                return null;
            }
            this.counter = (++this.counter) % servers.length;
            return servers[this.counter];
        }catch(e){
            console.log(e);
            return null;
        }
    }

}

module.exports = LoadBalancer;