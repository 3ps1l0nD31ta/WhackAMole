class TimeData extends Array
{
    getString()
    {
        var returnString = "";
        this.forEach(function(currentValue)
        {
            returnString = returnString.concat(currentValue + ", ");
        })
        return(returnString);
    }
    getSum()
    {
        var sum = 0;
        this.forEach(function(currentValue)
        {
            sum += currentValue;
        })
        return sum;
    }
    getMean()
    {
        return this.getSum()/this.length;
    }
    outputToFile(){
        var element = document.createElement('a');
        var outputString = "mean: " + this.getMean() + "\n";
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputString.concat(this.getString())));
        element.setAttribute('download', "WhackAMoleTimings.txt");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}
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
function drawCircle(position,colour,outlineColour,radius)
{
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius-5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = outlineColour;
    ctx.stroke();
}
function withinTarget(pos,targ)
{   
    return (Vector2.vectorAdd(pos,Vector2.VectorMult(targ,-1))).magnitude()<targ.radius;
}
function onKeyDown(evt)
{
    switch (evt.which || evt.charCode || evt.keyCode) { 
		case 70:
            data.outputToFile();
            break;
	} 

}
function onMouseDown(evt)
{
    var mousePos = getMousePos(gameWindow,evt);
    if(withinTarget(mousePos,target))
    {
        console.log("hit button");
        hitTarget = !hitTarget;
    }
}
function showNewTarget()
{
    var size = targetSizes[Math.floor(Math.random()*targetSizes.length)];
    var x = Math.floor(Math.random()*(gameWindow.clientWidth-size));
    var y = Math.floor(Math.random()*(gameWindow.clientHeight-size));
    target = new Target(x,y,size);
    drawCircle(target,"#005500","#003300",target.radius);
} 
function clearTarget()
{
    ctx.clearRect(target.x-target.radius,target.y-target.radius,target.radius*2,target.radius*2);
}
function showStartButton()
{
    drawCircle(centre,"#005500","#003300",15);
    target = new Target(centre.x,centre.y,15);
}
function update(deltaTime)
{
    if(hitTarget)
    {
        if(reacting)
        {
            clearTarget();
            showStartButton();
            counting = false;
            hitTarget = false;
            reacting = false;
            data.push(count);
            count = 0;
        }else{
            clearTarget();
            counting = true;
        }
        if(count>2000)
        {
            hitTarget = false;
            count = 0;
            showNewTarget();
            reacting = true;
        }
    }
    if(counting)
    {
        count += deltaTime;
    }
}
function loop(timestamp)
{
    var deltaTime = timestamp - lastRender;

    update(deltaTime);

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
function init()
{
    showStartButton();
    gameWindow.addEventListener("mousedown",function(evt){onMouseDown(evt);});
    document.onkeydown = onKeyDown; 
    window.requestAnimationFrame(loop);
}
//init variables
var gameWindow = document.getElementById("gameWindow");
var ctx = gameWindow.getContext("2d");
var data = new TimeData();
var centre = new Vector2(gameWindow.clientWidth/2,gameWindow.clientHeight/2);
var hitTarget = false;
var counting = false;
var reacting = false;
var targetSizes = [10,30,50];
var lastRender = 0;
var target;
var count = 0;

init();

