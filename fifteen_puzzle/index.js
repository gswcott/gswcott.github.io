
window.onload=initialisation
function initialisation(){
    gridNumber=document.getElementById("divGridNumber")
    shuffleBtn=document.getElementById("shuffleBtn")
    matrixNumber=new Array(4)
    matrixNumber[0]=["1", "2", "3", "4"]
    matrixNumber[1]=["5", "6", "7", "8"]
    matrixNumber[2]=["9", "10", "11", "12"]
    matrixNumber[3]=["13", "15", "14", ""]
    nbRow=matrixNumber.length
    nbCol=matrixNumber[1].length
    indexRow=3
    indexCol=3
    showGridNumber()
    shuffle();
    shuffleBtn.onclick = () =>{
        shffule();
    }
}

function shuffle(){
    nbTime = 70+Math.floor(Math.random()*20)
    for (var i=0; i<nbTime; i++){
        tmp=Math.random()
        if(tmp>=0 && tmp <0.25){
            leftStep()
        }
        else if(tmp>=0.25 && tmp <0.5){
            rightStep()
        }
        else if(tmp>=0.5 && tmp <0.75){
            upStep()
        }
        else {
            downStep()
        }
    }
    showGridNumber()
}

function showGridNumber(){
    var text="";
    for (var i=0; i<nbRow; i++) {
        for (var j=0; j<nbCol; j++) {
            if (i==indexRow && j==(indexCol-1)) {
                text=text+ "<div id='left' class='myDiv2'>"+ matrixNumber[i][j] +"</div>"
            }
            else if (i==indexRow && j==(indexCol+1)){
                text=text+ "<div id='right' class='myDiv2'>"+ matrixNumber[i][j] +"</div>"
            }
            else if (i==(indexRow-1) && j==indexCol){
                text=text+ "<div id='up' class='myDiv2'>"+ matrixNumber[i][j] +"</div>"
            }
            else if (i==(indexRow+1) && j==indexCol){
                text=text+ "<div id='down' class='myDiv2'>"+ matrixNumber[i][j] +"</div>"
            }
            else if (i==indexRow && j==indexCol){
                text=text+ "<div class='hole'></div>"
            }
            else {
                text=text+ "<div class='myDiv'>"+matrixNumber[i][j]+"</div>"
            }
            
        }
    }
    gridNumber.innerHTML=text
    leftDiv=document.getElementById("left")
    rightDiv=document.getElementById("right")
    upDiv=document.getElementById("up")
    downDiv=document.getElementById("down")
    if (leftDiv!=null){
        leftDiv.onclick=function(){rightStep(); showGridNumber();}
    }
    if (rightDiv!=null){
        rightDiv.onclick=function(){leftStep(); showGridNumber();}
    }
    if (upDiv!=null){
        upDiv.onclick=function(){downStep(); showGridNumber();}
    }
    if (downDiv!=null){
        downDiv.onclick=function(){upStep(); showGridNumber();}
    }
  }

function rightStep(){
    if(indexCol>0){
        matrixNumber[indexRow][indexCol]=matrixNumber[indexRow][indexCol-1]
        matrixNumber[indexRow][indexCol-1]=""
        indexCol=indexCol-1
    }
}
function leftStep(){
    if(indexCol<(nbCol-1)){
        matrixNumber[indexRow][indexCol]=matrixNumber[indexRow][indexCol+1]
        matrixNumber[indexRow][indexCol+1]=""
        indexCol=indexCol+1
    }
}
function upStep(){
    if(indexRow<(nbRow-1)){
        matrixNumber[indexRow][indexCol]=matrixNumber[indexRow+1][indexCol]
        matrixNumber[indexRow+1][indexCol]=""
        indexRow=indexRow+1
    }
}
function downStep(){
    if(indexRow>0){
        matrixNumber[indexRow][indexCol]=matrixNumber[indexRow-1][indexCol]
        matrixNumber[indexRow-1][indexCol]=""
        indexRow=indexRow-1
    }
}