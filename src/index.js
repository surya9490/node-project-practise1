const express = require('express');
const {open} = require("sqlite");
const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = (__dirname,'user.db');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { response } = require('express');
const app = express();
app.use(express.json());


let db = null ;

const initializeDbAndServer = async()=>{
    try{
        db = await open({filename:dbPath,driver:sqlite3.Database});
        app.listen(3000, ()=>{
            console.log('Server running at http://localhost:3000')
        })
    } catch(error){
        console.log(`error message : ${error.message}`)
        process.exit(1);
    }
}

initializeDbAndServer();

app.post('/create',async(request,response)=>{
    const {username,password}=request.body
    const hashedPassword = await bcrypt.hash(password,10);
    const userQuery = ` SELECT * FROM userData WHERE username = "${username}";`;
    const isUserExist = await db.get(userQuery)
    if(isUserExist !== undefined){
        response.send('user already exists');
    }else{
        const createNewUser = `
        INSERT INTO userData(username,password)VALUES("${username}","${hashedPassword}");`;
        const newUser = await db.run(createNewUser);
        response.send('User created sucessfully');
    }
});


app.post('/login',async(request,response)=>{
    const {username,password}=request.body;
    const userQuery =   `SELECT * FROM userData WHERE username = '${username}';`;
    const userResquest = await db.get(userQuery)
    if(userResquest === undefined){
        response.status(400);
        response.send('Invalid user')
    }else{
        const isPasswordMatched = await bcrypt.compare(password,userResquest.password);
        if(isPasswordMatched === true){
            const payload = {
                username:username,
            }
            const jwtToken = jwt.sign(payload,'secret_key');
            response.send({jwtToken})
        } else {
            response.status(400);
            respond.send("Invalid password")
        }
    }
})

