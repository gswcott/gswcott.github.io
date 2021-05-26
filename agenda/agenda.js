window.onload=initialisation
function initialisation(){
    dateGrid=document.getElementById("dateGrid")
    preBtn=document.getElementById("preBtn")
    nextBtn=document.getElementById("nextBtn")
    textDiv=document.getElementById("textDiv")
    noteDiv=document.getElementById("note")
    lsMonths=["Janvier", "Février", "Mars","Avril","Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    date=new Date()
    year=date.getFullYear()
    month=date.getMonth()
    textDiv.innerHTML=lsMonths[month] + " "+ year
    if(localStorage.agenda){
        notes=JSON.parse(localStorage.agenda)
    }else{
         notes = {}
    }
    createGrid()
    preBtn.onclick=function(){
        if(month>0){
            month=month-1
        }else{
            month=11
            year=year-1
        }
        textDiv.innerHTML=lsMonths[month] + " "+ year
        createGrid()
    }
    nextBtn.onclick=function(){
        if(month<11){
            month=month+1
        }else{
            month=0
            year=year+1
        }
        textDiv.innerHTML=lsMonths[month] + " "+ year
        createGrid()
    }

    preBtnY.onclick=function(){
        year=year-1
        textDiv.innerHTML=lsMonths[month] + " "+ year
        createGrid()
    }
    nextBtnY.onclick=function(){
        year=year+1
        textDiv.innerHTML=lsMonths[month] + " "+ year
        createGrid()
    }

}

function createGrid(){
    dateGrid.innerHTML=""
    mCalendar=calendar()
    for(var i=0; i<mCalendar.length;i++){
        for(var j=0; j<7; j++){
            if(mCalendar[i][j]!=0){
                createDiv(mCalendar[i][j])
            }else{
                createNullDiv()
            }
        }
    }
}

function calendar(){
    var tmp=new Array(42).fill(0)
    var matrixCalendar=new Array(6)
    var fD=new Date(year, month, 1).getDay()
    if(fD==0){
        fD=6
    }else{
        fD=fD-1
    }
    var numDays=new Date(year, month+1, 0).getDate()
    for(var i=0; i<numDays;i++){
        tmp[i+fD]=i+1
    }  
    for(var i=0; i<6; i++){
        matrixCalendar[i]=new Array(7)
        for(var j=0; j<7; j++){
            matrixCalendar[i][j]=tmp[i*7+j]
        }
    }
    return matrixCalendar
}

function createDiv(day){
    var newDiv=document.createElement("div")
    var newContent=document.createTextNode(day)
    newDiv.id=year.toString()+month.toString()+day.toString()
    if(year==date.getFullYear() && month==date.getMonth() && day==date.getDate()){
        newDiv.className="myDiv today"
        selectedDiv=newDiv
    }else{
        newDiv.className="myDiv"
    }
    if (newDiv.id in notes) {
        newDiv.className="myDiv registered"
    }
    newDiv.onclick=function(){
        selectedDiv.classList.remove("selected")
        selectedDiv=newDiv
        if(newDiv.className=="myDiv registered"){
            showNote(notes[newDiv.id])
        }else{
            createTextArea()
        }
        newDiv.classList.add("selected")
    }
    newDiv.appendChild(newContent)
    dateGrid.appendChild(newDiv)
}

function createNullDiv(){
    var newDiv=document.createElement("div")
    newDiv.className="myDiv2"
    dateGrid.appendChild(newDiv)
}

function showNote(text){
    noteDiv.innerHTML=""
    var newContent=document.createTextNode(text)
    var newDiv=document.createElement("div")
    newDiv.className="myDiv"
    newDiv.appendChild(newContent)
    newDiv.addEventListener("mousedown", ModifyTextArea)
    noteDiv.appendChild(newDiv)
}
function createTextArea(){
    noteDiv.innerHTML=""
    var newTextArea=document.createElement("textarea")
    noteDiv.appendChild(newTextArea)
    newTextArea.focus()
    newTextArea.addEventListener("blur", convertTextDiv)
}


function convertTextDiv(e){
    if(e.target.value!=""){
        var newContent=document.createTextNode(e.target.value)
        var newDiv=document.createElement("div")
        newDiv.className="myDiv"
        newDiv.appendChild(newContent)
        newDiv.addEventListener("mousedown", ModifyTextArea)
        e.target.parentNode.prepend(newDiv)
        selectedDiv.className="myDiv registered"
        notes[selectedDiv.id]=e.target.value
        localStorage.agenda=JSON.stringify(notes)
    }else{
        selectedDiv.className="myDiv"
    }
    e.target.remove()
}


function ModifyTextArea(e){
    e.preventDefault()
    var newTextArea=document.createElement("textarea")
    newTextArea.value=e.target.firstChild.data
    /*e.target.parentNode.prepend(newTextArea)
    newTextArea.focus()
    e.target.remove()
    */
    newTextArea.addEventListener("blur", convertTextDiv)
    noteDiv.innerHTML=""
    noteDiv.appendChild(newTextArea)
    newTextArea.focus()
    notes[selectedDiv.id]=newTextArea.value
    localStorage.agenda=JSON.stringify(notes)
}

