import { gameLoop } from "./main";

export class Load{
    constructor(assets, nbAssets, nbBubbleImages){
        this.assets = assets; 
        this.nbAssets = nbAssets;
        this.nbBubbleImages =  nbBubbleImages;
    }
    loader(){
        this.loadImages();
        this.loadSounds();
    }
    loadImages(){
        for (let i = 0; i < this.assets.imgAnimals.length; i++){
            const src =  "images/img" + i + ".png"; 
            this.assets.imgAnimals[i] = this.loadImage(src); 
        }
        for (let i = 0; i < this.assets.imgBubbles.length; i++){
            this.assets.imgBubbles[i] = new Array(this.nbBubbleImages);
            for(let j = 0; j < this.nbBubbleImages; j++){
                const src =  `images/${i}/imgBubble${j}.png`; 
                this.assets.imgBubbles[i][j] = this.loadImage(src); 
            }
        }
        this.assets.imgFont = this.loadImage("images/imgFont.png"); 
        this.assets.imgFont_blue = this.loadImage("images/imgFont_blue.png"); 
        this.assets.imgStop = this.loadImage("images/imgStop.png"); 
        this.assets.imgPlay = this.loadImage("images/imgPlay.png"); 
    }
    loadImage(src){
        const img = new Image();
        img.src = src;
        img.onload = this.counter();
        return img; 
    }
    loadSounds(){
        this.assets.bgMusic = this.loadSound("sounds/bgMusic.mp3"); 
        this.assets.bgMusic.loop = true;
        this.assets.bgMusic.volume = 0;
        this.assets.deadSound = this.loadSound("sounds/dead.wav"); 
        this.assets.hit1Sound = this.loadSound("sounds/hit1.wav"); 
        this.assets.hit2Sound = this.loadSound("sounds/hit2.wav"); 
        this.assets.hit2Sound.volume = 0.6;
        this.assets.pickupSound = this.loadSound("sounds/pickup.wav"); 
        this.assets.pickupSound.volume = 0.6;
        this.assets.powerupSound = this.loadSound("sounds/powerup.wav"); 
        this.assets.explodeSound = this.loadSound("sounds/explosion.wav"); 
    }
    loadSound(src){
        const sound = new Audio();
        sound.src = src;
        sound.addEventListener('canplaythrough', this.counter(), false);
        return sound; 
    }
    counter(){
        this.nbAssets--;
        if(this.nbAssets === 0){
            requestAnimationFrame(gameLoop);
        }
    }
}


