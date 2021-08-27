const sizeCube = 1;
const maxLevel = 90; 
const gapButtonH = 12; 
const gapButtonW = 16; 
const sizeButton = 48; 
const initLevel = 1; 
const colorsLB = [[255, 255, 255, 0.7], [20, 50, 20, 0.7]]; 

let transX, transY, levelButtons; 
let currentGrid, limitGrid, maxCol; 
let listBoxes, nbPoints, player, stack;
let gameState, level, oldTime, completeLevels; 
let scene, camera, renderer, textureBrick, textureBox, texturePlayer; 
let can3D, can2D, ctx, pTag, canW, canH; 
let imgFontOrange, letterQuads; 
let music, levelupSound; 


class Quad{
    constructor(x, y, w, h){
        this.x = x; 
        this.y = y; 
        this.w = w - 0.1; //Pour éviter le "edge bleeding"
        this.h = h - 0.1; 
    }
}

class Button {
    constructor(text, x, y, w, h, scale, bgColor){
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w; 
        this.h = h;
        this.scale = scale; 
        this.bgColor = bgColor; 
        this.current = false; 
    }
    draw(ctx){
        ctx.fillStyle = convertRGBA(this.bgColor);
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "rgb(255, 255, 0)"; 
        ctx.lineWidth = 5; 
        if(this.current){
            ctx.strokeRect(this.x, this.y, this.w, this.h); 
        }
        drawText(ctx, this.text, this.x, this.y, this.x + this.w, this.y + this.h, this.scale);
    }
}


window.onload=initialisation
function initialisation(){
    can3D = document.querySelector("#zone_3D"); 
    can2D = document.querySelector("#zone_2D"); 
    ctx = can2D.getContext("2d"); 
    canW = can3D.width; 
    canH = can3D.height; 
    transX = (canW - (gapButtonW + sizeButton) * 10) / 2 + gapButtonW / 2; 
    transY = (canH - (gapButtonH + sizeButton) * 9) / 2 + gapButtonH / 2; 
    pTag = document.querySelector("p"); 
    renderer = new THREE.WebGLRenderer({canvas: can3D}); 
    camera = new THREE.PerspectiveCamera(75, canW / canH, 0.1, 1000);  
    camera.lookAt(0, 0, 0);
    letterQuads = getLetterQuads(12, 13, 12, 13); 
    loadImages(); 
    loadSounds(); 
    loadTextures(); 
    initGame();
    document.addEventListener("keydown", function(e){
        move(e);
    })
    document.getElementById("allLevels").addEventListener("click", function(){
        gameState = "pause";
    });
    document.getElementById("previousLevel").addEventListener("click", function(){
        levelButtons[level-1].current = false;
        level--;
        if (level <= 0){
          level = levelGrid.length;
        }
        loadLevel(level);
    });
    document.getElementById("nextLevel").addEventListener("click", function(){
        levelButtons[level-1].current = false;
        level++;
        if (level > levelGrid.length){
          level = 1;
        }
        loadLevel(level);
    });
    document.getElementById("restart").addEventListener("click", function(){
        loadLevel(level);
    });
    document.getElementById("undo").addEventListener("click", function(){
        undo(); 
    });
    can2D.addEventListener("click", function(e){
        if(gameState === "pause"){
            const rect = can2D.getBoundingClientRect(); 
            const x = e.clientX - rect.left - transX; 
            const y = e.clientY - rect.top - transY; 
            findButton(x, y);
        }
    })
    requestAnimationFrame(gameLoop);
}


function initGame(){
    gameState = "play";
    level = initLevel; 
    oldTime = 0;
    if(typeof(Storage)!="undefined"){
        if(localStorage.sokoban_completeLevels){
            completeLevels = JSON.parse(localStorage.sokoban_completeLevels);
            
        }else{
            initCompleteLevels(); 
        }
    }else {
        initCompleteLevels(); 
    }
    initMenu();
    loadLevel(level);
}

