import {Ball, RowBalls, randomInt, drawText, collide, distPoints, Scoring, debugConsole} from "../core/tool.js";
import { FadeEnd } from "./fadeEnd.js";
import { enter } from "./main.js";

const nbAnimalTypes = 3; 
const fallSpeed = 500; 
const velocity = 1200; 
const maxTimeLaunch =  0.5;
const alpha = 0.7;
const maxGameSpeed = 10; 
const maxNbSteps = 20; 
const maxProbaHardBall = 0.05; 
const minNbBubbles = 3; 

// const colors = [[0, 197, 255, alpha], [254, 186, 203, alpha], [131, 224, 76, alpha], [0, 0, 0, 1], [255, 50, 50, 1]];
// const colors = [[0, 197, 255, alpha], [255, 50, 50, alpha], [131, 224, 76, alpha], [0, 0, 0, 1], [255, 255, 0, 1]];  
const colors = [[0, 197, 255, alpha], [255, 50, 50, alpha], [131, 224, 76, alpha], [0, 0, 0, 1]];  
let currentState; 
let countLines; 
let totalScore; 
let bubbles; 
let waitingBubbles, launchBubble; 
let fixX, fixY; 
let countCollision = 0; 
let collidedBubble; 
let timerLaunch;
let yoffset; 
let trajectory; 
let gameTC; 
export class Game{
    constructor(globals){
        this.globals = globals; 
        this.vScreen = globals.vScreen; 
        this.ctx = globals.ctx; 
        this.name = "game";
        this.radius = globals.config.radius; 
        this.nbRows = globals.config.nbRows; 
        this.nbCols = globals.config.nbCols; 
        this.gridH = globals.config.gridH; 
        this.scorePanelH = globals.config.scorePanelH;
        this.ceilH = globals.config.ceilH;
        this.groundH = globals.config.groundH;
        this.wallS = globals.config.wallS;
        this.thresholdH = globals.config.thresholdH;
        this.scaleTitle = globals.config.scaleTitle; 
    }
    init(){
        currentState = "LAUNCH"; 
        countLines = 0;
        totalScore = 0; 
        gameTC = this.getGameTempoConfig(1); 
        fixX = this.vScreen.vW / 2; 
        fixY = this.vScreen.vH - this.wallS  - 5 * this.radius; 
        collidedBubble = null;
        timerLaunch = maxTimeLaunch * Math.random();
        yoffset = this.wallS + this.scorePanelH + this.ceilH;
        this.initGame(3); 
        launchBubble = this.randomLaunchBubble(randomInt(nbAnimalTypes), fixX, fixY, this.radius);
        waitingBubbles = []; 
        waitingBubbles[0] = this.randomLaunchBubble(randomInt(nbAnimalTypes), fixX, fixY + 2 * this.radius, this.radius);
        waitingBubbles[1] = this.randomLaunchBubble(randomInt(nbAnimalTypes), fixX, fixY + 4 * this.radius, this.radius);
        trajectory = []; 
        this.globals.assets.bgMusic.play();
    }
    needHardBall(){
        if(Math.random() < gameTC.probaHardBall){
            return true;
        }
        return false; 
    }
    getGameTempoConfig(n){
        const tc={
            numStep: n, 
            nbSteps: n <= 20 ? maxNbSteps - n : 0, 
            speed: maxGameSpeed - 7/(n**0.3), 
            probaHardBall: maxProbaHardBall / (n**0.3), 
            angleSpeed: Math.PI * (1 - 3 / (4*n**0.2))
        }
        //console.table(tc);
        return tc; 
    }

    f = function(n){
        return Math.PI * (1 - 3 / (4*n**0.2)) * 180;
    }

    initGame(nb){
        bubbles = []; 
        for(let i = 0; i < nb; i++){
            let indent; 
            if(i === 0){
                indent = false; 
            }else{
                indent = !bubbles[i-1].indent;
            }
            const y = yoffset + this.radius + this.radius * Math.sqrt(3) * i;
            const row = new RowBalls(y, indent); 
            for(let j = 0; j < this.nbCols; j++){
                const ball = new Ball(randomInt(nbAnimalTypes), this.wallS + (indent + 1) * this.radius + j * 2 * this.radius, y, this.radius, true); 
                //if(Math.random()>0.8){
                    row.addBall(ball);
                //}
            }
            bubbles.push(row); 
        }
        this.addBubbles();
    }

