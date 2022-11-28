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
        var outputString = "mean: " + this.getMean() + ". Count: " + this.length + "\n";
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
class TargetData
{
    constructor(innerColour,outerColour,sizePxl)
    {
        this.innerColour = innerColour;
        this.outerColour = outerColour;
        this.sizePxl = sizePxl;
    }
}
class WaitingSubStage
{
    constructor()
    {
        this.time = 0;
    }
    onTargetHit()
    {
        clearTarget();
        stage.transitionSubStage(new DrawingSubStage());
    }
    update(delta)
    {
        this.time += delta;
    }
}
class DrawingSubStage
{
    constructor()
    {
        this.time = 0;
    }
    update(delta)
    {
        this.time += delta;
        if(this.time > 2000)
        {
            showNewTarget();
            stage.transitionSubStage(new RespondingSubStage());
        }
    }
    onTargetHit()
    {
    }
}
class RespondingSubStage
{
    constructor()
    {
        this.time = 0;
    }
    update(delta)
    {
        this.time += delta;
    }

    onTargetHit()
    {
        clearTarget();
        showStartButton();
        data.push(this.time);
        stage.transitionSubStage(new WaitingSubStage());
    }
}
class PreGameStage
{
    constructor()
    {
        this.time = 0;
    }
    onTargetHit()
    {
        clearTarget();
        transitionStage(new GameStage());
    }
    update(delta)
    {
        this.time += delta;
    }
}
class GameStage
{
    constructor()
    {
        this.time = 0;
        this.subStage = new DrawingSubStage();
    }
    update(delta)
    {
        this.subStage.update(delta);
        this.time += delta;
        if(this.time > 60000)
        {
            data.outputToFile();
            data = new TimeData();
            clearTarget();
            showStartButton();
            transitionStage(new PreGameStage());
        }
    }
    onTargetHit()
    {
        this.subStage.onTargetHit();
    }
    transitionSubStage(nextSubStage)
    {
        this.subStage = nextSubStage;
    }
}
function transitionStage(nextStage)
{
    stage = nextStage;
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
        stage.onTargetHit();
        console.log("hit button");
    }
}
function showNewTarget()
{
    var targetData = targetButtons[Math.floor(Math.random()*targetButtons.length)];
    var x = Math.floor(Math.random()*(gameWindow.clientWidth-targetData.sizePxl));
    var y = Math.floor(Math.random()*(gameWindow.clientHeight-targetData.sizePxl));
    target = new Target(x,y,targetData.sizePxl);
    drawCircle(target,targetData.innerColour,targetData.outerColour,target.radius);
} 
function clearTarget()
{
    ctx.clearRect(target.x-target.radius,target.y-target.radius,target.radius*2,target.radius*2);
}
function showStartButton()
{
    drawCircle(centre,startButtonData.innerColour,startButtonData.outerColour,startButtonData.sizePxl);
    target = new Target(centre.x,centre.y,15);
}
function loop(timestamp)
{
    var deltaTime = timestamp - lastRender;

    stage.update(deltaTime);

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
var startButtonData = new TargetData("#005500","#003300",15);
var targetButtons = [new TargetData("#c40000","#a30000",10),new TargetData("#cfc500","#afa600",30), new TargetData("#0033cc","#002aa9",50)];
var targetSizes = [10,30,50];
var lastRender = 0;
var target;


var stage = new PreGameStage();

init();