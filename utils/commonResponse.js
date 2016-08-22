/**
 * Created by chenpengxuan on 2016/8/18.
 */
/**
 * 通用返回对象
 */
var commonResponse = function () {
};
commonResponse.prototype.Time = {};
commonResponse.prototype.Success = {};
commonResponse.prototype.BCode = {};
commonResponse.prototype.Code = {};
commonResponse.prototype.Msg = {};
commonResponse.prototype.Data = {};
module.exports = commonResponse;