function initCompleteLevels(){
    completeLevels = []; 
    for(let i = 0; i < maxLevel; i++){
        completeLevels[i] = 0;
    }
}

function initMenu(){
    levelButtons = [];
    for(let i = 0; i < maxLevel; i++){
        const r = Math.floor( i / 10); 
        const c = i % 10; 
        //[20, 50, 20, 0.6]
        const button = new Button((i+1).toString(),  c * (gapButtonW + sizeButton), r * (gapButtonH + sizeButton), sizeButton, sizeButton, 1.5, colorsLB[completeLevels[i]]);
        levelButtons.push(button); 
    }
    
}

function isInButton(x, y, button){
    if(x >= button.x && x <= button.x + button.w && y >= button.y  && y <= button.y + button.h){
        return true; 
    }
    return false; 
}

function findButton(x, y) {
    for(let i = 0; i < levelButtons.length; i++){
        const button = levelButtons[i]; 
        if(isInButton(x, y, button)){
            const targetedLevel = Number(button.text);
            gameState = "play"; 
            if(level !== targetedLevel){
                levelButtons[level-1].current = false;
                level = targetedLevel; 
                loadLevel(level); 
            }
            break; 
        }
    }
}

function drawText(ctx, text, startX, startY, endX, endY, scale){
    const nbLetters = text.length; 
    const quad = letterQuads["A"]; 
    const gap = 0; 
    let maxWidth = (nbLetters * (gap + quad.w) - gap) * scale; 
    const x = (startX + endX) / 2; 
    const y = (startY + endY) / 2; 
    for(let i = 0; i < nbLetters; i++){
        const quad = letterQuads[text[i]]; 
        const dx = x - maxWidth / 2 + i * (gap + quad.w) * scale;
        const dy = y - quad.h * scale / 2; 
        ctx.drawImage(imgFontOrange, quad.x, quad.y, quad.w, quad.h, dx, dy, Math.floor(quad.w*scale) + 1, Math.floor(quad.h*scale) + 1); 
    }
    return scale; 
}


function convertRGBA(colorArray) {
    return `rgba(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]}, ${colorArray[3]})`; 
}
  

function getLetterQuads(tsW, tsH, w, h) {
    let quads = {}; 
    for(let i=0; i<=9; i++){
        let quad = new Quad(i * tsW, tsH, w, h); 
        quads[i.toString()] = quad;
    }
    quads[" "] = new Quad(0, 0, w, h); 
    quads[":"] = new Quad(10 * tsW, tsH, w, h); 
    const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", 
                        "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
                        "W", "X", "Y","Z"]; 
    for(let i=0; i<26; i++){
        let quad;
        if(i<15){
            quad = new Quad((i+1) * tsW, 2 * tsH, w, h); 
        }else if(i<26){
            quad = new Quad((i-15) * tsW, 3 * tsH, w, h); 
        }
        quads[alphabets[i]] = quad; 
    }
    return quads;
}

function loadImages(){
    imgFontOrange = new Image(); 
    imgFontOrange.src = "images/imgFont.png"; 
}

function loadSounds(){
    music = new Audio(); 
    music.src = "sounds/music.ogg";
    music.loop = true; 
    music.play(); 
    levelupSound = new Audio(); 
    levelupSound.src = "sounds/levelup.wav"; 
}

function loadTextures(){
    textureBrick = new THREE.TextureLoader().load("images/ts.png");
    textureBrick.repeat.x = 1 / 8; 
    textureBrick.repeat.y = 1 / 5; 
    textureBrick.offset.x = 7 / 8; 
    textureBrick.offset.y = 3 / 5; 
    textureBox = new THREE.TextureLoader().load("images/ts.png");
    textureBox.repeat.x = 26 / 256; 
    textureBox.repeat.y = 26 / 160 ; 
    textureBox.offset.x = 34 / 256; 
    textureBox.offset.y = 0;  
    texturePlayer = new THREE.TextureLoader().load("images/player.png");
    texturePlayer.repeat.x = 1 / 3; 
    texturePlayer.repeat.y = 1 / 4; 
    texturePlayer.offset.x = 0; 
    texturePlayer.offset.y = 0; 
}


