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
        var returnVec = vec;
        returnVec.x *= scalar;
        returnVec.y *= scalar;
        return returnVec;
    }
}
function Target(x,y,radius)
{
    this.x = x;
    this.y = y;
    this.radius = radius;
}
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return new Vector2(evt.clientX - rect.left,evt.clientY - rect.top);
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
    return (Vector2.vectorAdd(pos,Vector2.VectorMult(targ,-1))).magnitude()<radius;
}

function onMouseDown(evt)
{
    var mousePos = getMousePos(gameWindow,evt);
    if(withinTarget(mousePos,new Vector2(target.x,target.y),target.radius))
    {
        console.log("hit button");
    }
}

//
let vector = new Vector2(1,1);
vector = Vector2.VectorMult(vector,1.41);
console.log(vector.magnitude());
//init game window
var gameWindow = document.getElementById("gameWindow");
var ctx = gameWindow.getContext("2d");
//add draw to mousedown event
gameWindow.addEventListener("mousedown",function(evt){onMouseDown(evt);});
//drawStartButton
drawCircle(gameWindow.clientWidth/2,gameWindow.clientHeight/2,"#005500");
var target = new Target(gameWindow.clientWidth/2,gameWindow.clientHeight/2,15);
