const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
var app = express();
app.use(bodyparser.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',parameterLimit: 50000}));
app.use(cors());
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sign',
});
mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Connection Established Successfully');
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});
app.post('/signup',(req,res) => {
    try{
        if(req.body.username===undefined || req.body.email===undefined || req.body.password===undefined || req.body.number===undefined)
        {
            throw 'Invalid Fields';
        }
        else{
            let data = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                number: req.body.number,
            }
        
        let query='INSERT INTO login ( username , email , password , number ) VALUES ( "'+data.username+'" , "'+data.email+'" , "'+data.password+'" , "'+data.number+'")';
        mysqlConnection.query(query, (err,result) => {
            if(err){
                console.log(err);
                res.status(503).json({
                    message: err
                })
            }
            else{
                console.log('Signed Up');
                res.status(201).json({
                    message: 'Signed Up'
                })
            }
        })}
    }
    catch(e){
        console.log(e);
        res.status(400).json({
            message: e
        })
    }
})

app.post('/addtask',(req,res) => {
    try{
        if(req.body.email===undefined || req.body.task===undefined || req.body.description===undefined)
        {
            throw 'Invalid Fields';
        }
        else{
            let data={
                email: req.body.email,
                task: req.body.task,
                description: req.body.description
                //image: req.body.image,
            }
        
        let query='INSERT INTO todolist ( email , task , description ) VALUES ( "'+data.email+'" , "'+data.task+'" , "'+data.description+'")';
        mysqlConnection.query(query, (err,result) => {
            if(err){
                console.log(err);
                res.status(503).json({
                    message: err
                })
            }
            else{
                console.log('Added Task');
                res.status(201).json({
                    message: 'Added Task'
                })
            }
        })}
    }
    catch(e){
        console.log(e);
        res.status(400).json({
            message: e
        })
    }
})

app.post('/updatetask', (req,res) => {
    try{
        if(req.body.email === undefined || req.body.editTitle === undefined || req.body.editDescription===undefined || req.body.oldtask === undefined){
            throw 'Invalid Exception';
        }
        else{
            let query = 'UPDATE todolist SET task="'+req.body.editTitle+'",description="'+req.body.editDescription+'" WHERE task="'+req.body.oldtask+'"';
            mysqlConnection.query(query , (err , result) => {
                if(err){
                    console.log(err);
                    res.status(503).json({
                        message: err
                    });
                }
                else{
                    console.log('Data Updated');
                    res.status(201).json({
                        message: 'Data Updated'
                    })
                }
            })
        }
    }
    catch(e){
        res.status(400).json({
            message: e
        })
    }
});

app.post('/login' , (req,res) => {
    let query = 'SELECT * FROM login WHERE email="'+req.body.email+'" AND password="'+req.body.password+'"';
    mysqlConnection.query(query , (err,result) => {
        if(result[0] == null) {
            console.log(err);
             res.json({
                status: 400,
                success: false
            })
        }
        else{
            console.log(result[0]);
                res.json({
                status: 200,
                success: true,
                result: result[0]
            })
        }

        //  if(err) {
        //      console.log(err);
        //      // res.status(503).json({
        //      //     message: err
        //      // })
        //      res.json({
        //          status: 400,
        //          success: false
        //      })
        //  }
        //  else{
        //      console.log(result);
        //      // res.status(200).json({
        //      //     results: result
        //      // })
        //      res.json({
        //          status: 200,
        //          success: true
        //      })
        //  }
    })
});

app.post('/alltask' , (req,res) => {
    let query = 'SELECT task , description FROM todolist WHERE email="'+req.body.email+'"';
    mysqlConnection.query(query , (err,result) => {
        if(err) {
            console.log(err);
            res.json({
                status:503,
                success: false,
                message: err
            })
        }
        else{
            console.log(result);
            res.json({
                status: 200,
                success: true,
                results: result
            })
        }
    })
});

app.post('/deletetask',(req,res)=>{
    mysqlConnection.query('DELETE FROM todolist WHERE task = "'+req.body.task+'" AND email="'+req.body.email+'"', [req.params.id], (err, rows, fields) => {
        if (!err)
        res.send('Record deleted successfully.');
        else
        console.log(err);
        })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));

