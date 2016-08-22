/**
 * Created by chenpengxuan on 2016/8/8.
 */
module.exports = function (server) {
    require('./productadmin')(server);
    require('ymt-node-warmup')(server);
}