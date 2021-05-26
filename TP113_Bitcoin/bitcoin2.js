window.onload=initialisation
function initialisation(){
    price=document.getElementById("price")
    can=document.getElementById("plot")
    ctx=can.getContext("2d")
    lwBtn=document.getElementById("lwBtn")
    lmBtn=document.getElementById("lmBtn")
    lyBtn=document.getElementById("lyBtn")
    getCurrentValue()
    date=new Date(2020,7,1)
    endDate=date.getFullYear().toString() + "-" + date.getMonth().toString() + "-" + date.getDate().toString()
    /*newDate=new Date(date.getFullYear(), date.getMonth(), date.getDate()-7)*/
    /*startDate=newDate.getFullYear().toString()+newDate.getMonth().toString()+newDate.getDate().toString()*/
    getPlotLastWeek()
    lwBtn.onclick=function(){
        drawInitalCanvas()
        getPlotLastWeek()
     }
    lmBtn.onclick=function(){
        drawInitalCanvas()
        getPlotLastMonth()
    }
    lyBtn.onclick=function(){
        drawInitalCanvas()
        getPlotLastYear()
        
    }
     lwBtn.focus()
}

function drawInitalCanvas(){
    ctx.fillStyle="white"
    ctx.fillRect(0,0,can.width, can.height)
}

function getPlotLastWeek(){
    /* var day=date.getDate()-6
    var month=date.getMonth()
    var year=date.getMonth()
    if(day<1){
        month-=1
        if(month<0){
            year-=1
            month=11
        }
        var numDays=new Date(year, month, 0).getDate()
        day=numDays+day
    }*/
    newDate=new Date(date.getFullYear(), date.getMonth(), date.getDate()-7)
    startDate=newDate.getFullYear().toString() + "-" + newDate.getMonth().toString() + "-" + newDate.getDate().toString()
    getValues(startDate, endDate)
}

function getPlotLastMonth(){
    newDate=new Date(date.getFullYear(), date.getMonth()-1, date.getDate())
    startDate=newDate.getFullYear().toString() + "-" + newDate.getMonth().toString() + "-" + newDate.getDate().toString()
    getValues(startDate, endDate)
}

function getPlotLastYear(){
    newDate=new Date(date.getFullYear()-1, date.getMonth(), date.getDate())
    startDate=newDate.getFullYear().toString() + "-" + newDate.getMonth().toString() + "-" + newDate.getDate().toString()
    getValues(startDate, endDate)
}


function getValues(start, end){
    let r = new XMLHttpRequest()
    r.open("GET", "https://api.coindesk.com/v1/bpi/historical/close.json?start="+start+"&end="+end)
    r.onload=function(){
        var obj=JSON.parse(r.response)
        var values=[]
        for (key in obj.bpi){
            values.push(obj.bpi[key])
        }
        var maxValue=Math.max(...values)
        var minValue=Math.min(...values)
        var nbValues=Object.keys(obj.bpi).length
        console.log(nbValues)
        console.log(obj.bpi)
        var minY=can.height/nbValues
        var gapX=can.width/(nbValues+1)
        var coordX=[]
        var coordY=[]
        var i=0
        for (key in obj.bpi){
            coordX.push((i+1)*gapX)
            coordY.push(can.height-(minY+(obj.bpi[key]-minValue)/(maxValue-minValue)*(can.height-2*minY)))
            i++
        }
        for(var j=0; j<coordX.length;j++){
            drawPointLine(coordX, coordY,j)
        }
        ctx.fillStyle="blue"
        ctx.fillText("Min: " + minValue, 10, can.height-10)
        ctx.fillText("Max: " + maxValue, 10, 10)
    }
    r.send()
}

function drawPointLine(coX, coY, i){
    ctx.beginPath()
    ctx.fillStyle="red"
    ctx.arc(coX[i],coY[i],2,0,360)
    ctx.fill()
    if(i<coX.length-1){
        ctx.beginPath()
        ctx.moveTo(coX[i],coY[i])
        ctx.lineTo(coX[i+1],coY[i+1])
        ctx.stroke()
    }
}

function getCurrentValue(){
    let r = new XMLHttpRequest()
    r.open("GET", "https://api.coindesk.com/v1/bpi/currentprice.json")
    r.onload=function(){
        var obj=JSON.parse(r.response)
        time=obj.time.updatedISO
        currentDate=time.substring(0,10)
        price.innerHTML=obj.bpi.USD.rate_float
    }
    r.send()
}
