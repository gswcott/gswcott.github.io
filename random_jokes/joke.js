window.onload=initialisation
function initialisation(){
    gridC=document.getElementById("gridC")
    joke=document.getElementById("joke")
    getCategories()
    //categories=["animal","career","celebrity","dev","explicit","fashion","food","history","money","movie","music","political","religion","science","sport","travel"]
}

function getCategories(){
    let r = new XMLHttpRequest()
    r.open("GET", "https://api.chucknorris.io/jokes/categories")
    r.onload = function(){
        var categories=JSON.parse(r.response)
        for(var i=0; i<categories.length;i++){
            createDiv(categories[i])
        }
        var animal=document.getElementById("animal")
        animal.focus()
        getFirstJoke()
    }
    r.send()
}
function createDiv(cat){
    var newBtn=document.createElement("input")
    newBtn.type="button"
    newBtn.id=cat
    newBtn.value=cat
    newBtn.onclick=getJoke
    gridC.appendChild(newBtn)
}

function getJoke(e){
    let r = new XMLHttpRequest()
    let site="https://api.chucknorris.io/jokes/random?category="+e.target.value
    r.open("GET", site)
    r.onload = function(){
        var obj=JSON.parse(r.response)
        joke.innerHTML='"'+obj.value.toUpperCase()+'"'
    }
    r.send()
}

function getFirstJoke(){
    let r = new XMLHttpRequest()
    r.open("GET", "https://api.chucknorris.io/jokes/random?category=animal")
    r.onload = function(){
        var obj=JSON.parse(r.response)
        joke.innerHTML='"'+obj.value.toUpperCase()+'"'
    }
    r.send()
}

