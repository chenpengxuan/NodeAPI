/**
 * Created by chenpengxuan on 2016/8/8.
 */
var productAdmin = require('../controllers/productadmin');

/**
 * 注册api路由
 */
module.exports = function (server) {
    server.get({path:'/api/LiveAdmin/GetLiveInfoList'},productAdmin.GetLiveInfoList);
    server.get({path:'/api/LiveAdmin/GetLiveDetailInfo'},productAdmin.GetLiveDetail);
    server.post({path:'/api/LiveAdmin/UpdateLiveInfo'},productAdmin.UpdateLiveInfo);
    server.get({path:'/api/LiveAdmin/GetMarketInfoList'},productAdmin.GetMarketInfoList);
    server.get({path: '/api/LiveAdmin/GetCountryGroup'}, productAdmin.GetCountryGroup);
    server.post({path: '/api/LiveAdmin/DelayLive'}, productAdmin.DelayLive);
}
