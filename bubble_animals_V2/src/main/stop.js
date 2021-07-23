import { ImgButton, isInButton } from "../core/tool";
let playButton; 
export class Stop{
    constructor(globals){
        this.globals = globals; 
        this.name = "stop";
        this.ctx = globals.can.getContext("2d"); 
        this.scaleTitle = globals.config.scaleTitle;
    }
    init(){
        this.globals.assets.bgMusic.pause();
        const img = this.globals.assets.imgPlay; 
        const scalePlay = Math.floor(5 * this.scaleTitle); 
        const x = this.globals.can.width / 2 - img.width * scalePlay / 2; 
        const y = this.globals.can.height / 2 - img.height * scalePlay / 2; 
        playButton = new ImgButton(img, x, y, scalePlay); 
    }
    update(dt){
        if(this.globals.mouse.etatOn){
            const rect = this.globals.can.getBoundingClientRect();
            let x = this.globals.mouse.x - rect.left; 
            let y = this.globals.mouse.y - rect.top; 
            if(isInButton(x, y, playButton)){
                this.globals.mouse.etatOn = false; 
                this.globals.scenes.pop();
                this.globals.assets.bgMusic.play();
            }
        }
    }
    draw(){
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fillRect(0, 0, this.globals.can.width, this.globals.can.height);
        playButton.draw(this.ctx)
    }
    drawPlay = (ctx, img, startX, startY, endX, endY, scale) =>{
        const x = (startX + endX) / 2 - img.width * scale /2; 
        const y = (startY + endY) / 2 - img.height * scale / 2; 
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale); 
    }
}