var Status = Object.freeze({MAP:0,MENU:1,SKILLMENU:2,WAIT:3});
var Game =
{
    kstatus:Status.MAP,
    player:new Actor(7,9,110,new Tile(false,0,0),0,0,0),
    npcs:[],
    tilesize:32,
    size:{width:800,height:600,offsetx:undefined,offsety:undefined},
    spritesheet:new Image(),
    map:{tiles:[],hidden:[],rows:0,columns:0},
    overlay:[],
    objects:[],
    turn:0,
    level:0,
    enemies_left:1,
}
Game.spritesheet.src = "spritesheet.png";
Game.size.offsetx = Math.floor(Game.size.width/Game.tilesize/2);
Game.size.offsety = Math.floor(Game.size.height/Game.tilesize/2);

var ctx = document.getElementById("cvs").getContext("2d");
window.focus();
window.onload = render;

Math.seed = function(newseed)
{
    Math.seed = newseed;
}

Math.random = function(min,max)
{
    Math.seed=((7907*Math.seed)+7901)%(2147483647);
    return Math.seed%(max-min+1)+min;
}

console.log = function(string)
{
    document.getElementById("console").innerHTML += "<div>"+string+"</div>";
}

function Tile(accessible,startx,starty)
{
    this.accessible = accessible;
    this.x = startx;
    this.y = starty;
}

function Item(startx,starty,action)
{
    this.x = startx;
    this.y = starty;
    this.trigger = action;
}

function Actor(posx,posy,maxhp,sprite,fire,ice,thunder)
{
    this.position = {x:posx, y:posy};
    this.curhp = maxhp;
    this.maxhp = maxhp;
    this.model = sprite;
    this.fp=fire;
    this.ip=ice;
    this.tp=thunder;
}

function init()
{
    document.body.focus();
}

