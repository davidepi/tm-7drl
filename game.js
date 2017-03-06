Math.seed(Math.floor(new Date().getTime()));
const WATER = new Tile(true,32,96);
const WOOD = new Tile(true,0,96);
const TLCORNER = new Tile(false,160,32);
const BLCORNER = new Tile(false,160,64);
const TRCORNER = new Tile(false,128,64);
const BRCORNER = new Tile(false,192,64);
const HWALL = new Tile(false,32,64);
const VWALL = new Tile(false,0,64);
const TDOWN = new Tile(false,64,32);
const TUP = new Tile(false,32,32);
const TLEFT = new Tile(false,96,32);
const TRIGHT = new Tile(false,128,32);
const XWALL = new Tile(false,0,32);
const HDOOR = new Tile(true,96,64);
const VDOOR = new Tile(true,64,64);
const STAIRS = new Item(0,128,nextLevel);
const FIRESHARD = new Item(0,160,increaseFire);
const ICESHARD = new Item(32,160,increaseIce);
const THUNDERSHARD = new Item(64,160,increaseThunder);
const HOTWOOD = new Tile(true,32,96);
const ASH = new Tile(true,64,96);
const FIRE = new Tile(undefined,32,128);
const ICE = new Tile(undefined,64,128);

generateMap(0);
render();

function endTurn()
{
    document.getElementById("turn").innerHTML = ++Game.turn;
    document.getElementById("hp").innerHTML = Game.player.curhp+"/"+Game.player.maxhp;
    document.getElementById("fr").innerHTML = Game.player.fp+"%";
    document.getElementById("ic").innerHTML = Game.player.ip+"%";
    document.getElementById("th").innerHTML = Game.player.tp+"%";

    Game.overlay.map(propagate);
    Game.overlay=[];
    Game.overlay=Game.Xoverlay;
    Game.Xoverlay=[];
}

function generateMap(magnitude)
{
    Game.kstatus = Status.WAIT;
    if(!magnitude) //first level
    {
        Game.map.rows = Math.random(10,20);
        Game.map.columns = Math.random(10,20);
        for(var y=0;y<Game.map.rows;y++)
            for(var x=0;x<Game.map.columns;x++)
            {
                Game.map.hidden[y*Game.map.columns+x] = 0;
                if(x==0 || x==Game.map.columns-1)
                    Game.map.tiles[y*Game.map.columns+x] = VWALL;
                else if(y==0 || y==Game.map.rows-1)
                    Game.map.tiles[y*Game.map.columns+x] = HWALL;
                else
                    Game.map.tiles[y*Game.map.columns+x] = WOOD;
            }
        Game.map.tiles[0] = TLCORNER;
        Game.map.tiles[Game.map.columns-1]=TRCORNER;
        Game.map.tiles[(Game.map.rows-1)*(Game.map.columns)] = BLCORNER;
        Game.map.tiles[(Game.map.rows-1)*(Game.map.columns)+Game.map.columns-1] = BRCORNER;

        //player position
        Game.player.position.x = Math.random(1,Game.map.columns-2);
        Game.player.position.y = Game.map.rows-2;

        //stairs
        var x,y;
        do
        {
            x = Math.random(1,Game.map.columns-2);
            y = Math.random(1,Game.map.rows-2);
        }
        while(x!=Game.player.position.x && x!=Game.player.position.y && Game.objects[y*Game.map.columns+x]!=undefined)
            Game.objects[y*Game.map.columns+x] = STAIRS;
        do
        {
            x = Math.random(1,Game.map.columns-2);
            y = Math.random(1,Game.map.rows-2);
        }
        while(x!=Game.player.position.x && y!=Game.player.position.y && Game.objects[y*Game.map.columns+x]!=undefined)
            var a = Math.random(0,2);
        switch(a)
        {
            case 0: Game.objects[y*Game.map.columns+x] = FIRESHARD;break;
            case 1: Game.objects[y*Game.map.columns+x] = ICESHARD;break;
            case 2: Game.objects[y*Game.map.columns+x] = THUNDERSHARD;break;
        }


    }
    Game.kstatus = Status.MAP;
}