function loadLevel(pLevel){
    pTag.innerText = "Level: " + pLevel; 
    camera.position.set(0, -12, 14); 
    scene = new THREE.Scene(); 
    //scene.fog = new THREE.Fog(0xFFFFFF, 10, 100); // can't work
    currentGrid = levelGrid[pLevel - 1];
    levelButtons[pLevel - 1].current = true; 
    limitGrid = [];
    maxCol = 0;
    listBoxes = [];
    player = {};
    nbPoints = 0;
    stack = [];
    for (let r = 0; r < currentGrid.length; r++){
        if(currentGrid[r].length > maxCol){
            maxCol = currentGrid[r].length;
        }
        for(let c = 0; c < currentGrid[r].length; c++){
            if (currentGrid[r][c] === "@"){
                addPlayer(r, c);
            }else if (currentGrid[r][c] === "$"){
                addBox(sizeCube * 0.75, r, c);
            }else if (currentGrid[r][c] === "."){
                nbPoints++;
                addPoint(sizeCube / 4, r, c);
            }else if (currentGrid[r][c] === "#"){
                addBrick(sizeCube, r, c);
            }

        }
    }
    limitesWall();
    scene.translateX(- maxCol / 2 * sizeCube); 
    scene.translateY(currentGrid.length / 2 * sizeCube); 
}



function limitesWall(){
    for(let r = 0; r < currentGrid.length; r++){
        limitGrid[r] = [];
        for(let c = 0; c < currentGrid[r].length; c++){
            limitGrid[r][c] = 1;
        }
    }
    // limiter les murs de gauche à droite; 
    for(let r = 0; r < currentGrid.length; r++){
        let c = 0;
        let char = currentGrid[r][c];
        while (char !== "#"){
            limitGrid[r][c] = 0; 
            c++;
            if (c < currentGrid[r].length){
                char = currentGrid[r][c];
            } 
        }
        if (c < currentGrid[r].length - 1){
            c = currentGrid[r].length - 1;
            char = currentGrid[r][c];
            while (char !== "#"){
                limitGrid[r][c] = 0;
                c--;
                if (c >= 0){
                    char = currentGrid[r][c];
                } 
            }
        }
    }

    // limiter les murs de haut à bas; 
    for(let c = 0; c < maxCol; c++){
        let r = 0;
        while (r < currentGrid.length && c >= currentGrid[r].length){
            r++;     
        }
        let char = currentGrid[r][c]; 
        while (c < currentGrid[r].length && char !== "#"){
            limitGrid[r][c] = 0;
            r++;
            if (r<currentGrid.length){
                char = currentGrid[r][c];
            }
        }
        if (r < currentGrid.length - 1){
            r = currentGrid.length - 1;
            while (r > 0 && c > currentGrid[r].length - 1){
                r--;
            } 
            let char=currentGrid[r][c];
            while (c <= currentGrid[r].length-1 && char !== "#"){
                limitGrid[r][c] = 0;
                r--;
                if (r>=0){
                    char=currentGrid[r][c];
                } 
            } 
        } 
    }  
    for(let r = 0; r < limitGrid.length; r++){
        for(let c = 0; c < limitGrid[r].length; c++){
            if (limitGrid[r][c] === 1){
                const position = new THREE.Vector3(c * sizeCube, - r * sizeCube, - sizeCube / 2);
                if(currentGrid[r][c] !== "#"){
                    addRectangle(sizeCube, position, 'rgb(20, 50, 20)');
                }
            }
        }
    }
}

