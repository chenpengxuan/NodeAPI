/**
 * Created by chenpengxuan on 2016/8/8.
 */
var config = require('../config/config');
/**
 * method表示用post还是get
 * path表示调用底层api的path
 * host表示调用站点url
 * headers表示请求头设置
 * @type {{checkAuthRequest: {method: string, path: string, host, headers: {Accept: string}}}}
 */
module.exports = {
    checkAuthRequest: {
        method: 'get',
        path: '/Permission/HasPermission',
        host: config.adminHost,
        headers: {
            "Accept": "application/json"
        }
    },
    getOperatorRequest:{
        method: 'get',
        path: '/UserManager/GetAllUserInfoByToken',
        host: config.adminHost,
        headers: {
            "Accept": "application/json"
        }
    },
    getLiveInfoListRequest: {
        method: 'get',
        path: 'api/Activity/SearchActivity',
        host: config.liveQueryApiHost,
        headers: {
            "Accept": "application/json"
        }
    },
    getLiveDetailRequest: {
        method: 'get',
        path: 'api/Activity/GetActivityInfo',
        host: config.liveManageApiHost,
        headers: {
            "Accept": "application/json"
        }
    },
    updateLiveInfoRequest: {
        timeout: 10000,
        method: 'post',
        path: 'api/activity/SaveActivity',
        host: config.liveManageApiHost,
        headers: {
            "Content-Type": "application/json"
        }
    },
    getMarketListInfoRequest: {
        method: 'get',
        path: 'api/activity/ListHistoryMarkets',
        host: config.liveManageApiHost,
        headers: {
            "Accept": "application/json"
        }
    },
    delayLiveRequest: {
        timeout: 10000,
        method: 'post',
        path: 'api/activity/DelayActivity',
        host: config.liveManageApiHost,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    },
    getCountryGroupRequest: {
        method: 'get',
        path: 'api/area/GetCountryGroup',
        host: config.liveManageApiHost,
        headers: {
            "Accept": "application/json"
        }
    },
    getSellerDeliveryListRequest: {
        method: 'get',
        path: 'api/Activity/GetSellerDelivery',
        host: config.liveManageApiHost,
        headers: {
            "Accept": "application/json"
        }
    }
}