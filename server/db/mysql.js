const mysql = require('mysql')
const config = require('../config/dbConfig.js')

const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
})

const query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            connection.query(sql, values, (err, rows) => {
              if (err) {
                reject(err)
              } else {
                resolve(rows)
              }
              connection.release()
            })
          }
        })
      }
    })
  })
}

// 用户登录
const userLogin = function (loginName, password) {
  const sql = `SELECT * FROM blog_user WHERE name='${loginName}' AND password='${password}';`
  return query(sql)
}

// 获取全部文章
const getArticleByAll = function () {
  const sql = `SELECT * FROM blog_article`
  return query(sql)
}

module.exports = {userLogin, getArticleByAll}
