
import { Game }  from "./game"; 
const radius = 45; 
const dist = 64; 
let circles, t, fadeState; 

class Circle {
    constructor(x, y, r){
        this.x = x; 
        this.y = y; 
        this.r = r; 
    }
}
export class FadeStart{
    constructor(globals){
        this.globals = globals; 
        this.vScreen = globals.vScreen;
        this.ctx = globals.ctx; 
        this.name = "fadeStart";
    }
    init(){
        circles = []; 
        t = 0; 
        fadeState = "out";
        for(let x = 0; x < this.vScreen.vW + radius; x += dist){
            for(let y = 0; y < this.vScreen.vH + radius; y += dist){
                const c = new Circle(x, y, 0); 
                circles.push(c); 
            }
        }
    }
    update(dt){
        if(fadeState === "out"){
            t += 3 * dt;
            if(t >= 1){
                t = 1; 
                fadeState = "in"; 
                const game = new Game(this.globals); 
                game.init(); 
                this.globals.scenes.splice(this.globals.scenes.length - 2, 1, game); 
            }
        }else if(fadeState === "in"){
            t -= 3 * dt;
            if(t <= 0){
                t = 0; 
                this.globals.scenes.splice(this.globals.scenes.length - 1, 1); 
                this.globals.assets.bgMusic.play();
            }
        }
        for(let i = 0; i < circles.length; i++){
            const circle = circles[i]; 
            circle.r = radius * t; 
        }
    }
    draw(){
        this.ctx.save(); 
        this.vScreen.transform(); 
        for(let i = 0; i < circles.length; i++){
            const circle = circles[i]; 
            this.ctx.fillStyle = "rgb(0, 0, 0)"; 
            this.ctx.beginPath(); 
            this.ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI); 
            this.ctx.fill(); 
        }
        this.ctx.restore(); 
    }
}