function nextLevel()
{
    if(Game.enemies_left == 0)
    {
        console.log("To the next level!");
    }
    else
        switch(Game.level)
    {
            case 0:console.log("Please, collect the shard first :)");break;
            case 1:
            case 2:
            case 3:console.log("You should defeat all your opponents to proceed!");break;
            case 4:
            case 5:
            case 6:console.log("You have to kill every enemy mage before continuing");break;
            case 7:
            case 8:
            case 9:console.log("You must slaughter every organic creature on sight before searching for others");break;
    }
}

function increaseFire()
{
    //I could have written a better flow for this function to avoid checking the
    //first level condition every time but who cares, this function does not
    //contain any loop
    var oldvalue = Game.player.fp;
    var newvalue = undefined;
    Game.player.maxhp = Game.player.maxhp-Math.round(Game.player.maxhp/10);
    if(Game.player.curhp > Game.player.maxhp)
        Game.player.curhp = Game.player.maxhp;
    if(oldvalue == 0 && Game.player.ip == 0 && Game.player.tp == 0)
    {
        Game.player.fp = 30;
        Game.abilities[0] = 1;
        document.getElementById("f1").innerHTML = "Fire";
        Game.enemies_left--;
    }
    else
    {
        Game.player.ip = Game.player.ip>2?Game.player.ip-2:0;
        Game.player.tp = Game.player.tp>2?Game.player.tp-2:0;
        Game.player.fp +=5;
        if(Game.player.fp > 300)
          Game.player.fp = 300;
        newvalue = Game.player.fp;
    }

    //if first level newvalue is undefined so it will fail every evaluation
    if(oldvalue == 0 && newvalue > 0) //add first tier
    {
        Game.abilities[0] = 1;
        document.getElementById("f1").innerHTML = "Fire";
    }
    else if (oldvalue <100 && newvalue >= 100) //add second tier
    {
        Game.abilities[3] = 1;
        document.getElementById("f2").innerHTML = "Blaze";
    }
    else if (oldvalue <200 && newvalue >= 200) //add third tier
    {
        Game.abilities[6] = 1;
        document.getElementById("f3").innerHTML = "Inferno";
    }
    //Initially I put also some switch to remove the tiers, but on a second
    //thought I don't want them

    //remove from map
    Game.objects[Game.player.position.y*Game.map.columns+Game.player.position.x] = undefined;
}

function increaseIce()
{
    var oldvalue = Game.player.ip;
    var newvalue = undefined;
    Game.player.maxhp = Game.player.maxhp-Math.round(Game.player.maxhp/10);
    if(Game.player.curhp > Game.player.maxhp)
        Game.player.curhp = Game.player.maxhp;
    if(oldvalue == 0 && Game.player.fp == 0 && Game.player.tp == 0)
    {
        Game.player.ip = 30;
        Game.abilities[1] = 1;
        document.getElementById("g1").innerHTML = "Frost";
        Game.enemies_left--;
    }
    else
    {
        Game.player.fp = Game.player.fp>2?Game.player.fp-2:0;
        Game.player.tp = Game.player.tp>2?Game.player.tp-2:0;
        Game.player.ip +=5;
        if(Game.player.ip > 300)
          Game.player.ip = 300;
        newvalue = Game.player.ip;
    }

    //if first level newvalue is undefined so it will fail every evaluation
    if(oldvalue == 0 && newvalue > 0) //add first tier
    {
        Game.abilities[1] = 1;
        document.getElementById("g1").innerHTML = "Frost";
    }
    else if (oldvalue <100 && newvalue >= 100) //add second tier
    {
        Game.abilities[4] = 1;
        document.getElementById("g2").innerHTML = "Ice";
    }
    else if (oldvalue <200 && newvalue >= 200) //add third tier
    {
        Game.abilities[7] = 1;
        document.getElementById("g3").innerHTML = "Avalanche";
    }
    //Initially I put also some switch to remove the tiers, but on a second
    //thought I don't want them

    //remove from map
    Game.objects[Game.player.position.y*Game.map.columns+Game.player.position.x] = undefined;
}

