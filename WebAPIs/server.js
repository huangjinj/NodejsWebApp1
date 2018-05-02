'use strict';
//var http = require('http');
var express = require('express');
var mysql = require('mysql'); 
var app = express();

var client;//db connection

function connect() {
    //create connection 
    client = mysql.createConnection({
        host: 'localhost',
        user: 'test_user',
        password: '123456',
        port: '3306'
    });
    client.connect(handleError);
    client.on('error', handleError);
}

app.get('/listUsers', function (req, res) {
    connect();
    var testdb = 'schema1';
    var testtable = 'schema1.user';
    client.query("use " + testdb);
    client.query(
        'SELECT * FROM ' + testtable,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if (results) {
                res.writeHead(200, { 'Content-type': 'text/plain' });
                res.write('Users:\n');

                for (var i = 0; i < results.length; i++) {
                    res.write(results[i].Name + '\n');
                }
                res.end();
            }
            //close the db connection
            client.end();
        }
    );
})

function handleError(err) {
    if (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        } else {
            console.error(err.stack || err);
        }
    }
}

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Access url is http://%s:%s", host, port)

})