function render()
{
    ctx.fillStyle="#222";
    ctx.fillRect(0,0,Game.size.width,Game.size.height);
    ctx.fillStyle="#000";

    var initx = 0; //iterator for the columns
    var inity = 0; //iterator for the rows
    var startx = 0; //offset for clipping
    var starty = 0;

    //determine startx and starty. To know the starting position where to draw
    //player position is assumed to be on the centre
    var tmp = Game.player.position.x - Game.size.offsetx;
    if(tmp < 0)
    {
        initx = 0;
        startx = -tmp;
        startx*=Game.tilesize;
    }
    else
    {
        initx = tmp;
        startx = -(initx*Game.tilesize) //since I start drawing with an offset in the map, here I correct that offset
    }
    tmp = Game.player.position.y - Game.size.offsety;
    if(tmp < 0)
    {
        inity = 0;
        starty = -tmp;
        starty*=Game.tilesize;
    }
    else
    {
        inity = tmp;
        starty = -(inity*Game.tilesize) //since I start drawing with an offset in the map, here I correct that offset
    }
    var currentTile, endy = Math.min(Game.map.rows,Game.size.height/32+inity), endx = Math.min(Game.map.columns,Game.size.width/32+initx);
    console.log(mx+" "+endx);
    for(var my=inity;my<endy;my++)
        for(var mx=initx;mx<endx;mx++)
        {
            currentTile=Game.map.tiles[my*Game.map.columns+mx];
            if(Game.map.hidden[my*Game.map.columns+mx]==1) //undiscovered area
                ctx.fillRect(mx*Game.tilesize+startx,my*Game.tilesize+starty,Game.tilesize,Game.tilesize);
            else
            {
                ctx.drawImage(Game.spritesheet,currentTile.x,currentTile.y,Game.tilesize,Game.tilesize,mx*Game.tilesize+startx,my*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                var obj = Game.objects[my*Game.map.columns+mx];
                if(obj != undefined)
                    ctx.drawImage(Game.spritesheet,obj.x,obj.y,Game.tilesize,Game.tilesize,mx*Game.tilesize+startx,my*Game.tilesize+starty,Game.tilesize,Game.tilesize);
            }
        }

    //drawplayer
    ctx.drawImage(Game.spritesheet,Game.player.model.x,Game.player.model.y,Game.tilesize,Game.tilesize,Game.player.position.x*Game.tilesize+startx,Game.player.position.y*Game.tilesize+starty,Game.tilesize,Game.tilesize);
    //draw NPCs
    for(var i=0;i<Game.npcs.length;i++)
        ctx.drawImage(Game.spritesheet,Game.npcs[i].model.x,Game.npcs[i].model.y,Game.tilesize,Game.tilesize,Game.npcs[i].position.x*Game.tilesize+startx,Game.npcs[i].position.y*Game.tilesize+starty,Game.tilesize,Game.tilesize);
}

function keybind(evt)
{   
    if(Game.kstatus == Status.WAIT)
        return;
    var current_status = Game.kstatus;
    var next_status;
    var trigger_turn = true;
    Game.kstatus = Status.WAIT;
    //TODO: what if charCode and keyCode share ambiguous values?
    var e=evt.keyCode!=0?evt.keyCode:evt.charCode;
    switch(e)
    {
        case 37: //key left
            {
                evt.preventDefault(); //suppress page scrolling
                if(current_status == Status.MAP)
                {
                    if(Game.player.position.x > 0 && 
                        Game.map.tiles[Game.player.position.y*Game.map.columns+Game.player.position.x-1].accessible == true)
                        Game.player.position.x--;

                    else
                        trigger_turn = false;
                    next_status = Status.MAP;
                }
                else
                {
                    next_status = Status.MAP;
                }
                break;
            }
        case 38: //Key up
            {
                evt.preventDefault(); //suppress page scrolling
                if(current_status == Status.MAP)
                {
                    if(Game.player.position.y > 0 && 
                        Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+Game.player.position.x].accessible == true)
                        Game.player.position.y--;
                    else
                        trigger_turn = false;
                    next_status = Status.MAP;
                }
                else
                {
                    next_status = Status.MAP;
                }
                break;

            }
        case 39: //Key right
            {
                evt.preventDefault(); //suppress page scrolling
                if(current_status == Status.MAP)
                {
                    if(Game.player.position.x > 0 && 
                        Game.map.tiles[Game.player.position.y*Game.map.columns+Game.player.position.x+1].accessible == true)
                        Game.player.position.x++;
                    else
                        trigger_turn = false;
                    next_status = Status.MAP;
                }
                else
                {
                    next_status = Status.MAP;
                }
                break;

            }
        case 40: //Key down
            {
                evt.preventDefault(); //suppress page scrolling
                if(current_status == Status.MAP)
                {
                    if(Game.player.position.y > 0 && 
                        Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+Game.player.position.x].accessible == true)
                        Game.player.position.y++;
                    else
                        trigger_turn = false;
                    next_status = Status.MAP;
                }
                else
                {
                    next_status = Status.MAP;
                }
                break;

            }
        case 122://this way it can work even with caps lock enabled
        case 90:console.log("enter");break; //z,Z
        case 120: //x,X
        case 88: console.log("cancel");break;
        case 107: //k,K
        case 75: console.log("key k");break;
        case 108: //l,L
        case 76: console.log("key L");break;
        case 97: //a,A
        case 65: console.log("key a");break;
        case 119: //w,W
        case 87: console.log("key w");break;
        case 100: //d,D
        case 68: console.log("key d");break;
        case 115: //s,S
        case 83: console.log("key s");break;
        default:break;
    }

    if(trigger_turn)
    {
        var current_cell_object = Game.objects[Game.player.position.y*Game.map.columns+Game.player.position.x];
        if(current_cell_object != undefined)
            current_cell_object.trigger();
        endTurn();
        render();
    }
    Game.kstatus = next_status;
}
