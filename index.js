const express = require("express");
const fs = require("fs");

const sharp = require("sharp");
const ejs=require("ejs");
const sass=require("sass");
const {Client}=require("pg");

var app = express();

app.set("view engine","ejs");

app.use("/resurse",express.static(__dirname+"/resurse"));


var vedeToataLumea="ceva!";
app.use("/*",function(req,res,next){
    res.locals.vede=vedeToataLumea;
    next();
});


app.get(["/","/index","/home"],function(req,res){
    res.render("pagini/index",{imagini:obGlobal.imagini});
    
});

//var cssBootstrap=sass.compile(__dirname+"resurse/scss/customizare-bootstrap.scss",{sourceMap:true});
//fs.writeFileSync(__dirname+"/resurse/scss/customizare-bootstrap.css",cssBootstrap.css);

var client = new Client({database:"laborator",
    user:"armand",
    password:"armand",
    host:"localhost",
    port:5432
});
client.connect();

client.query("select * from unnest(enum_range(null::categ_planta))", function(err,rez){
    if(err)
        console.log(err);
    else
        console.log(rez);
});

app.get(["/produse"],function(req,res){
    client.query("select * from unnest(enum_range(null::categ_planta))",function(err,rezCateg){
        continuareQuery="";
        if(req.query.tip)
            continuareQuery+=` and tip='${req.query.tip}'`; //"tip='"+req.query.tip+"'";
        client.query("select * from plante where 1=1 " + continuareQuery, function(err,rez){
            if(err)
            {
                console.log(err);
                renderError(res,2);
            }
            else
                res.render("pagini/produse",{produse:rez.rows, optiuni:rezCateg.rows});});
    })
});

app.get(["/produs/:id"],function(req,res){
    //console.log(req.params);
    client.query("select * from plante where id="+req.params.id, function(err,rez){
        if(err)
        {
            console.log(err);
            renderError(res,2);
        }
        else
            res.render("pagini/produs",{prod:rez.rows[0]});});
});

//app.get("/index",function(req,res){
//    res.render("pagini/index");
//    
//})

app.get("/despre",function(req,res){
    res.render("pagini/despre",{ip: req.ip});
    
});

obGlobal={
    erori:null,
    imagini:null
}

function createImages()
{
    var continutFisier = fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");
    var obiect = JSON.parse(continutFisier);
    var dim_mediu = 240;
    var dim_mic = 120;
    obGlobal.imagini = obiect.imagini;
    obGlobal.imagini.forEach(function(elem) {
        [numeFisier,extensie]=elem.fisier.split(".");
        if(!fs.existsSync(obiect.cale_galerie+"/mediu/")){
            fs.mkdirSync(obiect.cale_galerie+"/mediu/");
        }
        elem.fisier_mediu=obiect.cale_galerie+"/mediu/"+numeFisier+".webp";
        if(!fs.existsSync(obiect.cale_galerie+"/mic/")){
            fs.mkdirSync(obiect.cale_galerie+"/mic/");
        }
        elem.fisier_mic=obiect.cale_galerie+"/mic/"+numeFisier+".webp";
        elem.fisier = obiect.cale_galerie+"/"+elem.fisier;
        sharp(__dirname+"/"+elem.fisier).resize(dim_mediu).toFile(__dirname+"/"+elem.fisier_mediu);
        sharp(__dirname+"/"+elem.fisier).resize(dim_mic).toFile(__dirname+"/"+elem.fisier_mic);
    });
}
createImages();

function createErrors()
{
    var continutFisier = fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");
    obGlobal.erori=JSON.parse(continutFisier);
}
createErrors();

function renderError(res,identificator,titlu,text,imagine){
    var eroare = obGlobal.erori.info_erori.find(function(elem){
        return elem.identificator == identificator;
    })
    titlu = titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu;
    text = text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text;
    imagine = imagine || (eroare && obGlobal.erori.cale_baza+"/"+eroare.imagine) || obGlobal.erori.eroare_default.imagine;
    if(eroare && eroare.status){
        res.status(identificator).render("pagini/eroare",{titlu:titlu,text:text,imagine:imagine});
    }
    else
    {
        res.render("pagini/eroare",{titlu:titlu,text:text,imagine:imagine});
    }
}

//app.get("/home",function(req,res){
//    res.render("pagini/index");
//    
//})

app.get("/*.ejs",function(req,res){
    renderError(res,403);
});

app.get("/*",function(req,res){
    res.render("pagini"+req.url,function(err,rezRandare){
        if(err)
        {
            if(err.message.includes("Failed to lookup view"))
            {
                renderError(res,404,"Eroare 404");
            }
            else
            {
                    
            }
        }
        else
        {
            res.send(rezRandare);
        }
    });
    
});

app.listen(8080);
console.log("Serverul a pornit");
