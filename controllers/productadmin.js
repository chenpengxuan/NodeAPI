/**
 * Created by chenpengxuan on 2016/8/8.
 */
var liveAdminProxy = require('../proxy/index');
var apiClient = require('ymt-node-apiclient');
var ymtlog = require('ymt-node-watch');
var commonResponse = require('../utils/commonResponse');
var moment = require('moment');
var loadash = require('lodash');
var config = require('../config/config.json');

/**
 * 获取直播信息列表
 * @param req
 * @param res
 * @constructor
 */
exports.GetLiveInfoList = function (req, res) {
    var params = {};
    var systemFailureResponse = new commonResponse();
    systemFailureResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    systemFailureResponse.BCode = 0;
    systemFailureResponse.Code = 500;
    systemFailureResponse.Msg = "获取直播列表信息发生错误,具体信息为：";
    systemFailureResponse.Success = false;
    var successResponse = new commonResponse();
    successResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    successResponse.Code = 200;
    successResponse.Msg = "获取直播列表信息成功";
    successResponse.Success = true;
    var requestInfo = req.query;
    params.BuyerName = requestInfo.BuyerName;
    params.CountryId = requestInfo.CountryId;
    params.StartTime = requestInfo.StartTime;
    params.EndTime = requestInfo.EndTime;
    params.ActivityState = requestInfo.ActivityState;
    params.PageSize = requestInfo.PageSize;
    params.PageIndex = requestInfo.PageIndex;
    apiClient(liveAdminProxy.productAdmin.getLiveInfoListRequest, params, function (err, result) {
        if (err || (result != null && result.Code != 200)) {
            systemFailureResponse.Msg += String(err || result.Msg);
            systemFailureResponse.Code = !err ? 500 :result.Code;
            res.send(systemFailureResponse);
            ymtlog.logs.error({
                title: '获取直播信息列表异常',	//错误标题
                message: JSON.stringify(params) + ' err:' + String(err),	//错误内容
                method: 'GetLiveInfoList'	//错误方法
            });
            res.emit('operationLog', req, res, systemFailureResponse, params);
            return;
        }
        if (result) {
            delete successResponse.Data;
            successResponse.BCode = result.BCode;
            successResponse.Code = result.Code;
            successResponse.Data = {};
            successResponse.Data.Total = result.Data.TotalRecords;
            successResponse.Data.Rows = loadash.map(result.Data.ActivityList, function (info) {
                return {
                    "Seller": info.Seller,
                    "ActivityId": info.ActivityId,
                    "Title": info.Title,
                    "SellerId": info.SellerId,
                    "StartTime": info.StartTime != null ? moment(info.StartTime).format('YYYY-MM-DD HH:mm:ss') : "",
                    "EndTime": info.EndTime != null ? moment(info.EndTime).format('YYYY-MM-DD HH:mm:ss') : "",
                    "TimeLength": (info.StartTime != null && info.EndTime != null) ? ("时长：" + parseInt((moment(info.EndTime) - moment(info.StartTime)) / (1e3 * 60 * 60)) + "小时" + parseInt(((moment(info.EndTime) - moment(info.StartTime)) % (1e3 * 60 * 60)) / (1e3 * 60)) + "分钟") : "",
                    "ActivityContent": info.ActivityContent,
                    "ActivityName": info.ActivityName || "",
                    "ActivityInfo": info.ActivityInfo || "",
                    "Position": info.Position || "",
                    "VideoUrl": info.VideoUrl || "",
                    "ActivityStatusText": info.ActivityStatusText || "",
                    "ActivityState": info.ActivityState
                };
            });
            res.success(successResponse);
            res.emit('operationLog', req, res, successResponse, params);
        }
    });
}

/**
 * 获取直播详情
 * @param req
 * @param res
 * @constructor
 */