function increaseThunder()
{
    var oldvalue = Game.player.tp;
    var newvalue = undefined;
    Game.player.maxhp = Game.player.maxhp-Math.round(Game.player.maxhp/10);
    if(Game.player.curhp > Game.player.maxhp)
        Game.player.curhp = Game.player.maxhp;
    if(oldvalue == 0 && Game.player.ip == 0 && Game.player.fp == 0)
    {
        Game.player.tp = 30;
        Game.abilities[2] = 1;
        document.getElementById("t1").innerHTML = "Spark";
        Game.enemies_left--;
    }
    else
    {
        Game.player.ip = Game.player.ip>2?Game.player.ip-2:0;
        Game.player.fp = Game.player.fp>2?Game.player.fp-2:0;
        Game.player.tp +=5;
        if(Game.player.tp>300)
          Game.player.tp = 300;
        newvalue = Game.player.tp;
    }

    //if first level newvalue is undefined so it will fail every evaluation
    if(oldvalue == 0 && newvalue > 0) //add first tier
    {
        Game.abilities[2] = 1;
        document.getElementById("t1").innerHTML = "Spark";
    }
    else if (oldvalue <100 && newvalue >= 100) //add second tier
    {
        Game.abilities[5] = 1;
        document.getElementById("t2").innerHTML = "Bolt";
    }
    else if (oldvalue <200 && newvalue >= 200) //add third tier
    {
        Game.abilities[8] = 1;
        document.getElementById("t3").innerHTML = "Lightning";
    }
    //Initially I put also some switch to remove the tiers, but on a second
    //thought I don't want them

    //remove from map
    Game.objects[Game.player.position.y*Game.map.columns+Game.player.position.x] = undefined;
}

