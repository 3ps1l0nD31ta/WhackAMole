function Vector2(x,y){
    this.x = x;
    this.y = y;
}
function vecDelta(v1,v2)
{
    returnVec = new Vector2(v1.x-v2.x,v1.y-v2.y);
    return(returnVec);
}
function magnitude(vec)
{
    return(Math.sqrt(vec.x*vec.x+vec.y*vec.y));
}
function Target(x,y,radius)
{
    this.x = x;
    this.y = y;
    this.radius = radius;
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  vec = new Vector2();
  return {x:evt.clientX - rect.left,y:evt.clientY - rect.top};
}
function drawCircle(x,y,colour)
{
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#003300";
    ctx.stroke();
}
function draw(evt) {
  var pos = getMousePos(gameWindow, evt);
  drawCircle(pos.x,pos.y,"#005500");
}

function withinTarget(pos,targ, radius)
{
    if(magnitude(vecDelta(pos,targ))<radius)
    {
        return(true);
    }
    return(false);
}

function onMouseDown(evt)
{
    var mousePos = getMousePos(gameWindow,evt);
    if(withinTarget(mousePos,{x: target.x,y: target.y},target.radius))
    {
        console.log("hit button");
        hitStart = !hitStart;
    }
}

//

//init game window
var gameWindow = document.getElementById("gameWindow");
var ctx = gameWindow.getContext("2d");
//add draw to mousedown event
gameWindow.addEventListener("mousedown",function(evt){onMouseDown(evt);});
//init variables
let centre = new Vector2(gameWindow.clientWidth/2,gameWindow.clientHeight/2);
var target = new Target(centre.x,centre.y,20);
var hitStart = false;
var counting = false;
//drawStartButton
drawCircle(centre,"#005500");

function update(progress)
{
    if(hitStart)
    {
        counting = true;
    }
    if(counting)
    {
        count += progress;
    }
    if(count > 2000)
    {
        drawCircle(centre,"#005500");
        counting = false;
        hitStart = false;
        count = 0;
    }
    console.log(counting);
}

function draw()
{
    if(hitStart)
    {
        ctx.clearRect(centre.x-target.radius,centre.y-target.radius,target.radius*2,target.radius*2);
    }
}

function loop(timestamp)
{
    var progress = timestamp - lastRender;

    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
var count = 0;
window.requestAnimationFrame(loop);