function addBrick(size, r, c){
    const geometry = new THREE.BoxGeometry(size, size, size); 
    const material = new THREE.MeshBasicMaterial({map: textureBrick}); 
    const cube = new THREE.Mesh(geometry, material); 
    cube.position.set(c * sizeCube, - r * sizeCube, 0);
    const brick = {r: r, c: c, body: cube};
    scene.add(brick.body); 
}

function addBox(size, r, c){
    const geometry = new THREE.BoxGeometry(size, size, size); 
    const material = new THREE.MeshBasicMaterial({map: textureBox}); 
    const cube = new THREE.Mesh(geometry, material); 
    cube.position.set(c * sizeCube, - r * sizeCube, 0);
    const box = {
        r: r, 
        c: c, 
        body: cube, 
        updatePosition: function(){
            this.body.position.set(this.c * sizeCube, - this.r * sizeCube, 0); 
        }
    };
    scene.add(box.body); 
    listBoxes.push(box); 
}

function addPlayer(r, c){
    const material = new THREE.SpriteMaterial( {map: texturePlayer} );
    const sprite = new THREE.Sprite(material);
    sprite.position.set(c * sizeCube, - r * sizeCube, 0);
    player = {
        r: r, 
        c: c, 
        dir: 0, 
        timerAnimation: 1/6, 
        timer: 1/6, 
        body: sprite,
        updatePosition: function(){
            this.body.position.set(this.c * sizeCube, - this.r * sizeCube, 0); 
        }, 
        updateAnimation: function(dt){
            this.timer -= dt; 
            if(this.timer <= 0){
                texturePlayer.offset.x += 1 / 3; 
                if (texturePlayer.offset.x >= 1){
                    texturePlayer.offset.x = 0; 
                }
                this.timer = this.timerAnimation; 
            }
        }
    };
    scene.add(player.body);
}

function addPoint(size, r, c){
    const geometry = new THREE.CircleGeometry(size, 16);
    const material = new THREE.MeshBasicMaterial( { color: 'rgb(100, 50, 100)'} );
    // Create the final object to add to the scene
    const circle = new THREE.Mesh( geometry, material);
    circle.position.set(c * sizeCube, - r * sizeCube, - sizeCube / 2 + 0.01);
    circle.scale.setY(1.5); 
    scene.add(circle);
}


function addRectangle(size, position, color){
    const geometry = new THREE.PlaneGeometry(size, size); 
    const material = new THREE.MeshBasicMaterial({color: color}); 
    const rect = new THREE.Mesh(geometry, material); 
    rect.position.set(position.x, position.y, position.z);
    scene.add(rect); 
}


function move(e){
    let key = e.key;
    if (gameState === "play"){
        inputPlay(key);
    }else if(gameState === "gameover"){
        if(key === "Enter"){
            gameState = "play"; 
            level = initLevel; 
            loadLevel(level); 
        }
    }
}


function isSolid(pR, pC) {
    if (currentGrid[pR][pC] === "#" || isMoveable(pR, pC)) {
        return true;
    }
    return false;
}

function isMoveable(pR, pC){
    for (let i=0; i<listBoxes.length; i++) {
        let box=listBoxes[i]
        if (box.r==pR && box.c==pC){
            return true
        }
    }
    return false
}

function findBox(pR, pC){
    for (let i = 0; i < listBoxes.length; i++) {
        let box = listBoxes[i];
        if (box.r === pR && box.c === pC){
            return box;
        }
    }
}


function moveup(){
    player.r--;
    player.updatePosition();
}

function movedown(){
    player.r++;
    player.updatePosition();
}

function moveright(){
    player.c++;
    player.updatePosition();
}

function moveleft(){
    player.c--;
    player.updatePosition();
}

function pushup(){
    let box = findBox(player.r-1, player.c);
    box.r--;
    box.updatePosition(); 
    player.r--;
    player.updatePosition();
}

function gobackup(){
    let box = findBox(player.r + 1, player.c)
    box.r--; 
    box.updatePosition();
    player.r--; 
    player.updatePosition(); 
}

