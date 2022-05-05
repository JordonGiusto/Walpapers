canvas = document.getElementById("mainCanvas");
ctx = canvas.getContext("2d");


//the folowwing scales the canvas to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

sun = {
    name: "Sun",
    radius: .1,
}

config = {
    lerpSmothness: 0.95,

    maxTimeScale: 5,
    minTimeScale: 0.001,
    timeScale: .1,
    targetTimeScale: .1,
    radiusScale: 1/50,
    maxOrbitScale: 1000,
    minOrbitScale: 40,
    orbitScale: 50,
    targetOrbitScale: 50,
    orbitPower: 4/10,
    name: true,
    textScale: 20,
    mouseX: 0,
    mouseY: 0,
    sideBarSize: 200,
    origin: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        planet: sun
    },
    font: "bold 20px monospace",

    sunRadiantOfset: 0,
    sunRadiantSpeed : .01,

}

planets = [
    {
        name: "Mercury",
        color: "grey",
        radius: 0.38,
        oritalRadius: 0.39,
        orbitalPeriod: 88,
        orbitalPosition: 0,
    },
    {
        name: "Venus",
        color: "grey",
        radius: 0.95,
        oritalRadius: 0.72,
        orbitalPeriod: 224,
        orbitalPosition: 0,
    },
    {
        name: "Earth",
        color: "blue",
        radius: 1,
        oritalRadius: 1,
        orbitalPeriod: 365,
        orbitalPosition: 0
    },
    {
        name: "Mars",
        color: "red",
        radius: 0.53,
        oritalRadius: 1.52,
        orbitalPeriod: 687,
        orbitalPosition: 0
    },
    {
        name: "Jupiter",
        color: "orange",
        radius: 11.2,
        oritalRadius: 5.20,
        orbitalPeriod: 4332,
        orbitalPosition: 0
    },
    {
        name: "Saturn",
        color: "yellow",
        radius: 9.45,
        oritalRadius: 9.54,
        orbitalPeriod: 10759,
        orbitalPosition: 0
    },
    {
        name: "Uranus",
        color: "cyan",
        radius: 4.01,
        oritalRadius: 19.20,
        orbitalPeriod: 30688,
        orbitalPosition: 0
    },
    {
        name: "Neptune",
        color: "blue",
        radius: 3.88,
        oritalRadius: 30.05,
        orbitalPeriod: 60190,
        orbitalPosition: 0
    },
    {
        name: "Pluto",
        color: "grey",
        radius: 0.18,
        oritalRadius: 39.48,
        orbitalPeriod: 90560,
        orbitalPosition: 0
    }
]



var myFont = new FontFace('myFont', 'url(nasalization/nasalization-rg.otf)');

myFont.load().then(function(font){
    document.fonts.add(font);
    config.font = font.family + " " + config.textScale + "px";
});


drawSun();
update();


//function that takes a mousemove event and updates the config.mouseX and config.mouseY variables
function updateMouse(e) {
    config.sideBarSize = canvas.width*.05;
    x = config.mouseX = e.clientX;
    y = config.mouseY = e.clientY;
    if(x>canvas.width-config.sideBarSize) {
        config.targetTimeScale = ((canvas.height-y)/canvas.height)*(config.maxTimeScale-config.minTimeScale)+config.minTimeScale;
    }
    if(y<config.sideBarSize) {
        config.targetOrbitScale = (x/canvas.width)*(config.maxOrbitScale-config.minOrbitScale)+config.minOrbitScale;
    }
}

//add mousemove event listener to window
window.addEventListener("mousemove", updateMouse);

//add mouseclick event listener to window
window.addEventListener("click", click);


//function called when mouse is clicked
function click() {
    let mousePosition = {
        x: config.mouseX,
        y: config.mouseY
    }
    for(let i = 0; i < planets.length; i++) {
        let transformedRadius = Math.pow(planets[i].oritalRadius, config.orbitPower) * config.orbitScale;
        let xcoord = canvas.width / 2 + transformedRadius * Math.cos(planets[i].orbitalPosition);
        let ycoord = canvas.height / 2 + transformedRadius * Math.sin(planets[i].orbitalPosition);
        let transformedPoint = transformPoint(xcoord, ycoord);
        let distance = Math.sqrt(Math.pow(transformedPoint.x - mousePosition.x, 2) + Math.pow(transformedPoint.y - mousePosition.y, 2));


        if(distance < planets[i].radius * config.radiusScale * config.orbitScale) {
            config.origin.x = xcoord;
            config.origin.y = ycoord;
            config.origin.planet = planets[i];
        }
    }
    transforedSun = transformPoint(canvas.width / 2, canvas.height / 2);
    distanceToSun = Math.sqrt(Math.pow(transforedSun.x - mousePosition.x, 2) + Math.pow(transforedSun.y - mousePosition.y, 2));
    if(distanceToSun < sun.radius * config.radiusScale * config.orbitScale*300) {
        config.origin.x = canvas.width / 2;
        config.origin.y = canvas.height / 2;
        config.origin.planet = sun;
    }
}

