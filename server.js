const express = require('express');
const args = require('minimist')(process.argv);
const app = express();
const server = require('http').createServer(app);
const expressStaticGzip = require('express-static-gzip');
let port = 80;
const LoadBalancer = require('./src/server/LoadBalancer');
const redisOpts = {
    host: args['redishost'] || 'localhost',
    port: args['redisport'] || 6379,
    password: args['redispass'] || 'lrm234kjhe32wjehr34wkjhr34hwer4h'
};
const loadBalancer = new LoadBalancer(redisOpts);


if(process.env.NODE_ENV === 'development'){
    const webpack = require('webpack');
    const config = require('./webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    let compiler = webpack(config);
    app.use(webpackHotMiddleware(compiler));
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
}else{
    app.use('/static', expressStaticGzip(__dirname + '/build',{
        customCompressions: [{
            encodingName: "gzip",
            fileExtension: "gz"
        }]
    }));
    app.use('/static',express.static(__dirname + '/build'));
}


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/tic-tac-toe', async function(req, res){
    const host = await loadBalancer.getServer();
    let data = {
        host: host
    };
    res.write(JSON.stringify(data));
    res.end();
});



server.listen(port, error => {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});

