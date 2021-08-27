const sizeCube = 1; 
let map = [[1,1,1,1,1,1,1,1], 
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,1,0,1],
            [1,0,0,1,0,0,0,1],
            [1,0,0,0,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,2,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1]
]; 
let oldTime = 0; 
let player; 
let canEditor, ctxEditor, sizeEditor, canViwer; 
let canW, canH; 
let scene, camera, renderer, textureBrick, texturePlayer; 
let ts, imgPlayer, listQuadsPlayer, quadBrick;
let cameraTargetedRotationY; 

window.onload = setup; 

function setup(){
    canEditor = document.getElementById("editor"); 
    ctxEditor = canEditor.getContext("2d"); 
    sizeEditor = canEditor.width / Math.max(getNbRows(map), getNbCols(map));
    canEditor.addEventListener("click", edit);
    canViewer = document.getElementById("viewer"); 
    canW = canViewer.width; 
    canH = canViewer.height;
    getQuadsPlayer();
    quadBrick=renderQuad(1, 7, 32, 32); 
    loadImages();
    loadTextures(); 
    scene = new THREE.Scene(); 
    camera = new THREE.PerspectiveCamera(75, canW / canH, 0.01, 100);  
    camera.position.set(0, -2, 0);
    cameraTargetedRotationY = camera.rotation.y; 
    renderer = new THREE.WebGLRenderer({canvas: canViewer}); 
    window.addEventListener("keydown", handleKeydown)
    initMap(); 
    requestAnimationFrame(gameLoop);
}

function loadImages(){
    ts = new Image(); 
    ts.src = "images/ts.png"; 
    imgPlayer = new Image(); 
    imgPlayer.src = "images/player.png";
}

function getQuadsPlayer(){
    listQuadsPlayer = []; 
    let dirs=[2, 3, 1, 0]; 
    const cellSize = 32; 
    for(let r=0; r<4; r++){
        listQuadsPlayer[dirs[r]]=[];
        for (let c=0; c<3; c++){
            listQuadsPlayer[dirs[r]][c]=renderQuad(r, c, cellSize, cellSize)
        }
    }
}

function renderQuad(pR, pC, pSizeW, pSizeH){
    let quad={}
    quad.x=pC*pSizeW
    quad.y=pR*pSizeH
    quad.w=pSizeW
    quad.h=pSizeH
    return quad
}


function loadTextures(){
    textureBrick = new THREE.TextureLoader().load("images/ts.png");
    textureBrick.repeat.x = 1 / 8; 
    textureBrick.repeat.y = 1 / 5; 
    textureBrick.offset.x = 7 / 8; 
    textureBrick.offset.y = 3 / 5; 
    texturePlayer = new THREE.TextureLoader().load("images/player.png");
    texturePlayer.repeat.x = 1 / 3; 
    texturePlayer.repeat.y = 1 / 4 - 0.01; 
    texturePlayer.offset.x = 0; 
    texturePlayer.offset.y = 0; 
}

function initMap(){
    for(let r = 0; r < map.length; r++){
        for(let c = 0; c < map[r].length; c++){
            addRectangle(sizeCube, r, c, 'rgb(20, 50, 20)');
            if(map[r][c] === 1){
                addBrick(sizeCube, r, c); 
            }else if(map[r][c] === 2){
                addPlayer(r, c); 
            }
        }
    }
}


function addRectangle(size, r, c, color){
    const geometry = new THREE.PlaneGeometry(size, size); 
    const material = new THREE.MeshBasicMaterial({color: color}); 
    const rect = new THREE.Mesh(geometry, material);
    rect.rotateX(-Math.PI/2); 
    rect.position.set(c * sizeCube, - sizeCube / 2,  r * sizeCube);
    scene.add(rect); 
}


function addBrick(size, r, c){
    const geometry = new THREE.BoxGeometry(size, size, size); 
    const material = new THREE.MeshBasicMaterial({map: textureBrick}); 
    const cube = new THREE.Mesh(geometry, material); 
    cube.name = "brick"+ r + "_" + c; 
    cube.position.set(c * sizeCube, 0, r * sizeCube,);
    const brick = {r: r, c: c, body: cube};
    scene.add(brick.body); 
}

function addPlayer(r, c){
    const material = new THREE.SpriteMaterial( {map: texturePlayer} );
    const sprite = new THREE.Sprite(material);
    sprite.position.set(c * sizeCube, 0,  r * sizeCube);
    player = {
        r: r, 
        c: c, 
        dispr: r, 
        dispc: c,
        dir: 0, 
        timerAnimation: 1/6, 
        timer: 1/6, 
        body: sprite,
        frame: 0, 
        updatePosition: function(){
            this.body.position.set(this.dispc * sizeCube, 0,   this.dispr * sizeCube); 
        }, 
        updateAnimation: function(dt){
            this.timer -= dt; 
            if(this.timer <= 0){
                texturePlayer.offset.x += 1 / 3; 
                this.frame++; 
                if (texturePlayer.offset.x >= 1){
                    texturePlayer.offset.x = 0; 
                    this.frame = 0; 
                }
                this.timer = this.timerAnimation; 
            }
        }
    };
    scene.add(player.body);
}