function pushright(){
    let box = findBox(player.r, player.c + 1);
    box.c++; 
    box.updatePosition(); 
    player.c++;
    player.updatePosition(); 
}

function gobackright(){
    let box = findBox(player.r, player.c - 1)
    box.c++; 
    box.updatePosition(); 
    player.c++; 
    player.updatePosition();
}

function pushdown(){
    let box = findBox(player.r + 1, player.c)
    box.r++;
    box.updatePosition(); 
    player.r++;
    player.updatePosition(); 
}

function gobackdown(){
    let box = findBox(player.r - 1, player.c)
    box.r++; 
    box.updatePosition(); 
    player.r++; 
    player.updatePosition(); 
}

function pushleft(){
    let box = findBox(player.r, player.c - 1);
    box.c--; 
    box.updatePosition(); 
    player.c--;
    player.updatePosition(); 
}


function gobackleft(){
    let box = findBox(player.r, player.c + 1);
    box.c--;
    box.updatePosition(); 
    player.c--;
    player.updatePosition(); 
}
 
function inputPlay(key){
    if(key === "ArrowUp" || key === "ArrowRight" || key === "ArrowDown" || key === "ArrowLeft"){
        if(key === "ArrowUp"){
            player.dir = 0; 
            if(!isSolid(player.r - 1, player.c)){
                moveup(); 
                stack.push("moveup");
            }else if (isMoveable(player.r - 1, player.c) && player.r - 2 >= 0 && !isSolid(player.r - 2, player.c)){
                pushup();
                stack.push("pushup")
            }
        }else if(key === "ArrowRight"){
            player.dir = 1; 
            if(!isSolid(player.r, player.c + 1)){
                moveright();
                stack.push("moveright");
            }else if (isMoveable(player.r, player.c + 1) && player.c + 2 < currentGrid[player.r].length && !isSolid(player.r, player.c + 2)){
                pushright();
                stack.push("pushright");
            }
        }else if(key === "ArrowDown"){
            player.dir = 3; 
            if(!isSolid(player.r + 1, player.c)){
                movedown(); 
                stack.push("movedown");
            }else if (isMoveable(player.r + 1, player.c) && player.r + 2 < currentGrid.length && !isSolid(player.r + 2, player.c)){
                pushdown(); 
                stack.push("pushdown"); 
            }
        }else if(key === "ArrowLeft"){
            player.dir = 2; 
            if(!isSolid(player.r, player.c - 1)){
                moveleft()
                stack.push("moveleft");
            }else if (isMoveable(player.r, player.c - 1) && player.c - 2 >= 0 && !isSolid(player.r, player.c - 2)){
                pushleft()
                stack.push("pushleft");
            }
        }
    }
}

function undo(){
    let action = stack.pop(); 
    if(action === "moveup"){
        movedown();
        player.dir = 0; 
    }else if(action === "movedown"){
        moveup(); 
        player.dir = 3; 
    }else if(action === "moveright"){
        moveleft();
        player.dir = 1; 
    }else if(action === "moveleft"){
        moveright();
        player.dir = 2; 
    }else if(action === "pushup"){
        gobackdown();
        player.dir = 0; 
    }else if(action === "pushdown"){
        gobackup();
        player.dir = 3;
    }else if(action === "pushright"){
        gobackleft();
        player.dir = 1; 
    }else if(action === "pushleft"){
        gobackright(); 
        player.dir = 2; 
    }
}

function victoryLevel(){
    let count=0
    for(let i=0; i<listBoxes.length; i++){
        let box=listBoxes[i]
        if (currentGrid[box.r][box.c]=="."){
            count++
        }
    }  
    if (count==nbPoints){
      return true
    } 
    return false
}


