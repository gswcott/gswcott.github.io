map={}
map.grid=[]
let listWalkers=[]
let maxHoles, countHoles
let maxWalkers=20
let probaDeath=0.2
let probaClone=0.5
let probaChangeDir=0.5

map.initGrid=function(pNbRow, pNbCol){
    map.grid=[]
    for (let r=0; r<pNbRow; r++){
        map.grid[r]=[]
        for (let c=0; c<pNbCol; c++){
            map.grid[r][c]=0
        }
    }
}

map.createWalker=function(pR, pC){
    let walker={}
    walker.r=pR
    walker.c=pC
    walker.dir=Math.floor(Math.random()*4)
    listWalkers.push(walker)
}

map.update=function(){
    //creuser
    for (let i=0; i<listWalkers.length; i++){
        let w=listWalkers[i]
        if (map.grid[w.r][w.c]==0){
            map.grid[w.r][w.c]=1
            countHoles+=1
        }
    } 
    //détruire
    for(let i=listWalkers.length-1; i>=1; i--){
        let w=listWalkers[i]
        if (Math.random()<probaDeath){
            listWalkers.splice(i, 1)
        } 
    } 
    //clone
    for (let i=0; i<listWalkers.length; i++){
        let w=listWalkers[i]
        if (listWalkers.length<maxWalkers){
            if (Math.random()<probaClone){
                map.createWalker(w.r, w.c)
            } 
        }
    }
    //change the direction 
    for (let i=0; i<listWalkers.length; i++){
        let w=listWalkers[i]
        if (Math.random()<probaChangeDir){
            w.dir=Math.floor(Math.random()*4)
        }
    }
    //forward
    for (let i=0; i<listWalkers.length; i++){
        let w=listWalkers[i]
        if (w.dir==0 && w.r>=2) {
            w.r-=1 
        }else if (w.dir==1 && w.c<=map.grid[0].length-3) {
            w.c+=1
        }else if (w.dir==2 && w.r<=map.grid.length-3) {
            w.r+=1
        }else if (w.dir==3 && w.c>=2) {
            w.c-=1 
        }
    }
}

map.createMap=function(pNbRow, pNbCol){
    maxHoles=Math.floor(pNbRow*pNbCol/2)
    map.initGrid(pNbRow, pNbCol)
    listWalkers=[]
    countHoles=0
    let r=Math.floor(Math.random()*(pNbRow-2))+1
    let c=Math.floor(Math.random()*(pNbCol-2))+1
    map.createWalker(r, c)
    while(countHoles<maxHoles){
        map.update()

    } 
}
