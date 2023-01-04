window.addEventListener("load",function(){

    /*app.get(["/produs"],function(req,res){
        //console.log(req.params);
        client.query("select min(pret) from plante", function(err,rez){
            if(err)
            {
                console.log(err);
                renderError(res,2);
            }
            else
            {
                console.log(rez.rows);
                res.render("pagini/produs",{prod:rez.rows[0]});
            }
        });
    });*/
    
    /*client.query("select max(pret) from plante ", function(err,rez){
        if(err)
        {
            console.log(err);
            renderError(rez,2);
        }
        else
            rez.render("pagini/produse",{maxim:rez.rows[0]});
        });
    */        
    
    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`${this.value}`;
        var x = document.getElementById("inp-pret").min;
        document.getElementById("minim").innerHTML = x;
        var y = document.getElementById("inp-pret").max;
        document.getElementById("maxim").innerHTML = y;
    }
    document.getElementById("filtrare").onclick=function(){
        var inpNume=document.getElementById("inp-nume").value.toLowerCase().trim();
        //verirficare inputuri
        condValidare=true;
        condValidare = (condValidare && inpNume.match(new RegExp("^[a-zA-Z' ']*$")));
        if(!condValidare)
        {
            alert("inputuri gresite");
            return;
        }

        var inpCategorie=document.getElementById("inp-categorie").value;
        var inpPret = parseFloat(document.getElementById("inp-pret").value);
        var scunda = document.getElementById("i_rad1").checked;
        var medie = document.getElementById("i_rad2").checked;
        var inalta = document.getElementById("i_rad3").checked;
        
        var putin = document.getElementById("i_check1").checked;
        var moderat = document.getElementById("i_check2").checked;
        var mult = document.getElementById("i_check3").checked;

        var shadows = document.getElementById("i_datalist").value;

        var soluri = document.getElementById("i_sel_multiplu").options;

        var descrieri = document.getElementById("i_textarea").value.toLowerCase().trim();

        var produse=document.getElementsByClassName("produs");

        var k=0;
        for(let produs of produse)
        {
            var ok=true;
            produs.style.display="none";

            let nume=produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if(!(nume.includes(inpNume)))
            {
                ok=false;
            }

            let categorie=produs.getElementsByClassName("val-categorie")[0].innerHTML;
            if(!(inpCategorie=="toate" || categorie==inpCategorie))
            {
                ok=false;
            }

            let pret=produs.getElementsByClassName("val-pret")[0].innerHTML;
            if(!(pret >= inpPret))
            {
                ok=false
            }

            let inaltime=produs.getElementsByClassName("val-inaltime")[0].innerHTML;
            /*alert(scunda);
            alert(medie);
            alert(inalta);*/
            if(scunda)
            {
                if(!(inaltime<=50))
                {
                    ok=false;
                }
            }
            if(medie)
            {
                if(!(inaltime>50&&inaltime<=130))
                {
                    ok=false;
                }
            }
            if(inalta)
            {
                if(!(inaltime>130))
                {
                    ok=false;
                }
            }

            let udat=produs.getElementsByClassName("val-informatii")[0].innerHTML;
            if(!((putin&&udat.includes("putin"))||(moderat&&udat.includes("moderat"))||(mult&&udat.includes("mult"))))
            {
                ok=false;
            }

            let umbra=produs.getElementsByClassName("val-informatii")[0].innerHTML;
            if(umbra&&!umbra.includes(shadows))
            {
                ok=false;
            }
            let sol=produs.getElementsByClassName("val-informatii")[0].innerHTML;
            //alert(sol);
            //alert(soluri);
            okok=false;
            for(let opt of soluri)
            if(opt.selected&&sol.includes(opt.value))
            {
                okok=true;
            }
            if(okok==false)
                ok=false;
            
            let descriere=produs.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase().trim();

            if(!descriere.includes(descrieri))
            {
                ok=false;
            }
            
            if(ok)
            {
                k+=1;
                produs.style.display="block";
            }

        }
        if(k==0)
        {
            alert("nu exista produse conform fltrarii curente");
        }
    };
    document.getElementById("resetare").onclick=function(){
        var produse=document.getElementsByClassName("produs");
        for(let produs of produse)
        {
            produs.style.display="block";
        }
        //resetare filtre
        document.getElementById("inp-nume").value="";
        document.getElementById("sel-toate").selected=true;
    };
    function sorteaza(semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse=Array.from(produse);

        //var p=document.createElement("p");
        //p.innerHTML="hello world";
        //document.body.appendChild(document.getElementById("filtrare"));

        v_produse.sort(function(a,b){
            var pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b)
            {
                var nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*(nume_a.localeCompare(nume_b));
            }
            return semn*(pret_a-pret_b);
        });
        for(let produs of v_produse)
        {
            produs.parentNode.appendChild(produs);
        }
    };
    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1);
    }

    //cerinta
    function sorteaza_cerinta(semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse=Array.from(produse);

        //var p=document.createElement("p");
        //p.innerHTML="hello world";
        //document.body.appendChild(document.getElementById("filtrare"));

        v_produse.sort(function(a,b){
            var pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            var inaltime_a=parseFloat(a.getElementsByClassName("val-inaltime")[0].innerHTML);
            var inaltime_b=parseFloat(b.getElementsByClassName("val-inaltime")[0].innerHTML);
            if(inaltime_b*pret_a==inaltime_a*pret_b)
            {
                var categ_a=a.getElementsByClassName("val-categorie")[0].innerHTML;
                var categ_b=b.getElementsByClassName("val-categorie")[0].innerHTML;
                return semn*(categ_a.localeCompare(categ_b));
            }
            return semn*(inaltime_a/pret_a-inaltime_b/pret_b);
        });
        for(let produs of v_produse)
        {
            produs.parentNode.appendChild(produs);
        }
    };
    document.getElementById("sortCrescCerinta").onclick=function(){
        sorteaza_cerinta(1);
    }
    document.getElementById("sortDescrescCerinta").onclick=function(){
        sorteaza_cerinta(-1);
    }
    //cerinta

    window.onkeydown=function(e){
        if(e.altKey&&e.key=='c')
        {
            var produse=document.getElementsByClassName("produs");
            let suma=0;
            for(let prod of produse)
            {
                if(prod.style.display!="none")
                {
                    suma+=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                }
            }
            if(!document.getElementById("rezultat"))
            {
                rezultat=document.createElement("p");
                rezultat.id="rezultat";
                rezultat.innerHTML="<b>Pret total:</b> " + suma;
                //document.getElementById("produse").appendChild(rezultat);
                var ps=document.getElementById("p-suma");
                ps.parentNode.insertBefore(rezultat,ps.nextSibling);
                rezultat.style.border="1px solid orange";
                rezultat.onclick=function(){
                    this.remove();
                };

                setTimeout(function(){
                    document.getElementById("rezultat").remove();
                },2000);
            }

        }
    }

});