exports.GetLiveDetail = function (req, res) {
    var params = {},deliveryListParams = {};
    var systemFailureResponse = new commonResponse();
    systemFailureResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    systemFailureResponse.BCode = 0;
    systemFailureResponse.Code = 500;
    systemFailureResponse.Msg = "获取直播详情发生错误,具体信息为：";
    systemFailureResponse.Success = false;
    var successResponse = new commonResponse();
    successResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    successResponse.Code = 200;
    successResponse.Msg = "获取直播详情成功";
    successResponse.Success = true;
    var requestInfo = req.query;
    params.ActivityId = requestInfo.ActivityId;
    params.UserId = requestInfo.SellerId;
    apiClient(liveAdminProxy.productAdmin.getLiveDetailRequest, params, function (err, result) {
        if (err || (result != null && result.Code != 200)) {
            systemFailureResponse.Msg += String(err || result.Msg);
            systemFailureResponse.Code = !err ? 500 :result.Code;
            res.send(systemFailureResponse);
            ymtlog.logs.error({
                title: '获取直播详情异常',	//错误标题
                message: JSON.stringify(params) + ' err:' + String(err),	//错误内容
                method: 'GetLiveDetail'	//错误方法
            });
            res.emit('operationLog', req, res, systemFailureResponse, params);
            return;
        }
        if (result) {
            deliveryListParams.SellerId = requestInfo.SellerId || result.Data.SellerId;
            apiClient(liveAdminProxy.productAdmin.getSellerDeliveryListRequest,deliveryListParams,function (error,deliveryListResult) {
                if (error || (result != null && result.Code != 200)) {
                    systemFailureResponse.Msg += String(error || result.Msg);
                    systemFailureResponse.Code = !error ? 500 :result.Code;
                    res.send(systemFailureResponse);
                    ymtlog.logs.error({
                        title: '获取买手可使用物流方式列表异常',	//错误标题
                        message: JSON.stringify(deliveryListParams) + ' err:' + String(error),	//错误内容
                        method: 'GetLiveDetail'	//错误方法
                    });
                    res.emit('operationLog', req, res, systemFailureResponse, params);
                    return;
                }
                if(deliveryListResult){
                    successResponse.Time = result.ServerTime;
                    successResponse.Msg = result.Msg;
                    successResponse.Code = result.Code;
                    result.Data.VideoAction = 0;//领域api中没有这个字段，这里添加是为了方便前端在保存时回传
                    successResponse.Data = {
                        SellerId: result.Data.SellerId,
                        Action: result.Data.Action,
                        ActivityId:requestInfo.ActivityId,
                        ActivityContent: result.Data.ActivityContent || "",
                        ActivityName: result.Data.ActivityName || "",
                        ActivityPicture: result.Data.ActivityPicture || "",
                        ActivityState: result.Data.ActivityState,
                        ActivityStatusText: result.Data.ActivityStatusText || "",
                        Seller: result.Data.Seller || "",
                        Flag: result.Data.Flag || "",
                        Country: result.Data.Country || "",
                        CountryId: result.Data.CountryId || "",
                        DelType:result.Data.DelType,
                        DelTypeList:(deliveryListResult.Data != null && deliveryListResult.Data.SellerDeliveryList!= null) ? loadash.map(deliveryListResult.Data.SellerDeliveryList,function (x) {
                            return {
                                DeliveryId:x.DeliveryId,
                                DeliveryName:x.DeliveryName
                            }
                        }):[],
                        SellerLogo: result.Data.SellerLogo || "",
                        ShopAddress: result.Data.ShopAddress || "",
                        StartTime: result.Data.StartTime != null ? moment(result.Data.StartTime).format('YYYY-MM-DD HH:mm:ss') : "",
                        EndTime: result.Data.EndTime != null ? moment(result.Data.EndTime).format('YYYY-MM-DD HH:mm:ss') : "",
                        AddTime: result.Data.AddTime != null ? moment(result.Data.AddTime).format('YYYY-MM-DD HH:mm:ss') : "",
                        Brands: result.Data.Brands || [],
                        CategoryList: result.Data.CategoryList || [],
                        Title: result.Data.Title || "",
                        VideoCover: result.Data.VideoCover || "",
                        VideoUrl: result.Data.VideoUrl || ""
                    };
                    res.success(successResponse);
                    res.emit('operationLog', req, res, successResponse, params);
                }
            });
        }
    });
}

