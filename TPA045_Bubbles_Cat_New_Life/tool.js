function randomInt(nb){
    return Math.floor(Math.random()*(nb))
}

function renderQuad(pR, pC, pSizeW, pSizeH){
    let quad={}
    quad.x=pC*pSizeW
    quad.y=pR*pSizeH
    quad.w=pSizeW
    quad.h=pSizeH
    return quad
}

function getRGB(color, opaque){ 
    return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + opaque + ")"
}


function convertRGB(colorArray){
    let res = "rgb(+" + colorArray[0]+", " + colorArray[1] + ", " + colorArray[2]+")"
    return res
}

function drawText(text, color, font, x, y, w, h){
    ctx.font = font
    ctx.fillStyle=convertRGB(color)
    let textW=ctx.measureText(text).width
    let textH=ctx.measureText("M").width
    let x0=x+(w-textW)/2
    let y0=y+(h+textH)/2
    ctx.fillText(text, x0, y0)
}

function createButton(x, y, w, h, colorB, gapC, text, colorT, font, onclickFunc){
    let button={}
    button.x = x
    button.y = y 
    button.w = w
    button.h = h
    button.colorB = colorB
    button.gapColor = gapC
    button.text = text
    button.colorT = colorT
    button.font = font
    button.onclick = onclickFunc
    return button
}

function drawLine(linewidth, color, x0, y0, x1, y1){
    ctx.lineWidth=linewidth
    ctx.strokeStyle=convertRGB(color)
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
}


function drawButton(button){
    ctx.fillStyle = convertRGB(button.colorB)
    ctx.fillRect(button.x, button.y, button.w, button.h)
    let lightColor =  [button.colorB[0]+button.gapColor, button.colorB[1]+button.gapColor, button.colorB[2]+button.gapColor]
    let darkColor =  [button.colorB[0]-button.gapColor, button.colorB[1]-button.gapColor, button.colorB[2]-button.gapColor]
    drawLine(3, lightColor, button.x, button.y, button.x, button.y+button.h)
    drawLine(3, lightColor, button.x, button.y, button.x+button.w, button.y)
    drawLine(3, darkColor, button.x+button.w, button.y, button.x+button.w, button.y+button.h)
    drawLine(3, darkColor, button.x, button.y+button.h, button.x+button.w, button.y+button.h)
    drawText(button.text, button.colorT, button.font, button.x, button.y, button.w, button.h)
}

