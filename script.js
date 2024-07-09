const express=require("express");
const mysql=require("mysql");

const port =8888;

const app=express();

app.get("/",(req,res)=>{
    res.status(200).send("<h1>a<h1>");
});

app.listen(port,(err) => {
    if(err){
        console.error("err",err.stack);
        throw err;
    }
    console.log();

});