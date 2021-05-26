window.onload=initialisation
function initialisation(){
    quizDiv=document.getElementById("quiz")
    nbQSpan=document.getElementById("nbQ")
    questionDiv=document.getElementById("question")
    optionsDiv=document.getElementById("options")
    preBtn=document.getElementById("previous")
    nextBtn=document.getElementById("next")
    nbQuestions=10
    selectedQuestions=[]
    var i=1
    while (questions.length>=1 && i<=nbQuestions){
        var j=Math.floor(Math.random()*questions.length)
        var tmp=questions[j]
        selectedQuestions.push(tmp)
        questions.splice(questions.indexOf(tmp), 1)
        i++
    }
    console.log(selectedQuestions)
    correctAnswers=new Array(nbQuestions)
    lsOptions=new Array(nbQuestions)
    for(var i=0; i<nbQuestions; i++){
        correctAnswers[i]=selectedQuestions[i]["a"]
        lsOptions[i]=listChoices(i)
        var index=Math.floor(Math.random()*4)
        lsOptions[i].splice(index, 0, selectedQuestions[i]["a"])
    }
    console.log(correctAnswers)
    console.log(lsOptions)
    yourAnswers=new Array(nbQuestions)
    nb=1
    showQuestion()
    nextBtn.onclick=forward
    preBtn.onclick=backward
}


function listChoices(i){
    var choices=selectedQuestions[i]["b"]
    var selectedChoices=[]
    var time=1
    while (choices.length>=1 && time<=3){
        var j=Math.floor(Math.random()*choices.length)
        var tmp=choices[j]
        selectedChoices.push(tmp)
        choices.splice(choices.indexOf(tmp), 1)
        time++
    }
    return selectedChoices
}

function showQuestion(){
    nbQSpan.innerHTML="Q"+nb
    questionDiv.innerHTML=selectedQuestions[nb-1]["q"]
    optionsDiv.innerHTML=""
    let options=lsOptions[nb-1]
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
        showQuestion()
    }else{
        var nbGoodAnswer=0
        for(var i=0; i<nbQuestions; i++){
            if (correctAnswers[i]==yourAnswers[i]){
                nbGoodAnswer++
            }
        }
        quizDiv.innerHTML="Vous avez répondu aux " + selectedQuestions.length + " questions avec " + nbGoodAnswer + 
        " bonnes réponses. <br> Ici votre réponse:"+ yourAnswers + ";<br> et les réponses qu'il faut: " + correctAnswers + "."
    }
}
function backward(){
    nb=nb-1
    if(nb>=1 && nb<=nbQuestions){
        showQuestion()
    }

}

