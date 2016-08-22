/**
 * Created by chenpengxuan on 2016/8/8.
 */

var config = require('../config/config.json');
var commonResponse = require('../utils/commonResponse');
var productAdminProxy = require('../proxy/index');
var watch = require('ymt-node-watch');
var appInfo = require('ymt-node-appinfo');
var apiClient = require('ymt-node-apiclient');
var result = require('ymt-node-result');
var sign = require('ymt-node-sign');
var loadash = require('lodash');
var restify = require('restify');
var cookieParser = require('restify-cookies');
var moment = require('moment');
var operationLog = require('./operationLog');
var urlUtil = require('url');
var ymtlog = require('ymt-node-watch');
/**
 *检查权限
 * @param server
 */
function checkAuthSuccess(server) {
    server.use(function (req, res, next) {
        var token = req.cookies['ManageToken'];
        var noAuthResponse = new commonResponse();
        noAuthResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
        noAuthResponse.BCode = 0;
        noAuthResponse.Code = 401;
        noAuthResponse.Msg = "当前用户没有登陆或没有权限";
        noAuthResponse.Success = true;
        noAuthResponse.Data = {"rediectUrl": config.adminHost};
        if (config.devMode) {
            return next();
        }
        if (token == undefined || token == '') {
            res.send(noAuthResponse);
        }
        else {
            var params = {};
            var pathName = urlUtil.parse(req.url).pathname;
            var controllerName = pathName.split('/')[2];
            var actionName = pathName.split('/')[3];
            params.token = token;
            params.controllerName = controllerName;
            params.actionName = actionName;
            params.currentRequestUrl = "";
            apiClient(productAdminProxy.productAdmin.checkAuthRequest, params, function (err, result) {
                if (err) {
                    noAuthResponse.Msg = '调用检查权限接口异常' + String(err);
                    res.send(noAuthResponse);
                    ymtlog.logs.error({
                        title: '调用检查权限接口异常',	//错误标题
                        message: JSON.stringify(params) + ' err:' + String(err),	//错误内容
                        method: 'checkAuthSuccess'	//错误方法
                    });
                    res.emit('operationLog', req, res, noAuthResponse, params);
                    return;
                }
                if (!result) {
                    res.send(noAuthResponse);
                    return;
                }
                else {
                    apiClient(productAdminProxy.productAdmin.getOperatorRequest, params, function (err, operatorInfoResult) {
                        if (err) {
                            noAuthResponse.Msg = '调用获取登陆用户信息接口：GetAllUserInfoByToken异常' + String(err);
                            res.send(noAuthResponse);
                            ymtlog.logs.error({
                                title: '调用获取登陆用户信息接口异常',	//错误标题
                                message: JSON.stringify(params) + ' err:' + String(err),	//错误内容
                                method: 'checkAuthSuccess'	//错误方法
                            });
                            return;
                        }
                        if (operatorInfoResult) {
                            // 保存原始处理函数:
                            var _send = res.send;
                            // 绑定自己的处理函数:
                            res.send = function () {
                                // 发送Header:
                                req.operatorInfo = operatorInfoResult;
                                // 调用原始处理函数:
                                return _send.apply(res, arguments);
                            };
                            next();
                        }
                    });
                }
            });
        }
    });
}

/**
 * 通用设置
 */
function commonSetting(server) {
    server.use(function (req, res, next) {
        res.on('operationLog', function (req, res,result,targetRequest) {
            operationLog.createOperationLog(req, res,result,targetRequest);
        });
        next();
    });
    server.use(function (req, res, next) {
        // 记录start time:
        var exec_start_at = Date.now();
        // 保存原始处理函数:
        var _send = res.send;
        // 绑定自己的处理函数:
        res.send = function () {
            // 发送Header:
            req.executeTime = String(Date.now() - exec_start_at);
            // 调用原始处理函数:
            return _send.apply(res, arguments);
        };
        next();
    });
    server.listen(config.port, function () {
        console.log('%s listening at %s', server.name, server.url);
    });
    server.use(cookieParser.parse);
    server.use(restify.CORS());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser({mapParams: false}));
    server.use(restify.queryParser({mapParams: false}));
    server.use(watch.setting(config.monitorConfig, config.alarmConfig, config.logConfig));
    server.use(function (req, res, next) {
        res.charSet('utf-8');
        // res.header("Access-Control-Allow-Credentials", config.AccessControlAllowCredentials);
        // res.header("Access-Control-Allow-Methods", 'PUT,POST,GET,DELETE,OPTIONS');
        // res.header("Access-Control-Allow-Headers", 'x-requested-with,content-type');
        // res.header("Access-Control-Allow-Origin", config.AccessControlAllowOrigin);
        next();
    });
    server.use(appInfo());
    server.use(result());
    if (config.sign) {
        server.use(sign(config.signSecret, config.signTimeRange));
    }
}

exports.checkAuthSuccess = checkAuthSuccess;
exports.commonSetting = commonSetting;