function aim(spell,startx,starty)
{
  Game.aimed = [];
  var offsetx,offsety;
  if(Game.target==1||Game.target==3) //aiming top or bottom
  {
    var yaim = Game.target==0||Game.target==2?0:Game.target==1?-1:1;
    switch(Game.selected)
    {
      case "f1":
      {
        offsety = 3 * yaim;
        offsetx = 0;
        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible &&
           Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+3*yaim});
             ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
          if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-1)].accessible && //left branch accessible
             Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible &&
             Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-3)].accessible &&
             Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-4)].accessible)
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x-4,y:Game.player.position.y+3*yaim});
               ctx.fillRect((Game.player.position.x-4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)";
               ctx.fillRect((Game.player.position.x-4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
             if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+1)].accessible && //right branch accessible
                Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible &&
                Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+3)].accessible &&
                Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+4)].accessible)
                {
                  ctx.fillStyle = "rgba(0,150,0,0.5)";
                  Game.aimed.push({x:Game.player.position.x+4,y:Game.player.position.y+3*yaim});
                  ctx.fillRect((Game.player.position.x+4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                }
                else
                {
                  ctx.fillStyle = "rgba(150,0,0,0.5)";
                  ctx.fillRect((Game.player.position.x+4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                }
            break;

      }
      case "f2":
      {
        offsety = 3 * yaim;
        offsetx = 0;
        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible &&
           Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+3*yaim});
             ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
          if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-1)].accessible && //left branch accessible
             Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible)
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+3*yaim});
               ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-3)].accessible && //left branch accessible
                  Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-4)].accessible)
                  {
                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                    Game.aimed.push({x:Game.player.position.x-4,y:Game.player.position.y+3*yaim});
                    ctx.fillRect((Game.player.position.x-4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
                  else
                  {
                    ctx.fillStyle = "rgba(150,0,0,0.5)"
                    ctx.fillRect((Game.player.position.x-4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
             }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)"
               ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
             if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+1)].accessible && //left branch accessible
                Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible)
                {
                  ctx.fillStyle = "rgba(0,150,0,0.5)";
                  Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+3*yaim});
                  ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+3)].accessible && //left branch accessible
                     Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+4)].accessible)
                     {
                       ctx.fillStyle = "rgba(0,150,0,0.5)";
                       Game.aimed.push({x:Game.player.position.x+4,y:Game.player.position.y+3*yaim});
                       ctx.fillRect((Game.player.position.x+4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                     }
                     else
                     {
                       ctx.fillStyle = "rgba(150,0,0,0.5)"
                       ctx.fillRect((Game.player.position.x+4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                     }
                }
                else
                {
                  ctx.fillStyle = "rgba(150,0,0,0.5)"
                  ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                }

          break;
      }
      case "f3":
      {
        offsety = 3 * yaim;
        offsetx = 0;
        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible &&
           Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+3*yaim});
             ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
          if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-1)].accessible) //left branch accessible
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+3*yaim});
               ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible)
               {
                 ctx.fillStyle = "rgba(0,150,0,0.5)";
                 Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+3*yaim});
                 ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-3)].accessible)
                 {
                   ctx.fillStyle = "rgba(0,150,0,0.5)";
                   Game.aimed.push({x:Game.player.position.x-3,y:Game.player.position.y+3*yaim});
                   ctx.fillRect((Game.player.position.x-3)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                   if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-4)].accessible)
                   {
                     ctx.fillStyle = "rgba(0,150,0,0.5)";
                     Game.aimed.push({x:Game.player.position.x-4,y:Game.player.position.y+3*yaim});
                     ctx.fillRect((Game.player.position.x-4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                   }
                   else
                   {
                     ctx.fillStyle = "rgba(150,0,0,0.5)"
                     ctx.fillRect((Game.player.position.x-4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                   }
                 }
                 else
                 {
                   ctx.fillStyle = "rgba(150,0,0,0.5)"
                   ctx.fillRect((Game.player.position.x-3)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 }
               }
               else
               {
                 ctx.fillStyle = "rgba(150,0,0,0.5)"
                 ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               }
             }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)"
               ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }


             if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+1)].accessible) //right branch accessible
                {
                  ctx.fillStyle = "rgba(0,150,0,0.5)";
                  Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+3*yaim});
                  ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible)
                  {
                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                    Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+3*yaim});
                    ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                    if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+3)].accessible)
                    {
                      ctx.fillStyle = "rgba(0,150,0,0.5)";
                      Game.aimed.push({x:Game.player.position.x+3,y:Game.player.position.y+3*yaim});
                      ctx.fillRect((Game.player.position.x+3)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                      if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+4)].accessible)
                      {
                        ctx.fillStyle = "rgba(0,150,0,0.5)";
                        Game.aimed.push({x:Game.player.position.x+4,y:Game.player.position.y+3*yaim});
                        ctx.fillRect((Game.player.position.x+4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                      }
                      else
                      {
                        ctx.fillStyle = "rgba(150,0,0,0.5)"
                        ctx.fillRect((Game.player.position.x+4)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                      }
                    }
                    else
                    {
                      ctx.fillStyle = "rgba(150,0,0,0.5)"
                      ctx.fillRect((Game.player.position.x+3)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                    }
                  }
                  else
                  {
                    ctx.fillStyle = "rgba(150,0,0,0.5)"
                    ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
                }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)"
               ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
          break;
      }
      case "g1":
      {
        offsety = 2 * yaim;
        offsetx = 0;
        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+offsetx)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+2*yaim});
             ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+offsetx)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
        if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x-1)].accessible)
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+2*yaim});
          ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+1)].accessible)
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+2*yaim});
          ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        break;
      }
      case "g2":
      {
        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+2*yaim});
             ctx.fillRect((Game.player.position.x)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }

        if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x-1)].accessible) //left branch
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+2*yaim});
          ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible &&
              Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x-2)].accessible)
              {
                ctx.fillStyle = "rgba(0,150,0,0.5)";
                Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+1*yaim});
                ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+1*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
              else
              {
                ctx.fillStyle = "rgba(150,0,0,0.5)";
                ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+1*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }

        if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+1)].accessible) //right branch
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+2*yaim});
          ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible &&
              Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+2)].accessible)
              {
                ctx.fillStyle = "rgba(0,150,0,0.5)";
                Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+1*yaim});
                ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+1*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
              else
              {
                ctx.fillStyle = "rgba(150,0,0,0.5)";
                ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+1*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        break;
      }
      case "g3":
      {

        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x)].accessible)//path in front of player
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+yaim});
             ctx.fillRect((Game.player.position.x)*Game.tilesize+startx,(Game.player.position.y+yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x)*Game.tilesize+startx,(Game.player.position.y+yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }

           if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x-1)].accessible && //left branch
              Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x-1)].accessible)
              {
                ctx.fillStyle = "rgba(0,150,0,0.5)";
                Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+2*yaim});
                ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x-2)].accessible &&
                  Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible &&
                  Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible)
                  {
                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                    Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+3*yaim});
                    ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+3*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
                  else
                  {
                    ctx.fillStyle = "rgba(150,0,0,0.5)";
                    ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+3*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
              }
          else
          {
            ctx.fillStyle = "rgba(150,0,0,0.5)";
            ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          }

          if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+1)].accessible && //right branch
             Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+1)].accessible)
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+2*yaim});
               ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+2)].accessible &&
                 Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible &&
                 Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible)
                 {
                   ctx.fillStyle = "rgba(0,150,0,0.5)";
                   Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+3*yaim});
                   ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+3*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 }
                 else
                 {
                   ctx.fillStyle = "rgba(150,0,0,0.5)";
                   ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+3*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 }
             }
         else
         {
           ctx.fillStyle = "rgba(150,0,0,0.5)";
           ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
         }
        break;
      }
      case "t1":
      case "t2":
      case "t3":
      {
        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x)].accessible &&
         Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x)].accessible &&
         Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x)].accessible &&
         Game.map.tiles[(Game.player.position.y+4*yaim)*Game.map.columns+(Game.player.position.x)].accessible)
         {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+4*yaim});
        }
          else
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x)*Game.tilesize+startx,(Game.player.position.y+4*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          break;
        }
    }
  }
  else
  {
    var yaim = Game.target==1||Game.target==3?0:Game.target==0?-1:1;
    switch(Game.selected)
    {
      case "f1":
      {
        if(Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+yaim)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y});
             ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
          if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //left branch accessible
             Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible &&
             Game.map.tiles[(Game.player.position.y-3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible &&
             Game.map.tiles[(Game.player.position.y-4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-4});
               ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)";
               ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
             if(Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //right branch accessible
                Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible &&
                Game.map.tiles[(Game.player.position.y+3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible &&
                Game.map.tiles[(Game.player.position.y+4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                {
                  ctx.fillStyle = "rgba(0,150,0,0.5)";
                  Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+4});
                  ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                }
                else
                {
                  ctx.fillStyle = "rgba(150,0,0,0.5)";
                  ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                }
            break;

      }
      case "f2":
      {
        if(Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+yaim)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y});
             ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
          if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //left branch accessible
             Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-2});
               ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               if(Game.map.tiles[(Game.player.position.y-3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //left branch accessible
                  Game.map.tiles[(Game.player.position.y-4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                  {
                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                    Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-4});
                    ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
                  else
                  {
                    ctx.fillStyle = "rgba(150,0,0,0.5)"
                    ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
             }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)"
               ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
             if(Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //left branch accessible
                Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                {
                  ctx.fillStyle = "rgba(0,150,0,0.5)";
                  Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+2});
                  ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  if(Game.map.tiles[(Game.player.position.y+3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //left branch accessible
                     Game.map.tiles[(Game.player.position.y+4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                     {
                       ctx.fillStyle = "rgba(0,150,0,0.5)";
                       Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+4});
                       ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                     }
                     else
                     {
                       ctx.fillStyle = "rgba(150,0,0,0.5)"
                       ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                     }
                }
                else
                {
                  ctx.fillStyle = "rgba(150,0,0,0.5)"
                  ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                }

          break;
      }
      case "f3":
      {
        if(Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+yaim)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y});
             ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
          if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible) //left branch accessible
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-1});
               ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               if(Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
               {
                 ctx.fillStyle = "rgba(0,150,0,0.5)";
                 Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-2});
                 ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 if(Game.map.tiles[(Game.player.position.y-3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                 {
                   ctx.fillStyle = "rgba(0,150,0,0.5)";
                   Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-3});
                   ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-3)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                   if(Game.map.tiles[(Game.player.position.y-4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                   {
                     ctx.fillStyle = "rgba(0,150,0,0.5)";
                     Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-4});
                     ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                   }
                   else
                   {
                     ctx.fillStyle = "rgba(150,0,0,0.5)"
                     ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                   }
                 }
                 else
                 {
                   ctx.fillStyle = "rgba(150,0,0,0.5)"
                   ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-3)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 }
               }
               else
               {
                 ctx.fillStyle = "rgba(150,0,0,0.5)"
                 ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               }
             }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)"
               ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }


             if(Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible) //right branch accessible
                {
                  ctx.fillStyle = "rgba(0,150,0,0.5)";
                  Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+1});
                  ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  if(Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                  {
                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                    Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+2});
                    ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                    if(Game.map.tiles[(Game.player.position.y+3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                    {
                      ctx.fillStyle = "rgba(0,150,0,0.5)";
                      Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+3});
                      ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+3)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                      if(Game.map.tiles[(Game.player.position.y+4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                      {
                        ctx.fillStyle = "rgba(0,150,0,0.5)";
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+4});
                        ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                      }
                      else
                      {
                        ctx.fillStyle = "rgba(150,0,0,0.5)"
                        ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+4)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                      }
                    }
                    else
                    {
                      ctx.fillStyle = "rgba(150,0,0,0.5)"
                      ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+3)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                    }
                  }
                  else
                  {
                    ctx.fillStyle = "rgba(150,0,0,0.5)"
                    ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
                }
             else
             {
               ctx.fillStyle = "rgba(150,0,0,0.5)"
               ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
             }
          break;
      }
      case "g1":
      {
        if(Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+yaim)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y});
             ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }
        if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible)
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y-1});
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        if(Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible)
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y+1});
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        break;
      }
      case "g2":
      {
        if(Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+yaim)].accessible && //path in front of player
           Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible)
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y});
             ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }

        if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible) //left branch
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y-1});
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
              Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+yaim)].accessible)
              {
                ctx.fillStyle = "rgba(0,150,0,0.5)";
                Game.aimed.push({x:Game.player.position.x+yaim,y:Game.player.position.y-2});
                ctx.fillRect((Game.player.position.x+yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
              else
              {
                ctx.fillStyle = "rgba(150,0,0,0.5)";
                ctx.fillRect((Game.player.position.x+yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }

        if(Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible) //right branch
        {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y+1});
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          if(Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
              Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+yaim)].accessible)
              {
                ctx.fillStyle = "rgba(0,150,0,0.5)";
                Game.aimed.push({x:Game.player.position.x+yaim,y:Game.player.position.y+2});
                ctx.fillRect((Game.player.position.x+yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
              else
              {
                ctx.fillStyle = "rgba(150,0,0,0.5)";
                ctx.fillRect((Game.player.position.x+yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              }
        }
        else
        {
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
        }
        break;
      }
      case "g3":
      {

        if(Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+yaim)].accessible)//path in front of player
           {
             ctx.fillStyle = "rgba(0,150,0,0.5)";
             Game.aimed.push({x:Game.player.position.x+yaim,y:Game.player.position.y});
             ctx.fillRect((Game.player.position.x+yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
           }
           else
           {
              ctx.fillStyle = "rgba(150,0,0,0.5)"
              ctx.fillRect((Game.player.position.x+yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
              break;
           }

           if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+yaim)].accessible && //left branch
              Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible)
              {
                ctx.fillStyle = "rgba(0,150,0,0.5)";
                Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y-1});
                ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                if(Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+yaim)].accessible &&
                  Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
                  Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                  {
                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                    Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-2});
                    ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
                  else
                  {
                    ctx.fillStyle = "rgba(150,0,0,0.5)";
                    ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                  }
              }
          else
          {
            ctx.fillStyle = "rgba(150,0,0,0.5)";
            ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          }

          if(Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+(Game.player.position.x+yaim)].accessible && //right branch
             Game.map.tiles[(Game.player.position.y+1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible)
             {
               ctx.fillStyle = "rgba(0,150,0,0.5)";
               Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y+1});
               ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
               if(Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+yaim)].accessible &&
                 Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
                 Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                 {
                   ctx.fillStyle = "rgba(0,150,0,0.5)";
                   Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+2});
                   ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 }
                 else
                 {
                   ctx.fillStyle = "rgba(150,0,0,0.5)";
                   ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                 }
             }
         else
         {
           ctx.fillStyle = "rgba(150,0,0,0.5)";
           ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
         }
        break;
      }
      case "t1":
      case "t2":
      case "t3":
      {
        if(Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+yaim)].accessible &&
            Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
            Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible &&
            Game.map.tiles[(Game.player.position.y)*Game.map.columns+(Game.player.position.x+4*yaim)].accessible)
            {
          ctx.fillStyle = "rgba(0,150,0,0.5)";
          Game.aimed.push({x:Game.player.position.x+4*yaim,y:Game.player.position.y});
        }
          else
          ctx.fillStyle = "rgba(150,0,0,0.5)";
          ctx.fillRect((Game.player.position.x+4*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
          break;
        }
    }
  }
}