    randomLaunchBubble(id, x, y, r){
        const ball = new Ball(id, x, y, r, true); 
        ball.launched = false; 
        ball.angle = - Math.PI/2;
        ball.dir = 1;
        if(Math.random()>0.5){
            ball.dir = -1
        }
        return ball; 
    }
    addBubbles(){
        const y = bubbles[0].y - Math.sqrt(3) * this.radius;
        const indent = !bubbles[0].indent;
        const row = new RowBalls(y, indent); 
        for(let j = 0; j < this.nbCols; j++){
            const ball = new Ball(randomInt(nbAnimalTypes), this.wallS + (indent + 1) * this.radius + j * 2 * this.radius, y, this.radius, false); 
            row.addBall(ball);
        }
        bubbles.unshift(row); 
    }
    simulateTrajectory(){
        const dt = 1 / 60;
        if (launchBubble){
            trajectory = []; 
            let x = launchBubble.x; 
            let y = launchBubble.y; 
            let vx = velocity * Math.cos(launchBubble.angle); 
            let vy =  velocity * Math.sin(launchBubble.angle)
            for(let i = 0; i < gameTC.nbSteps; i++){
                x = x + vx * dt; 
                y = y + vy * dt; 
                if(x <= this.wallS + this.radius){
                    const diff = this.wallS + this.radius - x ;
                    x += 2 * diff; 
                    vx = -vx;
                }else if(x >= this.vScreen.vW - this.wallS - this.radius){
                    const diff = this.vScreen.vW - this.wallS - this.radius - x; 
                    x += 2 * diff; 
                    vx = -vx; 
                }
                trajectory.push({x: x, y: y});
                if(this.interceptBubble(x, y)){
                    break;
                }
            }
        }
    }
    interceptBubble(x, y){
        for(let i = bubbles.length - 1; i >= 0 ; i--){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                if(distPoints(x, y, ball.x, ball.y) <= 4 * this.radius * this.radius){
                    return true; 
                }
            }
        }
        return false; 
    }
    launch(){
        // const rect = this.globals.can.getBoundingClientRect(); 
        // if(this.globals.mouse.x >= rect.left + this.vScreen.xoffset && this.globals.mouse.x <= rect.right - this.vScreen.xoffset
        //     && this.globals.mouse.y >= rect.top + this.vScreen.yoffset && this.globals.mouse.y <= rect.bottom - this.vScreen.yoffset){
        //     if (launchBubble){
        //         launchBubble.vx = velocity * Math.cos(launchBubble.angle);
        //         launchBubble.vy = velocity * Math.sin(launchBubble.angle);
        //         currentState = "UPDATELAUNCHBUBBLE";
        //         launchBubble.launched = true;
        //     }
        // }
        if(this.vScreen.mouseX >= 0 && this.vScreen.mouseX <= this.vScreen.vW
            && this.vScreen.mouseY >= 0 && this.vScreen.mouseY <= this.vScreen.vH){
            if (launchBubble){
                launchBubble.vx = velocity * Math.cos(launchBubble.angle);
                launchBubble.vy = velocity * Math.sin(launchBubble.angle);
                currentState = "UPDATELAUNCHBUBBLE";
                launchBubble.launched = true;
            }
        }
    }
    automaticLaunch(){
        if (launchBubble){
            launchBubble.vx = velocity * Math.cos(launchBubble.angle);
            launchBubble.vy = velocity * Math.sin(launchBubble.angle);
            currentState = "UPDATELAUNCHBUBBLE";
            launchBubble.launched = true;
        }
    }
    
    updateBubbles(dt){
        for(let i = bubbles.length - 1; i >= 0; i--){
            const row = bubbles[i]; 
            //if(currentState !== "DISAPPEAR" && currentState !== "FALL"){
                row.y += gameTC.speed * dt; 
            //}
            const balls = bubbles[i].balls; 
            for(let j = balls.length - 1; j >= 0; j--){
                const ball = balls[j]; 
                ball.animationTimer -= dt;
                if (ball.animationTimer <= 0){
                    ball.frameIndex ++; 
                    ball.animationTimer = ball.animationSpeed; 
                    if (ball.frameIndex >= 2){
                        ball.frameIndex = 0;
                    }
                }
                if(ball.status === "disappear"){
                    //if(ball.bubbleFrameIndex === 0){
                        ball.r *= 1.01; 
                    // }
                    ball.bubbleAnimationTimer -= dt; 
                    if(ball.bubbleAnimationTimer <= 0){
                        ball.bubbleAnimationTimer = ball.bubbleAnimationSpeed;
                        ball.bubbleFrameIndex ++; 
                        if(ball.bubbleFrameIndex >= this.globals.assets.imgBubbles.length){
                            totalScore += ball.score; 
                            balls.splice(j, 1); 
                        }
                    }
                }
                if (ball.status === "fall"){
                    ball.y += ball.vy * dt; 
                    if(ball.y >= fixY){
                        totalScore += ball.score; 
                        if(ball.id < 3){
                            ball.y = fixY; 
                            ball.vy = 0; 
                            ball.status = "disappear"; 
                            this.globals.assets.pickupSound.play();
                        }
                        //balls.splice(j, 1);
                    }
                }else{
                    if(ball.y < fixY){
                        if(row.y - ball.y >= Math.sqrt(3) * this.radius - 0.1){
                            debugConsole("problem");
                            //this.draw();
                            throw new Error("Error!");
                        }
                        ball.y = row.y;
                        if(!ball.active && ball.y >= yoffset + this.radius){
                            ball.active = true;
                        }
                    }
                }
            }
            this.removeBubblesRow(i);
            if(row.y + this.radius >= yoffset + this.gridH){
                currentState = "GAMEOVER";
                this.globals.assets.bgMusic.pause();
                this.globals.assets.deadSound.play();
                const fade = new FadeEnd(this.globals, "gameover", totalScore);
                enter(fade); 
            }
        }
    }
    update(dt){
        if(currentState !== "GAMEOVER"){
            if(bubbles[0].y >= (yoffset + this.radius - this.radius * Math.sqrt(3))){
                this.addBubbles();
                countLines ++; 
                if(countLines % (5*gameTC.numStep) === 0){
                    gameTC = this.getGameTempoConfig(gameTC.numStep + 1); 
                }
            }
            const anyDisappearBubbles = this.anyStatusBubbles("disappear");  
            const anyFallBubbles = this.anyStatusBubbles("fall");  
            this.updateBubbles(dt);
            if(currentState === "LAUNCH"){
                if(this.vScreen.mouseClick){
                    this.vScreen.mouseClick = false; 
                    this.launch(); 
                }
                // timerLaunch -= dt; 
                // if(timerLaunch <= 0){
                //     this.automaticLaunch();
                //     timerLaunch = maxTimeLaunch * Math.random();
                // }
               this.updateLaunchDirection(dt);
            }else if(currentState === "UPDATELAUNCHBUBBLE"){
                if(launchBubble){
                    this.updateLaunchBubble(dt); 
                }else{
                    if(!anyDisappearBubbles && !anyFallBubbles){
                        this.initLaunchStage(); 
                    }
                }
            }
        }
    }; 

    countCheckedBubbles(){
        let count = 0; 
        for(let i = 0; i < bubbles.length; i++){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                if(ball.checked){
                    count++; 
                }
            }
        }
        return count;
    }

    anyStatusBubbles(status){
        for(let i = 0; i < bubbles.length; i++){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                if(ball.status === status){
                    return true; 
                }
            }
        }
        return false;
    }

    anyFallingBall(){
        for(let i = bubbles.length - 1; i >= 0; i--){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                if(ball.vy > 0){
                    return true; 
                }
            }
        }
        return false;
    }

    initCheckedBubbles(){
        for(let i = 0; i < bubbles.length; i++){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                ball.checked = false; 
            }
        }
    }

    initNotFallingCheckedBubbles(){
        for(let i = 0; i < bubbles.length; i++){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                ball.notFallingChecked = false; 
            }
        }
    }

    floodFill(bubble, numRow){
        if(bubble === -1) return; 
        if(!bubble.active) return; 
        if(bubble.id !== launchBubble.id) return; 
        if(bubble.checked) return; 
        bubble.checked = true;
        const res = this.sixNeighbor(bubble, numRow); 
        const sixObjets = res.objets; 
        for(let i = 0; i < sixObjets.length; i++){
            const r = numRow + Math.floor(i/2) - 1; 
            this.floodFill(sixObjets[i], r); 
        }
    }

    floodFillNotFalling(bubble, numRow){
        if(bubble === -1) return; 
        if(bubble.status !== "idle") return; 
        if(bubble.notFallingChecked) return; 
        bubble.notFallingChecked = true;
        const res = this.sixNeighbor(bubble, numRow); 
        const sixObjets = res.objets; 
        for(let i = 0; i < sixObjets.length; i++){
            const r = numRow + Math.floor(i/2) - 1; 
            this.floodFillNotFalling(sixObjets[i], r); 
        }
    }

    findFallBubbles(){
        this.initNotFallingCheckedBubbles(); 
        let balls = bubbles[1].balls; 
        for(let j = 0; j < balls.length; j++){
            const ball = balls[j];
            this.floodFillNotFalling(ball, 1); 
        }
        for(let i = 0; i < bubbles.length; i++){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                if(!ball.notFallingChecked && ball.status !== "disappear"){
                    ball.status = "fall"; 
                    ball.vy = fallSpeed; 
                    ball.score = 20; 
                }
            }
        }
        this.initNotFallingCheckedBubbles(); 
    }
    
    updateLaunchDirection(dt){
        launchBubble.angle += launchBubble.dir * gameTC.angleSpeed * dt; 
        if(launchBubble.angle>-20/180*Math.PI){
            launchBubble.angle = -20/180*Math.PI;
            launchBubble.dir = -1;
        }else if(launchBubble.angle<-160/180*Math.PI){
            launchBubble.angle=-160/180*Math.PI
            launchBubble.dir = 1;
        }
        launchBubble.animationTimer -= dt;
        if (launchBubble.animationTimer <= 0){
            launchBubble.frameIndex ++; 
            launchBubble.animationTimer = launchBubble.animationSpeed; 
            if (launchBubble.frameIndex >= 2){
                launchBubble.frameIndex = 0;
            }
        }
        this.simulateTrajectory();
    }
    initLaunchStage(){
        //collidedBubble = null;
        this.initCheckedBubbles(); 
        currentState = "LAUNCH"; 
        launchBubble = waitingBubbles[0]; 
        launchBubble.y -= 2 * this.radius;
        launchBubble.launched = false;
        waitingBubbles[0] = waitingBubbles[1]; 
        waitingBubbles[0].y -= 2 * this.radius;
        waitingBubbles[1] = this.randomLaunchBubble(this.needHardBall() ? 3 : randomInt(nbAnimalTypes), fixX, fixY + 4 * this.radius, this.radius);
    }

    updateLaunchBubble(dt){
        if(launchBubble.status !=="disappear"){
            launchBubble.x += launchBubble.vx * dt;
            launchBubble.y += launchBubble.vy * dt; 
            if(launchBubble.x <= this.wallS + this.radius){
                this.globals.assets.hit1Sound.play(); 
                const diff = this.wallS + this.radius - launchBubble.x ;
                launchBubble.x += 2 * diff; 
                launchBubble.vx = -launchBubble.vx;
    
            }else if(launchBubble.x >= this.vScreen.vW - this.wallS - this.radius){
                this.globals.assets.hit1Sound.play(); 
                const diff = this.vScreen.vW - this.wallS - this.radius - launchBubble.x; 
                launchBubble.x += 2 * diff; 
                launchBubble.vx = -launchBubble.vx; 
    
            }
            if(launchBubble.launched && launchBubble.y >= fixY){
                this.globals.assets.hit1Sound.play();
                launchBubble.y = fixY; 
                launchBubble.vy = 0; 
                launchBubble.status = "disappear"; 
            }
        }else{
            launchBubble.bubbleAnimationTimer -= dt; 
            if(launchBubble.bubbleAnimationTimer <= 0){
                launchBubble.bubbleAnimationTimer = launchBubble.bubbleAnimationSpeed;
                launchBubble.bubbleFrameIndex ++; 
                if(launchBubble.bubbleFrameIndex >= this.globals.assets.imgBubbles.length){
                    launchBubble = null; 
                }
            }
        }
        if(launchBubble){
            this.detectCollideBubble(); 
        }
    }

    detectCollideBubble(){
        external_loop:
        for(let i = bubbles.length - 1; i >= 0; i--) {
            let balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j];
                if (launchBubble.id === 3){
                    if(collide(launchBubble, ball)){
                        if(ball.active){
                            this.globals.assets.explodeSound.play();
                            ball.checked = true; 
                            ball.status = "disappear"; 
                            ball.score = 10; 
                        }else{
                            this.globals.assets.hit1Sound.play();
                            launchBubble.vx = 0; 
                            launchBubble.vy = fallSpeed;
                            break external_loop; 
                        }
                    }
                }else{
                    if(collide(launchBubble, ball)){
                        collidedBubble = ball;
                        countCollision++; 
                        launchBubble.vx = 0; 
                        launchBubble.vy = 0;
                        debugConsole(`Collision number: ${countCollision}`); 
                        debugConsole(`Collision in row:  ${i}`); 
                        debugConsole(`Collided bubble coordinates: ${ball.x}, ${ball.y}`);
                        this.nearestNeighbor(ball, i);
                        const countCB = this.countCheckedBubbles()
                        if (countCB >= minNbBubbles){
                            this.globals.assets.pickupSound.play();
                            //this.globals.assets.hit2Sound.play();
                            this.disappearBubbles(); 
                        }else{
                            this.globals.assets.hit1Sound.play();
                        }
                        break external_loop; 
                    }
                }
            }
        }
        const countCB = this.countCheckedBubbles()
        if(countCB > 0 || (launchBubble.id < nbAnimalTypes && countCB >= minNbBubbles)){
            //console.log("find falling bubbles", countCollision);
            this.initCheckedBubbles();
            this.findFallBubbles();
        }
    }

    sixNeighbor(bubble, numRow){
        const x = bubble.x; 
        const y = bubble.y; 
        const sixCoords = [[x - this.radius, y - this.radius * Math.sqrt(3)], [x + this.radius, y - this.radius * Math.sqrt(3)], 
        [x - 2 * this.radius, y], [x + 2 * this.radius, y], 
        [x - this.radius, y + this.radius * Math.sqrt(3)], [x + this.radius, y + this.radius * Math.sqrt(3)]]; 
        let sixObjets = [-1, -1, -1, -1, -1, -1];
        for(let i = numRow - 1; i <= numRow + 1; i +=2){
            if(i>=0 && i< bubbles.length){
                for(let j = 0; j < bubbles[i].balls.length; j++){
                    const ball = bubbles[i].balls[j]; 
                    if(ball.x - x === - this.radius){
                        sixObjets[(i + (1-numRow)) * 2] = ball; 
                    }else if(ball.x - x === this.radius){
                        sixObjets[(i + (1-numRow)) * 2 +1] = ball; 
                    }
                }
            }
        }
        let i = numRow; 
        if(i >=0 && i< bubbles.length){
            for(let j = 0; j < bubbles[i].balls.length; j++){
                const ball = bubbles[i].balls[j]; 
                if(ball.x - x === - 2 * this.radius){
                    sixObjets[2] = ball; 
                }else if(ball.x - x === 2 * this.radius){
                    sixObjets[3] = ball; 
                }
            }
        }
        return {coords: sixCoords, objets: sixObjets}; 
    }

    nearestNeighbor(bubble, numRow){
        const res = this.sixNeighbor(bubble, numRow); 
        const sixCoords = res.coords; 
        const sixObjets = res.objets; 
        let validPosition = {}
        for(let i = 0; i < 6; i++){
            const coord = sixCoords[i]; 
            if(sixObjets[i] === -1  && coord[0] >= this.radius && coord[0] <= this.vScreen.vW - this.radius){
              validPosition[i] = coord;  
            }
        }
        const dists = {}; 
        for(let key in validPosition){
            const coord = validPosition[key];
            const dist = distPoints(coord[0], coord[1], launchBubble.x, launchBubble.y);
            dists[key] = dist; 
        }

        let minDist = 5 * this.radius * 5 * this.radius;
        for(let key in dists){
            const dist = dists[key];
            minDist = Math.min(minDist, dist); 
        }
        for(let key in validPosition){
            if(dists[key] === minDist){
                const coord = validPosition[key];
                launchBubble.x = coord[0]; 
                launchBubble.y = coord[1];
                const r = numRow + Math.floor(key/2) - 1; 
                debugConsole(`Position row: ${r}`); 
                debugConsole(`Position key: , ${key}`); 
                debugConsole(`New coordinates: ${coord[0]}, ${coord[1]}`); 
                if(r >= bubbles.length){
                    const indent = !bubbles[bubbles.length - 1].indent; 
                    const row = new RowBalls(launchBubble.y, indent); 
                    debugConsole(`case 1: postionnement row y: ${launchBubble.y}`); 
                    row.addBall(launchBubble); 
                    bubbles.push(row); 
                }else{
                    const row = bubbles[r]; 
                    debugConsole(`case 2: postionnement row y: ${row.y}`); 
                    row.addBall(launchBubble); 
                }
                this.floodFill(launchBubble, r);
                launchBubble = null;
                break;
            }
        }
    }

    calculScore(nb){
        return 5*(nb-1)*(nb-1);
    }
    calculScoreFalling(nb){
        let score = 0; 
        for(let i = 1; i <= nb; i++){
            score += Math.floor(Math.pow(1.2, i));
        }
        return 5*score; 
    }

    
    disappearBubbles(){
        for(let i = 0; i < bubbles.length; i++){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                if(ball.checked){
                    ball.status = "disappear";
                    ball.score = 10; 
                }
            }
        }
    }
    
    
    removeBubblesRow(r){
        const balls = bubbles[r].balls; 
        if(r === bubbles.length - 1 && balls.length === 0){
            debugConsole("remove last line");
            bubbles.splice(r, 1);
        }
    }


    draw(){
        this.ctx.save(); 
        this.vScreen.transform();
        this.ctx.fillStyle = "rgba(20, 50, 20, 1)";
        this.ctx.fillRect(0, 0, this.vScreen.vW, this.vScreen.vH);
        this.drawBubbles(); 
        this.drawScorePanel();
        this.drawCeil();
        // this.ctx.fillStyle= "red"; 
        // this.ctx.font = "12px Arial";
        // this.ctx.fillText(`${currentState}; Nb of Lines: ${countLines}; Speed: ${Math.floor(gameTC.speed)}`, this.wallS, fixY); 
        // this.ctx.fillStyle= "red"; 
        // this.ctx.font = "12px Arial"; 
        // for( let i = 0; i < this.nbRows; i++){
        //     const y = yoffset+ this.radius + this.radius * Math.sqrt(3) * i;
        //     this.ctx.fillText(Math.floor(y), -30, y); 
        // }
        // for(let i = 0; i < bubbles.length; i++){
        //     const y = yoffset+ this.radius + this.radius * Math.sqrt(3) * (i-2);
        //     this.ctx.fillText(Math.floor(bubbles[i].y), this.vScreen.vW + 10, y); 
        // }
        // for(let i = 0; i < this.nbCols; i++){
        //     const x = this.wallS + this.radius + i * 2 * this.radius;
        //     const y = yoffset + this.gridH + 20; 
        //     this.ctx.fillText(Math.floor(x), x-this.radius/2, y); 
        // }
        this.drawThreshold();
        this.drawGround();
        this.drawWalls();
        this.ctx.restore(); 
    }
    drawBubbles(){
        this.ctx.imageSmoothingEnabled = false;
        for(let i = 0; i < bubbles.length; i++){
            const balls = bubbles[i].balls; 
            for(let j = 0; j < balls.length; j++){
                const ball = balls[j]; 
                const imgA = this.globals.assets.imgAnimals[ball.id];
                const imgB = this.globals.assets.imgBubbles[ball.id][ball.bubbleFrameIndex]; 
                ball.draw(this.ctx, imgA, imgB, colors[ball.id]);   
                if(ball.status === "disappear"){
                    this.drawScoring(ball);
                }
                // this.ctx.fillStyle = "red"; 
                // this.ctx.fillText(ball.status, ball.x, ball.y); 
            }
        }
        for(let i = 0; i < waitingBubbles.length; i++){
            const ball = waitingBubbles[i]; 
            const imgA = this.globals.assets.imgAnimals[ball.id];
            const imgB = this.globals.assets.imgBubbles[ball.id][ball.bubbleFrameIndex]; 
            ball.draw(this.ctx, imgA, imgB, colors[ball.id]); 
        }
        if(launchBubble){
            const imgA = this.globals.assets.imgAnimals[launchBubble.id];
            const imgB = this.globals.assets.imgBubbles[launchBubble.id][launchBubble.bubbleFrameIndex]; 
            launchBubble.draw(this.ctx, imgA, imgB, colors[launchBubble.id]);
            if(!launchBubble.launched){
                this.ctx.strokeStyle="rgb(255, 255, 0)"
                this.ctx.beginPath(); 
                this.ctx.moveTo(launchBubble.x,launchBubble.y)
                this.ctx.lineTo(launchBubble.x + Math.cos(launchBubble.angle) * 50, launchBubble.y + Math.sin(launchBubble.angle) * 50); 
                this.ctx.stroke(); 
                for(let i = 0; i < trajectory.length; i++){
                    const coord = trajectory[i]; 
                    this.ctx.beginPath(); 
                    this.ctx.fillStyle = "white";
                    this.ctx.arc(coord.x, coord.y, 3, 0, 2 * Math.PI); 
                    this.ctx.fill();
                }
            }
        }
    }

    drawWalls(){
        this.ctx.strokeStyle = "rgb(205, 128, 0)"; 
        this.ctx.fillRect(0, 0, this.vScreen.vW, this.wallS);
        this.ctx.fillRect(0, 0, this.wallS, this.vScreen.vH);
        this.ctx.fillRect(this.vScreen.vW - this.wallS, 0, this.wallS, this.vScreen.vH);
        this.ctx.fillRect( 0, this.vScreen.vH - this.wallS, this.vScreen.vW, this.wallS); 
    }

    drawScorePanel(){
        this.ctx.fillStyle = "black"; 
        this.ctx.fillRect(this.wallS, this.wallS, this.vScreen.vW - 2 * this.wallS, this.scorePanelH);
        let text1="SCORE  " + totalScore
        drawText(this.ctx, text1, "LEFT", [205, 128, 0], "24px Arial", this.wallS, this.wallS, this.vScreen.vW - 2 * this.wallS, this.scorePanelH);
    }
    drawCeil(){
        this.ctx.fillStyle = "rgb(205, 128, 0)";
        this.ctx.fillRect(0, this.wallS + this.scorePanelH, this.vScreen.vW, this.ceilH)
    }
    
    drawThreshold(){
        this.ctx.fillStyle = "rgb(200, 40, 150)";
        this.ctx.fillRect(0, yoffset + this.gridH, this.vScreen.vW, this.thresholdH);
    }

    drawGround(){
        this.ctx.fillStyle = "rgb(205, 128, 0)";
        const y = yoffset + this.gridH + Math.sqrt(3) * this.radius * 2; 
        const groundW = (this.vScreen.vW - 2 * this.radius)/2;
        this.ctx.fillRect(0, y, groundW, this.groundH); 
        this.ctx.fillRect(groundW + 2 * this.radius, y, groundW, this.groundH); 
        this.ctx.fillRect(groundW - this.groundH, y, this.groundH, 4 * this.radius + this.groundH);
        this.ctx.fillRect(groundW + 2 * this.radius, y, this.groundH, 4 * this.radius + this.groundH);
        //this.ctx.fillText(currentState, 0, y);
    }

    drawScoring(ball){
        this.ctx.font = "14px Arial"; 
        let text = ball.score;
        let w = this.ctx.measureText(text).width;
        let h = this.ctx.measureText("M").width;
        drawText(this.ctx, text,  "CENTER", [0, 0, 0], "14px Arial", ball.x - w / 2 -2, ball.y - this.radius, w, h); 
        drawText(this.ctx, text,  "CENTER", [0, 0, 0], "14px Arial", ball.x - w / 2, ball.y - this.radius - 2, w, h); 
        drawText(this.ctx, text,  "CENTER", [0, 0, 0], "14px Arial", ball.x - w / 2 + 2, ball.y - this.radius, w, h); 
        drawText(this.ctx, text,  "CENTER", [0, 0, 0], "14px Arial", ball.x - w / 2, ball.y - this.radius + 2, w, h); 
        drawText(this.ctx, text,  "CENTER", [205, 128, 0], "14px Arial", ball.x - w / 2, ball.y - this.radius, w, h); 
    }
}
