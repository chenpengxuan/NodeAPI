/**
 * Created by chenpengxuan on 2016/8/15.
 */
var moment = require('moment');
var mongoose = require("mongoose");
var config = require('../config/config.json');
var ymtlog = require('ymt-node-watch');
var moment = require('moment');
//记录操作日志
function createOperationLog(req, res, result, targetRequest) {
    res.end();
    if (result.Data) {
        var conn = mongoose.createConnection(config.mongoInfo);
        var Schema = mongoose.Schema;
        var operationLogSchema = new Schema({
            Request: {type: String},
            Response: {type: String},
            TargetRequest: {type: String},
            Action: {type: String},
            UriPath: {type: String},
            AddTime: {type: Date, default: Date.now},
            UseTime: {type: String},
            OperatorInfo: {type: String}
        });
        var LogModel = conn.model('LiveOperationLog', operationLogSchema, 'LiveOperationLog');
        var operationLog = new LogModel({
            Request: JSON.stringify(req.method == 'POST' ? req.body : req.query),
            Response: JSON.stringify(result),
            TargetRequest: JSON.stringify(targetRequest),
            Action: req.url,
            UriPath: req.serverName + req.url,
            AddTime: moment(),
            UseTime: req.executeTime,
            OperatorInfo:JSON.stringify(req.operatorInfo)
        });
        operationLog.save(function (err, doc) {
            if (err) {
                ymtlog.logs.error({
                    title: '保存操作日志异常',	//错误标题
                    message: JSON.stringify(params) + ' err:' + String(err),	//错误内容
                    method: 'createOperationLog'	//错误方法
                });
            }
            if (doc) {
                console.log("database success");
            }
            conn.close();
        });
    }
}

exports.createOperationLog = createOperationLog;