function cast(type)
{
  var current_pos;
  for(var i=0;i<Game.aimed.length;i++)
  {
    current_pos = Game.aimed[i].y*Game.map.columns+Game.aimed[i].x;

    if(type.charAt(0)=='t') //thunder spell may miss. If thunder spell this is performed only once
    {
      var tmp = Math.random(1,100),offsetx,offsety;

      if(type.charAt(1)=='1') //tier 1 spell
      {
        if(tmp < 30) //miss
        {
            console.log("Your Spark spell missed the target");
            do //generate the alterated position in case the lightning spell misses
            {
                offsetx = Math.random(-1,1);
                offsety = Math.random(-1,1);
            }
            while(offsetx==0&&offsety==0);
            current_pos = (Game.aimed[i].y+offsety)*Game.map.columns+Game.aimed[i].x+offsetx;
        }
      }
      else if(type.charAt(1)=='2') //tier 2 spell
      {
        if(tmp < 40) //miss
        {
            console.log("Your Bolt spell missed the target");
            do //generate the alterated position in case the lightning spell misses
            {
                offsetx = Math.random(-1,1);
                offsety = Math.random(-1,1);
            }
            while(offsetx==0&&offsety==0);
            current_pos = (Game.aimed[i].y+offsety)*Game.map.columns+Game.aimed[i].x+offsetx;
        }
      }
      else //tier 3 spell
      {
        if(tmp <50)//miss
        {
            console.log("Your Lightning spell missed the target");
            do //generate the alterated position in case the lightning spell misses
            {
                offsetx = Math.random(-1,1);
                offsety = Math.random(-1,1);
            }
            while(offsetx==0&&offsety==0);
            current_pos = (Game.aimed[i].y+offsety)*Game.map.columns+Game.aimed[i].x+offsetx;
        }
      }
    }

    //destroy objects on hit
    if(Game.objects[current_pos]!=undefined)
      Game.objects[current_pos]=undefined;

    //TODO check if enemies and add damage

    //TODO sideeffects
    switch(type.charAt(0))
    {
      case 'f':
      {
        if(Game.overlay[current_pos]==undefined)
        {
          if(Game.map.tiles[current_pos]==WOOD) //burn for 7 turns +1 because it decrements at the end of this one
            Game.overlay[current_pos]=new Effect(FIRE,8,0);
          else //burn for 2 turn
            Game.overlay[current_pos]=new Effect(FIRE,2,0);

        }
        else
        {
            if(Game.overlay[current_pos].type==1) //melt ice
              Game.overlay[current_pos]=undefined;
            else
              Game.overlay[current_pos].value+=3; //increase fire duration
          }
        break;
      }
      case 'g':
      {
        if(Game.overlay[current_pos]==undefined)
          Game.overlay[current_pos] = new Effect(ICE,101,1);
        else
        {
            if(Game.overlay[current_pos].type==0) //extinguish fire
              Game.overlay[current_pos]=undefined;
            else if(Game.overlay[current_pos].type==1)
              Game.overlay[current_pos].value=101; //compact ice
          }
        break;
      }
      case 't':
      {
        if(Game.map.tiles[current_pos]==WOOD) //incinerate the wood
          Game.map.tiles[current_pos]=ASH;
        if(Game.overlay[current_pos]!=undefined) //remove ice or fire
          Game.overlay[current_pos]=undefined;
          break;
      }
    }
  }
}

