const md5 = require('md5')
const config = require('../../config/dbConfig')
const {userLogin} = require('../../db/mysql')

/**
 * body 返回值
 * @param code
 * @param msg
 * @param resData
 * @returns {{status: *, msg: *, data: *}}
 */
const resObj = (code, msg, resData) => {
  return {
    status: code,
    msg: msg,
    data: resData
  }
}

const login = async (ctx, next) => {
  const {loginName, password} = ctx.request.body
  if (!loginName || !password) {
    ctx.body = resObj(-1, '账号密码填写不完整')
    return
  }
  const loginNameReg = /^[a-z]\w{3,15}/
  if (!loginName.match(loginNameReg)) {
    ctx.body = resObj(-1, '账号格式不正确')
    return
  }
  try {
    await userLogin(loginName, password)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          // 设置 session
          const userName = res[0].nickname
          ctx.session.loginName = loginName
          ctx.session.userName = userName
          ctx.body = resObj(1, '登录成功', {userName, maxAge: config.maxAge})
          // md5 加密设置 response header
          ctx.set('x-auth-token', md5('gyjYYwc.1993'))
        } else {
          ctx.body = resObj(2, '账号或者密码有误')
        }
      })
      .catch((e) => {
        ctx.body = resObj(0, '发生错误', e.toString())
      })
  } catch (e) {
    ctx.body = resObj(0, '数据库错误', e.toString())
  }
}

module.exports = {login}