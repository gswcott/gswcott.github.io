var entry=""
var stack=new Array()
const outputStack=document.getElementById("stack")
const outputFormula=document.getElementById("zoneFormula")
const b1=document.getElementById("b1")
const b2=document.getElementById("b2")
const b3=document.getElementById("b3")
const b4=document.getElementById("b4")
const b5=document.getElementById("b5")
const b6=document.getElementById("b6")
const b7=document.getElementById("b7")
const b8=document.getElementById("b8")
const b9=document.getElementById("b9")
const b0=document.getElementById("b0")
document.getElementById("bOK").onclick=updateStack
b1.onclick=function(){concat(b1.value); disp()}
b2.onclick=function(){concat(b2.value); disp()}
b3.onclick=function(){concat(b3.value); disp()}
b4.onclick=function(){concat(b4.value); disp()}
b5.onclick=function(){concat(b5.value); disp()}
b6.onclick=function(){concat(b6.value); disp()}
b7.onclick=function(){concat(b7.value); disp()}
b8.onclick=function(){concat(b8.value); disp()}
b9.onclick=function(){concat(b9.value); disp()}
b0.onclick=function(){concat(b0.value); disp()}
document.getElementById("b+").onclick=plus
document.getElementById("b-").onclick=minus
document.getElementById("bX").onclick=time
document.getElementById("b/").onclick=divide
function concat(n){
  if(!(entry=="" && n==0)) entry+=n
}
function disp(){
  outputFormula.innerHTML=entry
}
function showStack(){
  var text="Stack: ";
  for (var i=0; i<stack.length; i++) {
    text= text+ "<div class='myDivStack'>" + stack[i] + "</div>"
  }
  outputStack.innerHTML=text
}
function updateStack() {
  if (entry!="") {
    stack.push(Number(entry))
    showStack()
    entry=""
    disp()
  }
}
function plus() {
  if (stack.length>=2) {
    let b=stack.pop()
    let a=stack.pop()
    stack.push(a+b)
    showStack()
  }
}
function minus() {
  if (stack.length>=2) {
    let b=stack.pop()
    let a=stack.pop()
    stack.push(a-b)
    showStack()
  }
}
function time() {
  if (stack.length>=2) {
    let b=stack.pop()
    let a=stack.pop()
    stack.push(a*b)
    showStack()
  }
}
function divide() {
  if (stack.length>=2) {
    let b=stack.pop()
    let a=stack.pop()
    stack.push(a/b)
    showStack()
  }
}