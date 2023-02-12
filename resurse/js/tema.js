window.addEventListener("DOMContentLoaded",function(){
    vector_teme=["dark","tema1","tema2"];
    tema_curenta=localStorage.getItem("tema");
    if(tema_curenta=="dark")
    {
        document.body.classList.add(tema_curenta);
        document.getElementById("tema").innerHTML = '<i class="fa-solid fa-moon"></i>';  
    }
    if(tema_curenta=="tema1")
    {
        document.body.classList.add(tema_curenta);
        document.getElementById("tema").innerHTML = '<i class="fa-solid fa-tree"></i>';  
    }
    if(tema_curenta=="tema2")
    {
        document.body.classList.add(tema_curenta);
        document.getElementById("tema").innerHTML = '<i class="fa-solid fa-ghost"></i>';  
    }
    document.getElementById("tema").onclick=function(){
        tema_curenta=localStorage.getItem("tema");
        if(tema_curenta)
        {
            for(let i=0;i<=2;i++)
            {
                if(vector_teme[i]==tema_curenta)
                {
                    if(i==2)
                    {
                        document.body.classList.remove(tema_curenta);
                        localStorage.removeItem("tema");
                        document.getElementById("tema").innerHTML = '<i class="fa-regular fa-sun"></i>';
                    }
                    else
                    {
                        document.body.classList.remove(tema_curenta);
                        document.body.classList.add(vector_teme[i+1]);
                        localStorage.removeItem("tema");
                        localStorage.setItem("tema",vector_teme[i+1]);
                        if(i==0)
                            document.getElementById("tema").innerHTML = '<i class="fa-solid fa-tree"></i>';
                        else
                            document.getElementById("tema").innerHTML = '<i class="fa-solid fa-ghost"></i>';
                    }
                }
            }
        }
        else
        {
            document.body.classList.add(vector_teme[0]);
            localStorage.setItem("tema",vector_teme[0]);
            document.getElementById("tema").innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    };
});
/*
        if(document.body.classList.contains("dark")){
            document.body.classList.remove("dark");
        }
        else
        {
            document.body.classList.add("dark");
        }
*/