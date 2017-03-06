var Status = Object.freeze({MAP:0,MENU:1,AIM:2,SKILLMENU:3,WAIT:4});
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
        Xoverlay:[], //overlay next turn
        objects:[],
        abilities:[0,0,0,0,0,0,0,0,0],
        skills:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        turn:0,
        level:0,
        enemies_left:1,
        selected:undefined,
        target:1, //0 - left, 1 - up, 2 - right, 3 - down
        aimed:[], //the cells where the spell will be cast. When aiming this array is populated, to avoid reprocessing the obstables again when casting
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

    if(Game.kstatus==Status.AIM) //draw aim
      aim(Game.selected,startx,starty);

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
    var trigger_turn = false;
    var force_redraw = false;
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
                    {
                        Game.player.position.x--;
                        trigger_turn = true;
                    }
                    next_status = Status.MAP;
                }
                else if(current_status == Status.MENU)
                {
                    //this is horseshit, but It's 3AM and I don't want to think
                    //abount something better
                    var next,unlocked;
                    switch(Game.selected)
                    {
                        case "f1":
                        case "f2":
                        case "f3":next = Game.selected;break;
                        case "g1":next = "f1";unlocked = Game.abilities[0];break;
                        case "g2":next = "f2";unlocked = Game.abilities[3];break;
                        case "g3":next = "f3";unlocked = Game.abilities[6];break;
                        case "t1":next = "g1";unlocked = Game.abilities[1];break;
                        case "t2":next = "g2";unlocked = Game.abilities[4];break;
                        case "t3":next = "g3";unlocked = Game.abilities[7];break;
                    }
                    if(unlocked)
                    {
                        document.getElementById(Game.selected).className = '';
                        Game.selected = next;
                        document.getElementById(Game.selected).className = 'selected';
                    }
                    next_status = Status.MENU;
                }
                else if(current_status == Status.AIM)
                {
                  next_status = Status.AIM;
                  force_redraw = true;
                  Game.target = 0;
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
                    {
                        Game.player.position.y--;
                        trigger_turn = true;
                    }
                    next_status = Status.MAP;
                }
                else if (current_status == Status.MENU)
                {
                    //this is horseshit, but It's 3AM and I don't want to think
                    //abount something better
                    var next,unlocked;
                    switch(Game.selected)
                    {
                        case "f1":
                        case "g1":
                        case "t1":next = Game.selected;break;
                        case "f2":next = "f1";unlocked = Game.abilities[0];break;
                        case "g2":next = "g1";unlocked = Game.abilities[1];break;
                        case "t2":next = "t1";unlocked = Game.abilities[2];break;
                        case "f3":next = "f2";unlocked = Game.abilities[3];break;
                        case "g3":next = "g2";unlocked = Game.abilities[4];break;
                        case "t3":next = "t2";unlocked = Game.abilities[5];break;
                    }
                    if(unlocked)
                    {
                        document.getElementById(Game.selected).className = '';
                        Game.selected = next;
                        document.getElementById(Game.selected).className = 'selected';
                    }
                    next_status = Status.MENU;
                }
                else if(current_status == Status.AIM)
                {
                  next_status = Status.AIM;
                  force_redraw = true;
                  Game.target = 1;
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
                    {
                        Game.player.position.x++;
                        trigger_turn = true;
                    }
                    next_status = Status.MAP;
                }
                else if (current_status == Status.MENU)
                {
                    //this is horseshit, but It's 3AM and I don't want to think
                    //abount something better
                    var next,unlocked;
                    switch(Game.selected)
                    {
                        case "f1":next = "g1";unlocked = Game.abilities[1];break;
                        case "f2":next = "g2";unlocked = Game.abilities[4];break;
                        case "f3":next = "g3";unlocked = Game.abilities[7];break;
                        case "g1":next = "t1";unlocked = Game.abilities[2];break;
                        case "g2":next = "t2";unlocked = Game.abilities[5];break;
                        case "g3":next = "t3";unlocked = Game.abilities[8];break;
                        case "t1":
                        case "t2":
                        case "t3":next = Game.selected;break;
                    }
                    if(unlocked)
                    {
                        document.getElementById(Game.selected).className = '';
                        Game.selected = next;
                        document.getElementById(Game.selected).className = 'selected';
                    }
                    next_status = Status.MENU;
                }
                else if(current_status == Status.AIM)
                {
                  next_status = Status.AIM;
                  force_redraw = true;
                  Game.target = 2;
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
                    {
                        Game.player.position.y++;
                        trigger_turn = true;
                    }
                    next_status = Status.MAP;
                }
                else if (current_status == Status.MENU)
                {
                    //this is horseshit, but It's 3AM and I don't want to think
                    //abount something better
                    var next,unlocked = undefined;
                    switch(Game.selected)
                    {
                        case "f1":next = "f2";unlocked = Game.abilities[3];break;
                        case "g1":next = "g2";unlocked = Game.abilities[4];break;
                        case "t1":next = "t2";unlocked = Game.abilities[5];break;
                        case "f2":next = "f3";unlocked = Game.abilities[6];break;
                        case "g2":next = "g3";unlocked = Game.abilities[7];break;
                        case "t2":next = "t3";unlocked = Game.abilities[8];break;
                        case "f3":
                        case "g3":
                        case "t3":next = Game.selected;break;
                    }
                    if(unlocked)
                    {
                        document.getElementById(Game.selected).className = '';
                        Game.selected = next;
                        document.getElementById(Game.selected).className = 'selected';
                    }
                    next_status = Status.MENU;
                }
                else if(current_status == Status.AIM)
                {
                  next_status = Status.AIM;
                  force_redraw = true;
                  Game.target = 3;
                }
                break;

            }
        case 122://this way it can work even with caps lock enabled //z,Z
        case 90:
            {
                if(current_status == Status.MAP)
                {
                    next_status = Status.MENU;
                    if(Game.abilities[0])
                    {
                        document.getElementById("f1").className = "selected";
                        Game.selected = "f1";
                    }
                    else if(Game.abilities[1])
                    {
                        document.getElementById("g1").className = "selected";
                        Game.selected = "g1";
                    }
                    else if(Game.abilities[2])
                    {
                        document.getElementById("t1").className = "selected";
                        Game.selected = "t1";
                    }
                    else
                        next_status = Status.MAP;
                }
                else if (current_status == Status.MENU)
                {
                  force_redraw = true;
                  next_status = Status.AIM;
                }
                else if (current_status == Status.AIM)
                {
                  cast(Game.selected);
                  trigger_turn = true;
                  document.getElementById(Game.selected).className = "";
                  next_status = Status.MAP;
                }
                break;
            }
        case 120: //x,X
        case 88:
            {
                if(current_status == Status.MENU || current_status == Status.AIM)
                {
                    next_status = Status.MAP;
                    force_redraw = true;
                    document.getElementById(Game.selected).className = '';
                    Game.selected = undefined;
                }
                else
                {
                    trigger_turn = false;
                    next_status = Status.MAP
                }
                break;
            }
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
        //document.getElementById("console").innerHTML = '';
        var current_cell_object = Game.objects[Game.player.position.y*Game.map.columns+Game.player.position.x];
        if(current_cell_object != undefined)
            current_cell_object.trigger();
        endTurn();
        render();
    }
    Game.kstatus = next_status;
    if(force_redraw)
      render(); //force rerender of the tiles even if the turn didn't elapsed
}
