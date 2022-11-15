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
    ctx.arc(vec.x, vec.y, 15, 0, 2 * Math.PI);
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
//drawStartButton
drawCircle(centre,"#005500");

