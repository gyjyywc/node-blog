/**
 * 查询所有用户信息
 */
const mysql = require('../database/mysql')
const debug = require('debug')('blog-server:search-user')
const getIp = require('ipware')().get_ip

module.exports = async (ctx) => {
  const ipAddress = getIp(ctx.request).clientIp.split(':')[3]
  try {
    ctx.state.data = await mysql.searchUser(ipAddress)
  } catch (e) {
    ctx.state = {
      code: -1,
      data: {
        msg: '数据库连接错误, 查询用户失败'
      }
    }
    debug(`查询用户失败: ${e.toString()}`)
  }
}
