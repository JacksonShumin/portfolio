
'use strict';

window.onload = init;
let ctx;
let sinkNumber = 0;
let canvasWidth, canvasHeight;
let mousePos = { x:window.innerWidth/2, y:window.innerHeight };
let floatyMouse = { x:window.innerWidth/2, y:window.innerHeight };


function init(){
    // #2 Now that the page has loaded, start drawing!
    console.log('init called');
    document.onmousemove = mouseToCenter;
    document.onresize = mouseToCenter;
    document.onmouseleave = handleMouseExit;
    
    // canvas variable points at <canvas> tag
    var canvas = document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvasWidth = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasHeight = canvas.height;
    
    // resizing the window
    window.onresize = function(e){
        canvas.width = window.innerWidth;
        canvasWidth = window.innerWidth;
        canvas.height = window.innerHeight;
        canvasHeight = canvas.height;

        
        bigCircle();
        flexGrid();
    }

    // the ctx variable points at a "2D drawing context"
    ctx = canvas.getContext('2d');
    
    // draws the backdrop
    bigCircle();
    //triangles(0);
    flexGrid();
    update();
}

function mouseToCenter(event) {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
}

function handleMouseExit(event) {
    mousePos.x = window.innerWidth / 2;
    mousePos.y = window.innerHeight / 2;
}

function lerp(a,b,c){
    return a + (b-a)*c;
}

function flexGrid(){
    ctx.save();
    let delta = 50;
    let height = window.innerHeight / delta;
    let width = window.innerWidth / delta;
    ctx;
    if (window.innerWidth < 900)
    {
        floatyMouse.x = window.innerWidth / 2;
        floatyMouse.y = window.innerHeight / 2;
    }
    
    (floatyMouse.x + window.innerWidth / 2) / 2
    
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            ctx.fillStyle = `rgb(${(50-i)*5}, 0, ${i*5})`;
            let pos = [delta/2+i*delta, delta/2+j*delta];
            let toMouse = [(floatyMouse.x + window.innerWidth / 2) / 2 - pos[0], floatyMouse.y - pos[1]]
            let mag2 = toMouse[0]**2 + toMouse[1]**2;
            let mag = Math.sqrt(mag2);
            let x = pos[0] + toMouse[0] * mag / window.innerWidth * -0.5;
            let y = pos[1] + toMouse[1] * mag / window.innerWidth * -0.5;
            let fade = (mag) / window.innerWidth;
            let radius = mag2/(window.innerWidth**2/100);

            if (x + radius > 0 && x - radius < window.innerWidth && y + radius > 0 && y - radius < window.innerHeight)
            {
                ctx.fillStyle = `rgb(${100*fade}, ${100*fade}, ${100*fade})`;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }

    ctx.restore();
}

// draws things every frame
function update(){
    sinkNumber += 0.5;
    requestAnimationFrame(update);
    floatyMouse.x = lerp(floatyMouse.x, mousePos.x, 0.05);
    floatyMouse.y = lerp(floatyMouse.y, mousePos.y, 0.05);
    
    // draws things in the proper order from back to front
    bigCircle();
    //triangles(sinkNumber);
    flexGrid();
    //drawMouse();
}

function drawMouse(){
    ctx.save();
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 10, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
}

// draws some triangles 
function triangles(deltaY){
    ctx.save();

    ctx.fillStyle = 'rgba(0,255,255,0.2)';

    // that number is root 3 * 50, very important for good looking triangles
    let root3 = 86.6025;

    // draws each triangle in a grid that is offset by delta y
    let triangleWidth = canvasWidth / 100;
    let triangleHeight = canvasHeight / root3;
    for(let i=0; i<triangleWidth+2; i++){
        for(let j=0; j<triangleHeight+2; j++){
            ctx.beginPath();


            let x = i * 100 + 50*(j%2);
            let y = j * root3 - deltaY%172;

            ctx.moveTo(x, y);
            ctx.lineTo(x - 50, y + root3);
            ctx.lineTo(x + 50, y + root3);
            
            ctx.fill();
            ctx.closePath();
        }
    }
    ctx.restore();
}

// draws the large circle backdrop
function bigCircle(){
    ctx.save();
    // for(let i = 70; i>0; i--)
    // {
    //     ctx.beginPath();
    //     //ctx.fillStyle = `rgb(${(50-i)*5}, 0, ${i*5})`;
    //     ctx.fillStyle = `rgb(${(50-i)}, ${(50-i)}, ${(50-i)})`;
    //     ctx.lineWidth = 30;
    //     ctx.arc(canvasWidth/2,canvasHeight/2,i*20,0,Math.PI*2);
    //     ctx.fill();
    //     ctx.closePath();
    // }
    let gradient = ctx.createRadialGradient(window.innerWidth/2, window.innerHeight/2, 30, window.innerWidth/2, window.innerHeight/2, Math.max(window.innerWidth/2,window.innerHeight/2));
    gradient.addColorStop(0, 'rgb(50,50,50)');
    gradient.addColorStop(1, 'rgb(0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    
    
    ctx.restore();
}