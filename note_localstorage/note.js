
window.onload=initialisation
function initialisation(){
    textBox=document.getElementById("textBox")
    okBtn=document.getElementById("okBtn")
    textUl=document.getElementById("textUl")
    if(typeof(Storage)!="undefined"){
        if(localStorage.text){
            lsText=JSON.parse(localStorage.text)
        }else{
            lsText = []
        }
        for(var i=0; i<lsText.length;i++){
           showText(lsText[i])
        }
        okBtn.onclick=function() {
            showText(textBox.value)
            lsText.push(textBox.value)
            textBox.value=""
            localStorage.text=JSON.stringify(lsText)
        }
    }else{
        textUl.innerHTML="Sorry, your browser does not support web storage...";
    }
}


function showText(text){
    var newLi=document.createElement("li")
    var newDiv=document.createElement("div")
    newDiv.className="myDiv"
    var newContent=document.createTextNode(text)
    var newButton=document.createElement("input")
    newButton.type="button"
    newButton.value="✖"
    newButton.className="clearBtn"
    newButton.onclick=remove
    newDiv.appendChild(newContent)
    newLi.appendChild(newDiv)
    newLi.appendChild(newButton)
    textUl.appendChild(newLi)
    newDiv.addEventListener("click", modifyText)
}

function remove(e){
    //console.log(e.target)
    //console.log(e.target.value)
    //console.log(e.target.previousSibling.innerText)
    //lsText.splice(lsText.indexOf(e.target.previousSibling.innerText),1)
    //console.log(localStorage.text)
    e.target.parentNode.remove()
    lsText=[]
    myDivs=document.getElementsByClassName("myDiv")
    for(let key in myDivs){
        if(typeof(myDivs[key])=="object"){
            lsText.push(myDivs[key].innerText)
        }
    }
    localStorage.text=JSON.stringify(lsText)
}

function modifyText(e){
    e.preventDefault()
    var newTextarea=document.createElement("textarea")
    newTextarea.value=e.target.firstChild.data
    e.target.parentNode.prepend(newTextarea)
    newTextarea.focus()
    e.target.remove()
    newTextarea.addEventListener("blur", convertTextDiv)
}
function convertTextDiv(e){
    var newDiv=document.createElement("div")
    var newContent=document.createTextNode(e.target.value)
    newDiv.className="myDiv"
    newDiv.appendChild(newContent)
    e.target.parentNode.prepend(newDiv)
    e.target.remove()
    newDiv.addEventListener("mousedown", modifyText)
    lsText=[]
    myDivs=document.getElementsByClassName("myDiv")
    for(let key in myDivs){
        if(typeof(myDivs[key])=="object"){
            lsText.push(myDivs[key].innerText)
        }
    }
    localStorage.text=JSON.stringify(lsText)
}