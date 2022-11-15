class Vector2
{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    static vectorAdd(v1,v2)
    {
        return new Vector2(v1.x+v2.x,v1.y+v2.y);
    }
    static VectorMult(vec,scalar)
    {
        var returnVec = new Vector2(vec.x,vec.y);
        returnVec.x *= scalar;
        returnVec.y *= scalar;
        return returnVec;
    }
}
class Target extends Vector2{
    constructor(x,y,radius)
    {
        super(x,y);
        this.radius = radius;
    }
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return new Vector2(evt.clientX - rect.left,evt.clientY - rect.top);
}
function drawCircle(vec,colour)
{
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(vec.x, vec.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#003300";
    ctx.stroke();
}
function withinTarget(pos,targ)
{   
    return (Vector2.vectorAdd(pos,Vector2.VectorMult(targ,-1))).magnitude()<targ.radius;
}
function onMouseDown(evt)
{
    var mousePos = getMousePos(gameWindow,evt);
    if(withinTarget(mousePos,target))
    {
        console.log("hit button");
        hitStart = !hitStart;
    }
}
//init game window
var gameWindow = document.getElementById("gameWindow");
var ctx = gameWindow.getContext("2d");
//add draw to mousedown event
gameWindow.addEventListener("mousedown",function(evt){onMouseDown(evt);});
//init variables
let centre = new Vector2(gameWindow.clientWidth/2,gameWindow.clientHeight/2);
var target = new Target(centre.x,centre.y,15);
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