function update(dt){
    if (gameState === "play"){
        if(Math.abs(camera.position.y-(-2))<0.1){
            camera.position.y=-2
        }else{
            camera.position.y=lerp(camera.position.y,-2,0.05)
        }
        camera.lookAt(0,0,0)
        player.updateAnimation(dt);
        if (victoryLevel()){
            completeLevels[level-1] = 1; 
            localStorage.sokoban_completeLevels = JSON.stringify(completeLevels); 
            levelButtons[level -1].bgColor = [20, 50, 20, 0.6];
            if(!victoryGame()){
                levelButtons[level-1].current = false;
                level++; 
                while(completeLevels[level-1] === 1){
                    level++; 
                    if(level>levelGrid.length){
                        level = 1; 
                    }
                }
                levelupSound.play();
                loadLevel(level);
            }else {
                gameState="gameover"; 
            }
        }
    }
}

function victoryGame(){
    for(let i = 0; i < completeLevels.length; i++){
        if(completeLevels[i] === 0){
            return false;
        }
    }
    return true;
}



function lerp(a,b,t){
    return (1-t)*a+t*b
}


function draw(){
    texturePlayer.offset.y = player.dir / 4; 
    renderer.render(scene, camera);
    if(gameState === "pause"){
        drawMenu(); 
    }else if(gameState === "gameover"){
        drawGameover(); 
    }else if(gameState === "play"){
        ctx.clearRect(0, 0, canW, canH);
    }
}



function drawMenu(){
    ctx.fillStyle = "rgb(0, 0, 0)"; 
    ctx.fillRect(0, 0, canW, canH);
    ctx.save(); 
    ctx.translate(transX, transY); 
    for(let i = 0; i < levelButtons.length; i++){
        const button = levelButtons[i]; 
        button.draw(ctx);
    }
    ctx.restore();
}


function drawGameover(){
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, canW, canH);

    ctx.textAlign = "center"; 

    ctx.fillStyle="rgb(128, 255, 255)"
    const fontSize1 = 40; 
    ctx.font = fontSize1 + "px Arial";
    let y=(canH - fontSize1)/3
    ctx.fillText("Congratulations !", canW / 2, y)

    ctx.fillStyle="white"
    const fontSize2 = 30; 
    ctx.font = fontSize2 + "px Arial"; 
    y += 3 * fontSize2; 
    ctx.fillText("Amazing, you have finished all levels. ", canW / 2, y)

    y += 3 * fontSize2; 
    ctx.fillText("Enter to restart the game.", canW / 2, y)
}


function gameLoop(time){
    if(oldTime!=0){
        dt = (time - oldTime)/1000;
    }else {
        dt = 0;
    }
    update(dt);
    draw();
    oldTime = time;
    requestAnimationFrame(gameLoop);
}





/* intéressant d'utiliser le label dans 3D.
function makeGameoverObject(){
    scene = new THREE.Scene(); 
    const newCan = makeGameoverCanvas(); 
    const texture = new THREE.CanvasTexture(newCan);
    const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
    });
    const label = new THREE.Sprite(labelMaterial);
    label.position.set(0, 0, 0);
    label.scale.set(16, 12, 1); 
    scene.add(label);
}

function makeGameoverCanvas(){
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = canW; 
    ctx.canvas.height = canH; 
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, canW, canH);

    ctx.textAlign = "center"; 

    ctx.fillStyle="rgb(128, 255, 255)"
    const fontSize1 = 50; 
    ctx.font = fontSize1 + "px Arial";
    let y=(canH - fontSize1)/3
    ctx.fillText("Congratulations !", canW / 2, y)

    ctx.fillStyle="white"
    const fontSize2 = 40; 
    ctx.font = fontSize2 + "px Arial"; 
    y += 3 * fontSize2; 
    ctx.fillText("Amazing, you have finished all levels. ", canW / 2, y)

    y += 3 * fontSize2; 
    ctx.fillText("Enter to restart the game.", canW / 2, y)
    return ctx.canvas; 
}
*/