/**
 * 修改直播详情
 * @param req 
 * @param res
 * @constructor
 */
exports.UpdateLiveInfo = function (req, res) {
    var params = {};
    params.Activity = {};
    var requestInfo = req.body;
    params.Activity.ActivityId = requestInfo.ActivityId;
    params.Activity.UserId = requestInfo.SellerId;
    params.Activity.SellerName = requestInfo.Seller;
    params.Activity.Position = requestInfo.ShopAddress;
    params.Activity.Brands = requestInfo.Brands;
    params.Activity.CountryId = requestInfo.CountryId;
    params.Activity.ActivityName = requestInfo.ActivityName;
    params.Activity.PicUrl = requestInfo.ActivityPicture;
    params.Activity.ActivityContent = requestInfo.ActivityContent;
    params.Activity.StartTime = requestInfo.StartTime;
    params.Activity.EndTime = requestInfo.EndTime;
    params.MarketId = requestInfo.MarketId;
    params.Activity.VideoAction = requestInfo.VideoAction;
    params.Activity.CategoryId = loadash.map(requestInfo.CategoryList, function (x) {
        return x.CategoryId;
    });
    params.Activity.IsReplay = requestInfo.IsReplay;
    params.Activity.OriginalActivityId = requestInfo.OriginalActivityId;
    params.Activity.DelType = requestInfo.DelType;
    params.Activity.Title = requestInfo.Title;
    params.Activity.VideoCover = requestInfo.VideoCover;
    params.Activity.VideoUrl = requestInfo.VideoUrl;
    var systemFailureResponse = new commonResponse();
    systemFailureResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    systemFailureResponse.BCode = 0;
    systemFailureResponse.Code = 500;
    systemFailureResponse.Msg = "修改直播详情发生错误,具体信息为：";
    systemFailureResponse.Success = false;
    var successResponse = new commonResponse();
    successResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    successResponse.Code = 200;
    successResponse.Msg = "修改直播详情成功";
    successResponse.Success = true;
    apiClient(liveAdminProxy.productAdmin.updateLiveInfoRequest, params, function (err, result) {
        if (err || (result != null && result.Code != 200)) {
            systemFailureResponse.Msg += String(err || result.Msg);
            systemFailureResponse.Code = !err ? 500 :result.Code;
            res.send(systemFailureResponse);
            ymtlog.logs.error({
                title: '修改直播详情异常',	//错误标题
                message: JSON.stringify(params) + ' err:' + String(err),	//错误内容
                method: 'UpdateLiveInfo'	//错误方法
            });
            res.emit('operationLog', req, res, systemFailureResponse, params);
            return;
        }
        if (result) {
            successResponse.Time = result.ServerTime;
            successResponse.Msg = result.Msg || "修改直播详情成功";
            successResponse.Code = result.Code;
            successResponse.Data = result.Data;
            res.success(successResponse);
            res.emit('operationLog', req, res, successResponse, params);
        }
    });
}

/**
 * 获取已有扫货地址列表
 * @param req
 * @param res
 * @constructor
 */
