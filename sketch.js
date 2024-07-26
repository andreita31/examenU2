var madridTime = [];

var time = {
    hours: 0,
    minutes: 0,
    seconds: 0
}

function setup() {
    let canvas = createCanvas(665, 250);
    canvas.parent('canvasContainer');

}

function getTimeM(){
    const mTime = document.getElementById("mTime").value;
    var madridTime = mTime.split(":");
    time = {
        hours: parseInt(madridTime[0]),
        minutes: parseInt(madridTime[1]),
        seconds: parseInt(madridTime[2])
    }
}


const clocks = [
    {
        name: "Madrid",
        hoursDiff: 0,
        algorithm: drawLineDDA
    },
    {
        name: "New York",
        hoursDiff: -6,
        algorithm: drawLinePointSlope
    },
    {
        name: "Buenos Aires",
        hoursDiff: -5,
        algorithm: drawLineBresenham
    }
];

function tick() {
    time.seconds++;
    if(time.seconds >= 60){
        time.seconds -= 60;
        time.minutes++;
    }
    if(time.minutes >= 60){
        time.minutes -= 60;
        time.hours++;
    }
    
    if(time.hours >= 12){
        time.hours -= 12;
    }
}

setInterval(() => tick(), 1000);

const radiusClock = 100;
const padding = 10;

function draw() {
    background('#D5CABD');
    let i = 0;
    
    for (const clock of clocks) {
        const x = radiusClock + padding + 2 * i * (radiusClock + padding);
        drawClock(x, radiusClock + padding, time.seconds, time.minutes, time.hours + clock.hoursDiff, clock.algorithm);
        textAlign(CENTER);
        textSize(20);
        strokeWeight(1);
        text(clock.name, x, 240);
        i++;
    }
}

function drawClock(x, y, seconds, minutes, hours, algorithm) {
    circle(x, y, radiusClock * 2);
    strokeWeight(4);
    const hoursAngle = (hours % 12 / 12) * (Math.PI * 2) - Math.PI / 2;
    const minutesAngle = (minutes % 60 / 60) * (Math.PI * 2) - Math.PI / 2;
    const secondsAngle = (seconds % 60 / 60) * (Math.PI * 2) - Math.PI / 2;
    drawClockhand(algorithm, x, y, radiusClock * .6, hoursAngle);
    drawClockhand(algorithm, x, y, radiusClock * .7, minutesAngle);
    stroke('red');
    strokeWeight(2);
    drawClockhand(algorithm, x, y, radiusClock * .9, secondsAngle);
    stroke('black');
    strokeWeight(4);
    drawCircle(x, y, radiusClock);
}

function drawClockhand(algorithm, x, y, length, angle) {
    let x2 = x + length * Math.cos(angle);
    let y2 = y + length * Math.sin(angle);
    algorithm(x, y, x2, y2);
}


function drawLineBresenham(startX, startY, endX, endY) {
    let deltaX = abs(endX - startX);
    let deltaY = abs(endY - startY);
    let stepX = (startX < endX) ? 1 : -1;
    let stepY = (startY < endY) ? 1 : -1;
    let error = deltaX - deltaY;
    let fallback = Math.max(deltaX, deltaY);

    while (true) {
        if (fallback-- < 0) return;
        point(startX, startY);

        if (startX === endX && startY === endY) break;
        let error2 = 2 * error;
        if (error2 > -deltaY) {
            error -= deltaY;
            startX += stepX;
        }
        if (error2 < deltaX) {
            error += deltaX;
            startY += stepY;
        }
    }
}

function drawLineDDA(startX, startY, endX, endY) {
    let deltaX = endX - startX;
    let deltaY = endY - startY;
    
    let numberOfSteps = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    
    let xIncrement = deltaX / numberOfSteps;
    let yIncrement = deltaY / numberOfSteps;
    
    let currentX = startX;
    let currentY = startY;
    
    while(numberOfSteps-- >= 0) {
        point(round(currentX), round(currentY));
        currentX += xIncrement;
        currentY += yIncrement;
    }
}

function drawLinePointSlope (startX, startY, endX, endY) {
    if (startX === endX) {
      let y = Math.min(startY, endY);
      const yEnd = Math.max(startY, endY);
      do {
          point(startX, y);
      }while (y++ < yEnd);
      return;
    }
    
    const slope = (endY - startY) / (endX - startX);
    const intercept = Math.round(startY - slope * startX);
    let x = Math.min(startX, endX);
    const xEnd = Math.max(startX, endX);

    do {
        const y = slope * x + intercept;
        point(x, y);
    }while (x++ < xEnd);
}


function drawCircle(xc, yc, r) {
    let x = r;
    let y = 0;
    let P = 1 - r;
  
    while (x >= y) {
    
        if (P <= 0)
            P = P + 2 * y + 1;
        else {
            x--;
            P = P + 2 * y - 2 * x + 1;
        }
    
        if (x < y) return;
  
        point(xc + x, yc + y);
        point(xc - x, yc + y);
        point(xc + x, yc - y);
        point(xc - x, yc - y);
        point(xc + y, yc + x);
        point(xc - y, yc + x);
        point(xc + y, yc - x);
        point(xc - y, yc - x);
        y++;
    }
}