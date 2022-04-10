/*jshint esversion: 8 */
const express = require("express");
const app = express();
const port = 3000;

//seteamos urlencoded para capturara datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//invocamosdotenv
const dotenv = require("dotenv");
dotenv.config({path:"./env/.env"});

//seteamos el directorio public
app.use(express.static("public"));
app.use("/resources",express.static(__dirname+"/public"));

//establecemos el motor de plantilla
app.set("view engine","ejs");

//invocamos bcryptjs
const bcryptjs = require("bcryptjs");

//variables de session
const session = require("express-session");
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

//invocamos conexion db
const connection = require("./Database/db.js");

//estableciendo las rutas
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/singup",(req,res)=>{
    res.render("register.ejs");
});

app.listen(port,(req,res)=>{
    console.log(`Server on port ${port}`);
});

//register
app.post("/register", async (req,res)=>{
    const username = req.body.txtusername;
    const rol = req.body.selectrol;
    const pass = req.body.txtpassword;
    let passhash = await bcryptjs.hash(pass,8);

    connection.query("INSERT INTO user SET ?;",{name_user:username,rol_user:rol,pass_user:passhash}, 
    async (error,results)=>{
        if (error) {
            console.log(error);
        } else {
            res.render("register.ejs",{
                alert:true,
                alertTitle:"Register",
                alertMessage: "Register Succesfull !!",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta:""
            });
        }
    });
}
);

//login autenticacion
app.post("/auth", async (req,res)=>{
    const user = req.body.txtusername;
    const pass = req.body.txtpassword;
    let passhash = await bcryptjs.hash(pass,8);
    if(user && pass){
        connection.query("SELECT * FROM user WHERE name_user = ?;",[user], async (error,results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass,results[0].pass_user))){
                res.render("login.ejs",{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "User or Password failed",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: "login"
                });
            }else{
                req.session.loggedin = true;
                req.session.name = results[0].name_user;
                res.render("login.ejs",{
                    alert: true,
                    alertTitle: "Login succesfull !!",
                    alertMessage: "welcome",
                    alertIcon: "success",
                    showConfirmButton:false,
                    timer: 1500,
                    ruta: ""
                });
            }
        });
    }else {
        res.render("login.ejs",{
            alert: true,
            alertTitle: "Warning",
            alertMessage: "fields empty",
            alertIcon: "warning",
            showConfirmButton:true,
            timer: false,
            ruta: "login"
        });
    }
});

//pages authentication
app.get("/",(req,res)=>{
    if (req.session.loggedin) {
        res.render("index.ejs",{
            login: true,
            name: req.session.name
        });
    } else {
        res.render("index.ejs",{
            login: false,
            name: "you must log"
        });
    }
});

//logout
app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    });
});