function lord_tachanka()
{
  Game.player.fp = 300;
  Game.player.ip = 300;
  Game.player.tp = 300;
  Game.abilities[0] = 1;
  Game.abilities[1] = 1;
  Game.abilities[2] = 1;
  Game.abilities[3] = 1;
  Game.abilities[4] = 1;
  Game.abilities[5] = 1;
  Game.abilities[6] = 1;
  Game.abilities[7] = 1;
  Game.abilities[8] = 1;
  Game.abilities[1] = 1;
  Game.abilities[0] = 1;
  document.getElementById("f1").innerHTML = "Fire";
  document.getElementById("f2").innerHTML = "Blaze";
  document.getElementById("f3").innerHTML = "Inferno";
  document.getElementById("g1").innerHTML = "Frost";
  document.getElementById("g2").innerHTML = "Ice";
  document.getElementById("g3").innerHTML = "Avalanche";
  document.getElementById("t1").innerHTML = "Spark";
  document.getElementById("t2").innerHTML = "Bolt";
  document.getElementById("t3").innerHTML = "Lightning";
  Game.kstatus = Status.MAP;
}

function propagate(item,index)
{
  if(item==undefined)
    return undefined;
  if(--item.value==0)
  {
    if(item.type==1)
      return undefined;
    else
    {
      Game.map.tiles[index]=ASH;
      return undefined;
    }
  }
  if(item.type==1) //ice
    {
        Game.Xoverlay[index] = item;
    }
  else
  {
    if(item.value==1) //too low, don't propagate
     {
       Game.Xoverlay[index] = item;
     }
     else
     {
       if(Math.random(1,100)<25) //propagate
       {
          var y = Math.random(-1,1);
          var x = Math.random(-1,1);
          var new_index = index+x+y*Game.map.columns;
            if(Game.overlay[new_index]==undefined)
            {
              if(Game.map.tiles[new_index].accessible)
                Game.Xoverlay[new_index] = new Effect(FIRE,8,0);
            }
            else if(Game.overlay[new_index].type==1)
              Game.Xoverlay[new_index] = undefined;
            else if(Game.Xoverlay[new_index]!=undefined) //could have died in the previous if, hence the check
            Game.Xoverlay[new_index].value += Math.round(Game.overlay[index].value/2);
       }
      Game.Xoverlay[index] = item;
     }
  }
  return undefined;
}
