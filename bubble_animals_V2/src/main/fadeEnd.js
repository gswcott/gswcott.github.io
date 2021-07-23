import { Game }  from "./game"; 
import { Gameover }  from "./gameover"; 

const distW = 48; 
const distH = 48; 
const sizeW = 0; 
const sizeH = 0;  
let rects, t, fadeState; 
class Rect {
    constructor(x, y, w, h){
        this.centerX = x; 
        this.centerY = y; 
        this.w = w; 
        this.h = h; 
    }
}
export class FadeEnd{
    constructor(globals, toScene, score){
        this.globals = globals; 
        this.vScreen = globals.vScreen; 
        this.ctx = globals.ctx; 
        this.toScene = toScene; 
        this.score = score;
        this.name = "fadeEnd";
    }
    init(){
        rects = []; 
        fadeState = "out"; 
        t = 0; 
        for(let x = 0; x < this.vScreen.dW + distW; x += distW){
            for(let y = 0; y < this.vScreen.dH + distH; y += distH){
                rects.push(new Rect(x, y, sizeW, sizeH)); 
            }
        }
    }
    update(dt){
        if(fadeState === "out"){
            t += 3 * dt;
            if(t >= 1){
                t = 1; 
                fadeState = "in"; 
                let newScene; 
                if(this.toScene === "game"){
                    newScene = new Game(this.globals); 
                }else if (this.toScene === "gameover"){
                    newScene = new Gameover(this.globals, this.score); 
                }
                newScene.init(); 
                this.globals.scenes.splice(this.globals.scenes.length - 2, 1, newScene); 
            }
        }else if(fadeState === "in"){
            t -= 3 * dt;
            if(t <= 0){
                t = 0; 
                this.globals.scenes.splice(this.globals.scenes.length - 1, 1); 
                 if(this.toScene === "game"){
                    this.globals.assets.bgMusic.play();
                }else if (this.toScene === "gameover"){
                    //this.globals.assets.endMusic.play();
                }
            }
        }
        for(let i = 0; i < rects.length; i++){
            const rect = rects[i]; 
            rect.sizeW = distW * t; 
            rect.sizeH = distH * t; 
        }
    }
    draw(){
        this.ctx.save(); 
        this.vScreen.transform(); 
        for(let i = 0; i < rects.length; i ++){
            const rect = rects[i]; 
            this.ctx.fillStyle = "rgb(0, 0, 0)"; 
            this.ctx.fillRect(rect.centerX - rect.sizeW / 2, rect.centerY - rect.sizeH / 2, rect.sizeW, rect.sizeH);
        }
        this.ctx.restore();
    }
}