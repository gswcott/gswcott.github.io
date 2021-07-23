import { Ball, Button, drawTitle, isInButton, randomInt} from "../core/tool";
import { enter } from "./main";
import { FadeStart } from "./fadeStart"; 

const nbAnimalTypes = 3; 
const velocity = 200; 
const maxTimeLaunch =  2;
const maxTimeGenerate = 0.5; 
const alpha = 0.7;
const colors = [[0, 197, 255, alpha], [255, 50, 50, alpha], [131, 224, 76, alpha]]; 

let fixX, fixY, timerLaunch, timerGenerate;; 
let playButton; 
let bubbles, waitingBubbles, launchBubble; 
let generate; 
export class Menu {
    constructor(globals){
        this.globals = globals; 
        this.name = "menu";
        this.ctx = globals.ctx;  
        this.config = globals.config; 
        this.vScreen = globals.vScreen; 
        this.radius = this.config.radius; 
    }
    init(){
        fixX = this.vScreen.vW / 2; 
        fixY = this.vScreen.vH - 5 * this.radius; 
        timerLaunch = 1 + (maxTimeLaunch-1) * Math.random();
        timerGenerate = maxTimeGenerate;
        generate = true;
        playButton = new Button(this.globals.assets.imgFont, "PLAY", 0, this.vScreen.vH / 2, this.vScreen.vW, 100, this.config.scaleTitle, [255, 153, 0, 0.7]);
        bubbles = []; 
        launchBubble = this.randomLaunchBubble(randomInt(nbAnimalTypes), fixX, fixY, this.radius);
        waitingBubbles = []; 
        waitingBubbles[0] = this.randomLaunchBubble(randomInt(nbAnimalTypes), fixX, fixY + 2 * this.radius, this.radius);
        waitingBubbles[1] = this.randomLaunchBubble(randomInt(nbAnimalTypes), fixX, fixY + 4 * this.radius, this.radius);
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
    initLaunchStage(){
        timerLaunch = maxTimeLaunch * Math.random();
        launchBubble = waitingBubbles[0]; 
        launchBubble.y -= 2 * this.radius;
        launchBubble.launched = false;
        waitingBubbles[0] = waitingBubbles[1]; 
        waitingBubbles[0].y -= 2 * this.radius;
        waitingBubbles[1] = this.randomLaunchBubble(randomInt(nbAnimalTypes), fixX, fixY + 4 * this.radius, this.radius);
    }
    automaticLaunch(){
        if (launchBubble){
            launchBubble.vx = velocity * Math.cos(launchBubble.angle);
            launchBubble.vy = velocity * Math.sin(launchBubble.angle);
            bubbles.push(launchBubble); 
            launchBubble = null; 
        }
    }
    play(){
        if(isInButton(this.vScreen.mouseX, this.vScreen.mouseY, playButton)){
            this.vScreen.mouseClick = false; 
            const fade = new FadeStart(this.globals);
            enter(fade); 
        }
    }
    update(dt){
        if(this.vScreen.mouseClick){
            this.play();
        }
        if(!generate){
            timerGenerate -= dt; 
            if(timerGenerate <= 0){
                this.initLaunchStage(); 
                timerGenerate = maxTimeGenerate;
                generate = true;
            }
        }else {
            timerLaunch -= dt; 
            if(timerLaunch <= 0){
                this.automaticLaunch();
                generate = false; 
            }
        }
        if(launchBubble){
            this.updateLaunchDirection(dt);
        }
        this.updateBubbles(dt);
    }

    updateLaunchDirection(dt){
        launchBubble.angle += launchBubble.dir*Math.PI*1/4*dt; 
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
    }

    updateBubbles(dt){
        for(let i = bubbles.length - 1; i >= 0; i--){
            const ball = bubbles[i]; 
            ball.animationTimer -= dt;
            if (ball.animationTimer <= 0){
                ball.frameIndex ++; 
                ball.animationTimer = ball.animationSpeed; 
                if (ball.frameIndex >= 2){
                    ball.frameIndex = 0;
                }
            }
            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt; 
            if(ball.x <= this.radius){
                const diff = this.radius - ball.x ;
                ball.x += 2 * diff; 
                ball.vx = -ball.vx;
            }else if(ball.x >= this.vScreen.vW - this.radius){
                const diff = this.vScreen.vW - this.radius - ball.x; 
                ball.x += 2 * diff; 
                ball.vx = -ball.vx; 
            }
            if(ball.y <= -this.radius){
                bubbles.splice(i, 1);
            }
        }
    }

    draw(){
        this.ctx.save(); 
        this.vScreen.transform();
        this.ctx.fillStyle = "rgba(20, 50, 20, 1)";
        this.ctx.fillRect(0, 0, this.vScreen.vW, this.vScreen.vH);
        this.ctx.imageSmoothingEnabled = false;
        this.config.scaleTitle = drawTitle(this.ctx, "BUBBLE", this.globals.assets.imgFont, 
        0, this.vScreen.vH / 6, this.vScreen.vW, this.vScreen.vH * 1.5 / 6, this.config.scaleTitle); 
        drawTitle(this.ctx, "ANIMALS", this.globals.assets.imgFont, 
        0, this.vScreen.vH * 1.5 / 6, this.vScreen.vW, this.vScreen.vH / 3, this.config.scaleTitle); 
        playButton.scale = this.config.scaleTitle; 
        playButton.draw(this.ctx);
        this.drawBubbles();
        this.drawBarrier();
        this.ctx.restore();
    }
    drawBarrier(){
        this.ctx.fillStyle = "rgb(205, 128, 0)";
        const y = this.vScreen.vH - 4 * this.radius - 1/3 * this.radius; 
        const width = 10;
        this.ctx.fillRect(fixX - this.radius - width, y, width,  4 * this.radius + 1/3 * this.radius);
        this.ctx.fillRect(fixX + this.radius, y, width,  4 * this.radius + 1/3 * this.radius);
        //this.ctx.fillText(currentState, 0, y);
    }
    drawBubbles(){
        this.ctx.imageSmoothingEnabled = false;
        for(let i = 0; i < bubbles.length; i++){
            const ball = bubbles[i]; 
            const imgA = this.globals.assets.imgAnimals[ball.id];
            const imgB = this.globals.assets.imgBubbles[ball.id][ball.bubbleFrameIndex];
            ball.draw(this.ctx, imgA, imgB, colors[ball.id]);   
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
                this.ctx.lineWidth = 4;
                this.ctx.beginPath(); 
                this.ctx.moveTo(launchBubble.x,launchBubble.y)
                this.ctx.lineTo(launchBubble.x + Math.cos(launchBubble.angle) * 50, launchBubble.y + Math.sin(launchBubble.angle) * 50); 
                this.ctx.stroke(); 
            }

        }
    }
}