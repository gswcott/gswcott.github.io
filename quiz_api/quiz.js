window.onload=initialisation
function initialisation(){
    quizDiv=document.getElementById("quiz")
    nbQSpan=document.getElementById("nbQ")
    questionDiv=document.getElementById("question")
    optionsDiv=document.getElementById("options")
    preBtn=document.getElementById("previous")
    nextBtn=document.getElementById("next")
    yourAnswers=[]
    correctAnswers=[]
    nb=1
    getQuestions()
}

function getQuestions(){
    r = new XMLHttpRequest()
    r.open("GET", "http://localhost:8080/randQuiz")
    r.onload = function(){
        obj=JSON.parse(r.response)
        nbQuestions=Object.keys(obj).length
        for(key in obj){
            correctAnswers.push(obj[key]["a"])
        }
        showQuestion("Q1")
        nextBtn.onclick=forward
        preBtn.onclick=backward
    }
    r.send()
}

function showQuestion(key){
    nbQSpan.innerHTML=key
    questionDiv.innerHTML=obj[key]["q"]
    optionsDiv.innerHTML=""
    let options=obj[key]["choice"]
    let newDiv1=document.createElement("Div")
    let newDiv2=document.createElement("Div")
    let newDiv3=document.createElement("Div")
    let newDiv4=document.createElement("Div")
    optionsDiv.appendChild(newDiv1)
    optionsDiv.appendChild(newDiv2)
    optionsDiv.appendChild(newDiv3)
    optionsDiv.appendChild(newDiv4)

    newDiv1.innerHTML=options[0]
    newDiv2.innerHTML=options[1]
    newDiv3.innerHTML=options[2]
    newDiv4.innerHTML=options[3]

    newDiv1.className="option"
    newDiv2.className="option"
    newDiv3.className="option"
    newDiv4.className="option"

    if (typeof yourAnswers[nb-1]!="undefined"){
        if (yourAnswers[nb-1]==options[0]){
            newDiv1.classList.toggle("yellow")
        }
        else if (yourAnswers[nb-1]==options[1]){
            newDiv2.classList.toggle("yellow")
        }
        else if (yourAnswers[nb-1]==options[2]){
            newDiv3.classList.toggle("yellow")
        }
        else {
            newDiv4.classList.toggle("yellow")
        }
    }

    newDiv1.addEventListener("mousedown",function(){
        yourAnswers[nb-1]=newDiv1.innerHTML
        newDiv1.classList.toggle("yellow")
        newDiv2.className="option"
        newDiv3.className="option"
        newDiv4.className="option"
    })
    newDiv2.addEventListener("mousedown",function(){
        yourAnswers[nb-1]=newDiv2.innerHTML
        newDiv2.classList.toggle("yellow")
        newDiv1.className="option"
        newDiv3.className="option"
        newDiv4.className="option"
    })
    newDiv3.addEventListener("mousedown",function(){
        yourAnswers[nb-1]=newDiv3.innerHTML
        newDiv3.classList.toggle("yellow")
        newDiv1.className="option"
        newDiv2.className="option"
        newDiv4.className="option"
    })
    newDiv4.addEventListener("mousedown",function(){
        yourAnswers[nb-1]=newDiv4.innerHTML
        newDiv4.classList.toggle("yellow")
        newDiv1.className="option"
        newDiv2.className="option"
        newDiv3.className="option"
    })
}


function forward(){
    nb++
    if(nb>=1 && nb<=nbQuestions){
        showQuestion("Q"+nb.toString())
    }else{
        var nbGoodAnswer=0
        for(var i=0; i<nbQuestions; i++){
            if (correctAnswers[i]==yourAnswers[i]){
                nbGoodAnswer++
            }
        }
        quizDiv.innerHTML="Vous avez répondu aux " + nbQuestions + " questions avec " + nbGoodAnswer + 
        " bonnes réponses. <br> Ici votre réponse:"+ yourAnswers + ";<br> et les réponses qu'il faut: " + correctAnswers + "."
    }
}

function backward(){
    nb=nb-1
    if(nb>=1 && nb<=nbQuestions){
        showQuestion("Q"+nb.toString())
    }

}