function lerp(a,b,t){
    return (1-t)*a+t*b;
}

function edit(e){
    const rect = canEditor.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 
    const r = Math.floor(y/sizeEditor) ; 
    const c = Math.floor(x/sizeEditor); 
    if(r !== player.r || c !== player.c){
        const value = getValue(map, r, c);
        if(value === 0){
            addBrick(sizeCube, r, c); 
        }else{
            const name = "brick" + r + "_" + c; 
            removeMesh(name);
        }
        setValue(map, 1-value, r, c);
    }
}

function removeMesh(name){
    for(let i = 0; i < scene.children.length; i++){
        const myMesh = scene.children[i]; 
        if(myMesh.type === "Mesh" && myMesh.name === name){
            scene.remove(myMesh);
            myMesh.geometry.dispose();
            myMesh.material.dispose();
        }
    }
}

function handleKeydown(e){
    let nc = player.c;
    let nr = player.r;
    switch (e.key) {
        case "ArrowUp":
            if(player.dir === 0){
                nr--;
            }else if (player.dir === 1){
                nc++; 
            }else if (player.dir === 2){
                nr++; 
            }else if (player.dir === 3){
                nc--; 
            }
            break;
        case "ArrowLeft": 
            cameraTargetedRotationY = cameraTargetedRotationY + Math.PI / 2;
            //camera.rotation.y = camera.rotation.y  % 2 * Math.PI; 
            player.dir --; 
            if(player.dir < 0){
                player.dir = 3; 
            }
            break;
        case "ArrowRight":
            cameraTargetedRotationY = cameraTargetedRotationY - Math.PI / 2;
            player.dir ++; 
            if(player.dir > 3){
                player.dir = 0; 
            }
            break;
    }
    if(getValue(map, nr, nc) !== 1){
        player.r = nr;
        player.c = nc; 
    }
}

function getNbRows(map){
    return map.length;
}
function getNbCols(map){
    return map[0].length;
}

function getValue(map, r, c){
    const nbRows = getNbRows(map); 
    const nbCols = getNbCols(map);
    if(r >= 0 && r < nbRows && c >= 0 && c < nbCols){
        return map[r][c];
    }
    return 0;
}

function setValue(map, value, r, c){
    const nbRows = getNbRows(map); 
    const nbCols = getNbCols(map);
    if(r >= 0 && r < nbRows && c >= 0 && c < nbCols){
        map[r][c] = value;
    }
}


function update(dt){
    //Smooth player movement
    player.dispr = lerp(player.dispr, player.r, 0.1);
    player.dispc = lerp(player.dispc, player.c, 0.1);
    player.updatePosition(); 
    player.updateAnimation(dt);
    camera.position.set(player.body.position.x, player.body.position.y+0.1 , player.body.position.z);
    camera.rotation.y = lerp(camera.rotation.y, cameraTargetedRotationY, 0.2);
}



function drawEditor(){

    ctxEditor.strokeStyle= "black"; 
    for(let r = 0; r < getNbRows(map); r++){
        for(let c = 0; c < getNbCols(map); c++){
            const value = getValue(map, r, c);
            if(value === 1){
                ctxEditor.drawImage(ts, quadBrick.x, quadBrick.y, quadBrick.w, quadBrick.h, c * sizeEditor, r * sizeEditor, sizeEditor, sizeEditor);
            }else{
                ctxEditor.fillStyle =  "rgb(20, 50, 20)"; 
                ctxEditor.fillRect(c * sizeEditor, r * sizeEditor, sizeEditor, sizeEditor);
            }
            ctxEditor.strokeRect(c * sizeEditor, r * sizeEditor, sizeEditor, sizeEditor);
        }
    }
    const quad = listQuadsPlayer[player.dir][player.frame]; 
    ctxEditor.drawImage(imgPlayer, quad.x, quad.y, quad.w, quad.h, player.dispc * sizeEditor, player.dispr * sizeEditor, sizeEditor, sizeEditor);
}


function draw(){
    drawEditor(); 
    if(player.dir === 3 ){
        texturePlayer.offset.y = 2 / 4; 
    }else if( player.dir === 2){
        texturePlayer.offset.y = 3 / 4; 
    }else {
        texturePlayer.offset.y = player.dir / 4; 
    }
    renderer.render(scene, camera);
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