exports.GetMarketInfoList = function (req, res) {
    var params = {};
    var requestInfo = req.query;
    params.SellerId = requestInfo.SellerId;
    params.CountryId = requestInfo.CountryId;
    var systemFailureResponse = new commonResponse();
    systemFailureResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    systemFailureResponse.BCode = 0;
    systemFailureResponse.Code = 500;
    systemFailureResponse.Msg = "获取已有扫货地址列表发生错误,具体信息为：";
    systemFailureResponse.Success = false;
    var successResponse = new commonResponse();
    successResponse.Code = 200;
    successResponse.Msg = "获取已有扫货地址列表成功";
    successResponse.Success = true;
    apiClient(liveAdminProxy.productAdmin.getMarketListInfoRequest, params, function (err, result) {
        if (err || (result != null && result.Code != 200)) {
            systemFailureResponse.Msg += String(err || result.Msg);
            systemFailureResponse.Code = !err ? 500 :result.Code;
            res.send(systemFailureResponse);
            ymtlog.logs.error({
                title: '获取已有扫货地址列表异常',	//错误标题
                message: JSON.stringify(params) + ' err:' + String(err),	//错误内容
                method: 'GetMarketInfoList'	//错误方法
            });
            res.emit('operationLog', req, res, systemFailureResponse, params);
            return;
        }
        if (result) {
            successResponse.Time = result.ServerTime;
            successResponse.Msg = result.Msg;
            successResponse.Code = result.Code;
            successResponse.Data = result.Data != null ? loadash.map(result.Data.UserMarketList, function (x) {
                return {
                    MarketId: x.MarketId,
                    MarketName: x.MarketName,
                    MarketPic: x.MarketPic
                };
            }) : [];
            res.success(successResponse);
            res.emit('operationLog', req, res, successResponse, params);
        }
    });
}

/**
 * 获取国家分组
 * @param req
 * @param res
 * @constructor
 */
exports.GetCountryGroup = function (req, res) {
    var params = {};
    var successResponse = new commonResponse();
    successResponse.Success = true;
    var systemFailureResponse = new commonResponse();
    systemFailureResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    systemFailureResponse.BCode = 0;
    systemFailureResponse.Code = 500;
    systemFailureResponse.Data = {};
    systemFailureResponse.Msg = "获取国家分组发生错误,具体信息为：";
    systemFailureResponse.Success = false;
    apiClient(liveAdminProxy.productAdmin.getCountryGroupRequest, params, function (err, result) {
        if (err || (result != null && result.Code != 200)) {
            systemFailureResponse.Msg += String(err || result.Msg);
            systemFailureResponse.Code = !err ? 500 :result.Code;
            res.send(systemFailureResponse);
            ymtlog.logs.error({
                title: '获取国家分组信息异常',
                message: JSON.stringify(params) + 'err' + String(err),
                mehtod: 'GetCountryGroup'
            });
            res.emit('operationLog', req, res, systemFailureResponse, params);
            return;
        }
        if (result) {
            successResponse.Time = result.ServerTime;
            successResponse.Msg = result.Msg;
            successResponse.Code = result.Code;
            successResponse.Data = result.Data;
            res.success(successResponse);
            res.emit('operationLog', req, res, successResponse, params);
        }
    });
};

/**
 * 延迟直播
 * @param req
 * @param res
 * @constructor
 */
exports.DelayLive = function (req, res) {
    var params = {};
    var requestInfo = req.body;
    params.ActivityId = requestInfo.ActivityId;
    params.UserId = requestInfo.SellerId;
    params.DelayTime = requestInfo.DelayTime;
    var systemFailureResponse = new commonResponse();
    systemFailureResponse.Time = moment().format('YYYY-MM-DD HH:mm:ss');
    systemFailureResponse.BCode = 0;
    systemFailureResponse.Code = 500;
    systemFailureResponse.Msg = "延迟直播发生错误,具体信息为：";
    systemFailureResponse.Success = false;
    var successResponse = new commonResponse();
    successResponse.Success = true;
    apiClient(liveAdminProxy.productAdmin.delayLiveRequest, params, function (err, result) {
        if (err || (result != null && result.Code != 200)) {
            systemFailureResponse.Msg += String(err || result.Msg);
            systemFailureResponse.Code = !err ? 500 :result.Code;
            res.send(systemFailureResponse);
            ymtlog.logs.error({
                title: '延迟直播异常',
                message: JSON.stringify(params) + 'err' + String(err),
                mehtod: 'DelayLive'
            });
            res.emit('operationLog', req, res, systemFailureResponse, params);
            return;
        }
        if (result) {
            successResponse.Time = result.ServerTime;
            successResponse.Msg = result.Msg || "延迟直播成功";
            successResponse.Code = result.Code;
            successResponse.Data = result.Data;
            res.success(successResponse);
            res.emit('operationLog', req, res, successResponse, params);
        }
    });
};
