import { Menu } from "./menu"; 
import { debugConsole, VirtualScreen } from "../core/tool";
import { Load } from "./loader"; 
//import { Game } from "./game";

const nbAnimalImages = 3; 
const nbBubbleImages = 7; 
const nbRows = 15;
const nbCols = 8;
const radius = 16; 
const gridH = nbRows * radius * Math.sqrt(3); 
const gridW = nbCols * 2 * radius + radius; 
const scorePanelH = 48;
const can = document.querySelector("canvas"); 
const ctx = can.getContext("2d"); 
const ceilH = 10;
const groundH = 10;
const wallS = 10; 
const thresholdH = 8;
const vsWidth = gridW + 2 * wallS; 
const vsHeight = wallS + scorePanelH + ceilH + gridH + radius * Math.sqrt(3) + 6 * radius + wallS; 
let realWidth = document.body.clientWidth; 
let realHeight = document.body.clientHeight; 
// if(!window.cordova){
//     if(realWidth > 600){
//         realWidth = 600; 
//     }
//     if(realHeight > 800){
//         realHeight = 800; 
//     }
// }
can.width = realWidth; 
can.height = realHeight;

const vScreen = new VirtualScreen(ctx, vsWidth, vsHeight, realWidth, realHeight); 
vScreen.setStrategy();

const click = (e) => {
    vScreen.mouseClick = true; 
    vScreen.mouseX = (e.clientX - vScreen.xoffset) / vScreen.xScale ;
    vScreen.mouseY = (e.clientY - vScreen.yoffset ) / vScreen.yScale ;  
}

can.addEventListener("click", (e) => { 
    click(e); 
}, false);


let nbAssets = nbAnimalImages + (nbAnimalImages + 1) * nbBubbleImages + 11;
let oldTime = 0; 
let globals = {
    scenes: [], 
    ctx: ctx, 
    assets: {
        imgAnimals: new Array(nbAnimalImages), 
        imgBubbles: new Array(nbAnimalImages + 1),
        imgFont: null, 
        imgFont_blue: null,
        imgStop: null, 
        imgPlay: null, 
        bgMusic: null,
        deadSound: null, 
        hit1Sound: null, 
        hit2Sound: null, 
        pickupSound: null, 
        powerupSound: null, 
        explodeSound: null
    }, 
    config: {
        nbRows: nbRows, 
        nbCols: nbCols, 
        gridW: gridW, 
        gridH: gridH, 
        radius: radius, 
        scorePanelH: scorePanelH, 
        ceilH: ceilH, 
        groundH: groundH, 
        wallS: wallS,
        thresholdH: thresholdH, 
        scaleTitle: 3
    }, 
    vScreen: vScreen
}


export const enter = (s) =>{
    globals.scenes.push(s); 
    s.init();
}
export const gameLoop = (time) =>{
    if(oldTime === 0){
        const menu = new Menu(globals);
        enter(menu); 
        // const game = new Game(globals); 
        // enter(game); 
    }
    let dt = (time - oldTime) / 1000;
    if(dt >=  5 / 60){
        dt = 2 / 60;
    }
    while (dt >= 1/60 + 0.005){
        globals.scenes[globals.scenes.length - 1].update(1 / 60); 
        dt -= 1 / 60;
    }
    globals.scenes[globals.scenes.length - 1].update(dt);
    // dt = 1 / 60  // à effacer;
    // document.querySelector("select").onchange = () => {
    //     const seed = Number(document.querySelector("select").value); 
    //     Math.reseed(seed); // Bug avec 6, pour un score au-dessus de 750
    //     // -->Corrigé (problème de ligne intermédiaire supprimée, qui fait foirer le floodfill)
    //     globals.scenes[globals.scenes.length - 1].init();
    // }
    // let N = 1; 
    // if(document.getElementById("TURBO").checked){N = 10;}
    // for(let i = 0; i<N; i++){
    //     if(!document.getElementById("HALT").checked){
            //globals.scenes[globals.scenes.length - 1].update(dt); 
    //     }
    // }
    globals.vScreen.mouseClick = false;
    ctx.clearRect(0, 0, globals.vScreen.dW, globals.vScreen.dH);
    for(let i = 0; i < globals.scenes.length; i++){
        const scene = globals.scenes[i]; 
        scene.draw(); 
    }
    oldTime = time;
    requestAnimationFrame(gameLoop);
}

export class Main{
    constructor(){
    }
    start(){
        const load = new Load(globals.assets, nbAssets, nbBubbleImages);
        load.loader();
    }
}


