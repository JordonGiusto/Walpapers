
function distance(boid1, boid2){
    return Math.sqrt(Math.pow(boid1.x - boid2.x, 2) + Math.pow(boid1.y - boid2.y, 2));
}


canvas = document.getElementById("mainCanvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

boids = [];

mousePos = {x: 0, y: 0};
function updateMousePos(e){
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
}

numBoids = 200;

maxAcceration = 1;
maxSpeed = 3;

separationRadius = 20;
allignmentRadius = 1000;


cohesionFactor = 0.001;
separationFactor = .01;
allignmentFactor = .07;

for(var i = 0; i < numBoids; i++){
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    boids.push({x: x, y: y, vx: 0, vy: 0});
    
}
function drawBoid(boid){
    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.fillRect(boid.x, boid.y, 3, 3);
    ctx.fill();
    ctx.closePath();
}

function addAccel(boid, accel){
    accelMag = Math.sqrt(accel.x * accel.x + accel.y * accel.y);
    if(accelMag > maxAcceration){
        accel.x = accel.x / accelMag * maxAcceration;
        accel.y = accel.y / accelMag * maxAcceration;
    }
    boid.vx += accel.x;
    boid.vy += accel.y;
    boidVMag = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    if(boidVMag > maxSpeed){
        boid.vx = boid.vx / boidVMag * maxSpeed;
        boid.vy = boid.vy / boidVMag * maxSpeed;
    }
}
function cohesion(boid, boids){
    mouseCohesion = {x: 0, y: 0};
    mouseCohesion.x = mousePos.x - boid.x;
    mouseCohesion.y = mousePos.y - boid.y;
    return mouseCohesion;
    cohesionAccel = {x: 0, y: 0};
    for(var i = 0; i < boids.length; i++){
        if(boids[i] != boid){
            cohesionAccel.x += boids[i].x - boid.x;
            cohesionAccel.y += boids[i].y - boid.y;
        }
    }
    cohesionAccel.x = cohesionAccel.x / boids.length;
    cohesionAccel.y = cohesionAccel.y / boids.length;
    return cohesionAccel;
}
function separation(boid, boids){
    count = 0;
    separationAccel = {x: 0, y: 0};
    for(var i = 0; i < boids.length; i++){
        if(boids[i] != boid && distance(boid, boids[i]) < separationRadius){
            separationAccel.x += boid.x - boids[i].x;
            separationAccel.y += boid.y - boids[i].y;
            count++;
        }
    }
    if(count > 0){
        separationAccel.x = separationAccel.x / count;
        separationAccel.y = separationAccel.y / count;
        return separationAccel;
    }
    return null;
    
}
function allignment(boid, boids){
    count = 0;
    allignmentAccel = {x: 0, y: 0};
    for(var i = 0; i < boids.length; i++){
        if(boids[i] != boid && distance(boid, boids[i]) < allignmentRadius){
            allignmentAccel.x += boids[i].vx;
            allignmentAccel.y += boids[i].vy;
            count++;
        }
    }
    if(count > 0){
        allignmentAccel.x = allignmentAccel.x / count;
        allignmentAccel.y = allignmentAccel.y / count;
        return allignmentAccel;
    }
    return {x: 0, y: 0};
}
function run(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < boids.length; i++){
        boid = boids[i];
        accel = {x: 0, y: 0};
        coh = cohesion(boid, boids);
        sep = separation(boid, boids);
        all = allignment(boid, boids);
        if(sep != null){
            accel.x += sep.x*separationFactor;
            accel.y += sep.y*separationFactor;
        }
        else{
            accel.x += coh.x * cohesionFactor;
            accel.x += all.x * allignmentFactor;
            accel.y += coh.y * cohesionFactor;
        }
        
        addAccel(boid, accel);
    }
    for(var i = 0; i < boids.length; i++){
        boid = boids[i];
        boid.x += boid.vx;
        boid.y += boid.vy;
        if(boid.x > canvas.width){
            boid.x = 0;
        }
        if(boid.x < 0){
            boid.x = canvas.width;
        }
        if(boid.y > canvas.height){
            boid.y = 0;
        }
        if(boid.y < 0){
            boid.y = canvas.height;
        }
        drawBoid(boid);
    }
    
    requestAnimationFrame(run);
}
//console.log(boids);
window.addEventListener("mousemove", updateMousePos);
 requestAnimationFrame(run);
