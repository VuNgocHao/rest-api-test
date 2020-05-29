const util = require('util')
const mysql = require('mysql')
const md5 = require('md5');

const pool = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b406b4c927e28e',
    password: 'eaf6ae71',
    database: 'heroku_e57f098503ff54d'
    //ssl:true
});
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" 
module.exports = {
    getalluser: (req,res) => {
        let sql = 'SELECT * FROM users'
        pool.query(sql,(err,response) =>{
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req,res) =>{
        let sql = 'SELECT * FROM users WHERE id = ?'
        pool.query(sql,[req.params.userId],(err, response)=>{
            if (err) throw err
            res.json(response[0])
        })
    },
    update: (req,res) =>{
        let data = req.body;
        let userId = req.params.userId;
        let sql = 'UPDATE users SET ? WHERE id = ?'
        pool.query(sql,[data,userId],(err,response) =>{
            if (err) throw err
            res.json({message:'Update user info success!'})
        })
    },
    store: (req,res)=>{
        //let data = req.body;
        let username = req.body.username;
        let name = req.body.name;
        let password = md5(req.body.password);
        let sql = 'INSERT INTO users (username, name, password) VALUES (?,?,?)'
        var parameters = [username,name, password];
        sql = mysql.format(sql, parameters);
        pool.query(sql,(err,response)=>{
            if (err) throw err
            res.json({message:'Insert new user success!'})
        })
    },
    delete: (req,res) =>{
        let sql = 'DELETE FROM users WHERE id=?'
        pool.query(sql,[req.params.userId],(err,response)=>{
            if (err) throw err
            res.json ({message:'Delete user success!'})
        })
    },
        get: (req,res) => {
        var query="SELECT count(*) as TotalCount from users";
        var page = parseInt(req.query.page) || 0;
        
        pool.query(query, function(err, rows){
            if (err){
                return err;
            } else {
                let totalCount = rows[0].TotalCount;
                let limit = 5;
                let total_page = Math.ceil(totalCount/limit);
                let start = (page) * limit;
                var query = "SELECT * from users ORDER BY id DESC limit ?,?";
                var parameters = [start,limit];
                query = mysql.format(query, parameters);
                
                pool.query(query, function(err,rest){
                    if (err){
                        res.json(err);
                    } else {
                        var responsePayload = {
                            result: rest
                        };
                          if (page < total_page) {
                            responsePayload.pagination = {
                              current: page,
                              perPage: limit,
                              previous: page > 0 ? page - 1 : undefined,
                              next: page < total_page - 1 ? page + 1 : undefined,
                              totalPage: total_page
                            }
                          }
                          else responsePayload.pagination = {
                            err: 'queried page ' + page + ' is >= to maximum page number ' + total_page
                          }
                          res.json(responsePayload);
                    }
                })
            }
        })
    }
    
}