//function to update config.origin based on config.planets position
function updateOrigin() {
    if(config.origin.planet == sun) {
        config.origin = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            planet: sun
        }
        return;
    } 
    let transformedRadius = Math.pow(config.origin.planet.oritalRadius, config.orbitPower) * config.orbitScale;
    let xcoord = canvas.width / 2 + transformedRadius * Math.cos(config.origin.planet.orbitalPosition);
    let ycoord = canvas.height / 2 + transformedRadius * Math.sin(config.origin.planet.orbitalPosition);
    config.origin.x = xcoord;
    config.origin.y = ycoord;
}


//sets the interval to call the drawPlanets function every tenth of a second
setInterval(update, 10);

//a function that tranforms a point to the positions on the canvas using config.origin as the center of the canvas
function transformPoint(x, y) {
    return {
        x: x - config.origin.x+canvas.width/2,
        y: y - config.origin.y+canvas.height/2
    }
}
//overload of transformPoint for json object




//the following is a function that draws the sun on the canvas
function drawSun() {
    ctx.beginPath();
    
    config.sunRadiantOfset+=config.sunRadiantSpeed;
    if(config.sunRadiantOfset>1) {
        config.sunRadiantOfset = 0;
    }

    //traform point to the position on the canvas
    let transformedPoint = transformPoint(canvas.width / 2, canvas.height / 2);
    ctx.arc(transformedPoint.x, transformedPoint.y, sun.radius * config.radiusScale*config.orbitScale, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();
    //draw glow around sun
    let steps = 50;
    let glowSize = sun.radius * config.radiusScale * config.orbitScale * 300;
    for(let i = 0; i < steps; i++) {
        let radius = sun.radius * config.radiusScale * config.orbitScale + i * glowSize  / steps;
        radius += config.sunRadiantOfset* glowSize  / steps;
        ctx.beginPath();
        ctx.arc(transformedPoint.x, transformedPoint.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 0, " + .1*Math.pow(1-((radius-sun.radius * config.radiusScale * config.orbitScale))/(glowSize - sun.radius * config.radiusScale * config.orbitScale),2) + ")";
        ctx.fill();
    }
    ctx.closePath();
}

//the following is a function that draws the planets on the canvas
function update() {
    updateOrigin();
    config.timeScale = config.timeScale * config.lerpSmothness + config.targetTimeScale * (1 - config.lerpSmothness);
    config.orbitScale = config.orbitScale * config.lerpSmothness + config.targetOrbitScale * (1 - config.lerpSmothness);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //sets canvas background to black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawOrbits();
    drawOrbitPaths();
    for (var i = 0; i < planets.length; i++) {
        ctx.beginPath();
        let transformedRadius = Math.pow(planets[i].oritalRadius, config.orbitPower) * config.orbitScale;
        let xcoord = canvas.width / 2 + transformedRadius * Math.cos(planets[i].orbitalPosition);
        let ycoord = canvas.height / 2 + transformedRadius * Math.sin(planets[i].orbitalPosition);
        let transformedPoint = transformPoint(xcoord, ycoord);
        ctx.arc(transformedPoint.x, transformedPoint.y, planets[i].radius * config.radiusScale*config.orbitScale, 0, 2 * Math.PI);
        ctx.fillStyle = planets[i].color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.stroke();
        //if the config.name is true, then the planet name is drawn under the planet
        if (config.name) {
            ctx.fillStyle = planets[i].color;
            //sets font to bold capital monospace
            ctx.font = config.textScale + "px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(planets[i].name, transformedPoint.x, transformedPoint.y+planets[i].radius*config.radiusScale+config.textScale);
            }


        ctx.closePath();
        planets[i].orbitalPosition += config.timeScale * (2 * Math.PI) / (planets[i].orbitalPeriod);
    }
    drawSun();
}

// the following is a function that draws the orbits on the canvas
function drawOrbits() {
    ctx.beginPath();
    //set color to tranparent white
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    for (var i = 0; i < planets.length; i++) {
        let transformedRadius = Math.pow(planets[i].oritalRadius , config.orbitPower) * config.orbitScale;
        let xcoord = canvas.width / 2 + transformedRadius * Math.cos(planets[i].orbitalPosition);
        let ycoord = canvas.height / 2 + transformedRadius * Math.sin(planets[i].orbitalPosition);
        let transformedPoint = transformPoint(xcoord, ycoord);
        let transformedOrigin = transformPoint(canvas.width / 2, canvas.height / 2);
        ctx.moveTo(transformedOrigin.x, transformedOrigin.y);
        ctx.lineTo(transformedPoint.x, transformedPoint.y);
    }
    ctx.stroke();
    ctx.closePath();
}
//the folowing is a function that draws the obital paths of the planets as circles
function drawOrbitPaths() {
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    for (var i = 0; i < planets.length; i++) {
        ctx.beginPath();
        let transformedRadius = Math.pow(planets[i].oritalRadius, config.orbitPower) * config.orbitScale;
        let transformedPoint = transformPoint(canvas.width / 2, canvas.height / 2);
        ctx.arc(transformedPoint.x, transformedPoint.y, transformedRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        //console.log(transformedPoint, canvas.width / 2, canvas.height / 2);
    }
}