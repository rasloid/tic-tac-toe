const uuidv4 = require('uuid/v4');
const webpack = require('webpack');
const config = require('./webpack.config');
const app = require('express')();
const server = require('http').createServer(app);
let port = 80;

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

let compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


let counter = 1;
const hosts = ['http://192.168.1.5:3000','http://192.168.1.5:3001'];

app.get('/tic-tac-toe', (req, res) => {
    console.log('someone want to connect to tictactoe');
    let data = {
        host:hosts[counter%2],
        userId: uuidv4()
    };
    counter = counter == 1 ? 2 : 1;
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


