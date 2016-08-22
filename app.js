/**
 * Created by chenpengxuan on 2016/8/8.
 */
var restify = require('restify');
var config = require('./config/config.json');
var middlewares = require('./middlewares');
var ymtlog = require('ymt-node-watch');
var Promise = require('bluebird');
var routes = require('./routes');
var server = restify.createServer({
    name: 'productadmin.ymatou.cn'
});

middlewares.middleWareProductAdmin.commonSetting(server);
middlewares.middleWareProductAdmin.checkAuthSuccess(server);
routes(server);

server.on('uncaughtException', function (req, res, route, err) {
    ymtlog.logs.logLocal(err.stack);
});

//移除其他模块的监听，防止进程意外终止
process.removeAllListeners('uncaughtException');
process.on('uncaughtException', function (err) {
    ymtlog.logs.logLocal(err.stack);
});
process.env.UV_THREADPOOL_SIZE = 128;