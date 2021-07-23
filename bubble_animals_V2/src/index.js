import { Main } from "./main/main";

// var AAA=16807
// var MMM=2**31-1
// var XXX=1

// const ff=function(){
//     XXX=(AAA*XXX)%MMM
//     return XXX/MMM
// }

// Math["random"]=ff; 
// Math["reseed"]=function(s){XXX=s;}


if(window.cordova){
    document.addEventListener("deviceready", () => {
        navigator.splashscreen.hide();
        screen.orientation.lock('portrait');
        const main = new Main(); 
        main.start(); 
    }); 
}else {
    const main = new Main(); 
    main.start(); 
}
