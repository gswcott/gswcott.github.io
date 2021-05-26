function F2(t){
  let tmp=Math.exp(0.001*t)
  return tmp/(1+tmp)
}
function predictProba(W, X){
  let sum=0
  for(let j=0; j<W.length; j++){
    sum+=W[j]*X[j]
  }
  return F2(sum)
}
function predictLabel(X){
  X.push(1)
  let probas=new Array(10)
  let lsMax=new Array(3)
  let maxProb=0
  probas[0]=predictProba(W0, X)
  probas[1]=predictProba(W1, X)
  probas[2]=predictProba(W2, X)
  probas[3]=predictProba(W3, X)
  probas[4]=predictProba(W4, X)
  probas[5]=predictProba(W5, X)
  probas[6]=predictProba(W6, X)
  probas[7]=predictProba(W7, X)
  probas[8]=predictProba(W8, X)
  probas[9]=predictProba(W9, X)
  maxProb=Math.max(...probas)
  lsMax[0]=probas.indexOf(maxProb)
  probas[lsMax[0]]=-1
  maxProb=Math.max(...probas)
  lsMax[1]=probas.indexOf(maxProb)
  probas[lsMax[1]]=-1
  maxProb=Math.max(...probas)
  lsMax[2]=probas.indexOf(maxProb)
  return lsMax
}
