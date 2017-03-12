const WATER = new Tile(true,32,96);
const WOOD = new Tile(true,32,96);
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
const FIRESHARD = new Item(128,128,increaseFire);
const ICESHARD = new Item(160,128,increaseIce);
const THUNDERSHARD = new Item(192,128,increaseThunder);
const ASH = new Tile(true,64,96);
const FIRE = new Tile(undefined,32,128);
const ICE = new Tile(undefined,64,128);
const HEART = new Item(96,128,increaseHealth);
const TRAP = new Tile(true,128,96);
const BTRAP = new Tile(true,160,96);
const BHDOOR = new Tile(true,192,96);
const BVDOOR = new Tile(true,192,32);
const BSTAIRS = new Item(0,96,nextLevel);
const ENEMY = new Tile(false,224,128);
const ENEMYALERT = new Tile(false,256,0);
const ENEMYGONE = new Tile(false,256,32);

generateMap(0);
render();

function endTurn()
{
    Game.aimed = [];
    document.getElementById("turn").innerHTML = ++Game.turn;
    Game.overlay.map(propagate);
    Game.overlay=[];
    Game.overlay=Game.Xoverlay;
    Game.Xoverlay=[];
    if(Game.overlay[Game.player.position.y*Game.map.columns+Game.player.position.x]!=undefined)
        if(Game.overlay[Game.player.position.y*Game.map.columns+Game.player.position.x].type==0 && !Game.skills[8])
        {
            var remove = Math.floor(Math.random(0,(10*Game.level)+1)*Game.firemultiplier+1);
            Game.player.curhp-=remove;
            console.log(Strings.fireplayer[0]+remove+Strings.fireplayer[1]);
        }
    Game.npcs.forEach(function(cur, index, arr)
        {
            if(cur!=undefined)
                cur.act(Game.oldpos);
        });
    cast();
    document.getElementById("hp").innerHTML = Game.player.curhp+"/"+Game.player.maxhp;
    document.getElementById("fr").innerHTML = Game.player.fp+"%";
    document.getElementById("ic").innerHTML = Game.player.ip+"%";
    document.getElementById("th").innerHTML = Game.player.tp+"%";
    if(Game.player.curhp<1)
    {
        if(Game.skills[16]==1)
            Game.skills[16]=2;
        else
        {
            console.log("You diededed!!!")
            document.getElementById("mesg").style.display="block";
            document.getElementById("introbg").style.display="block";
            document.getElementById("mesg").innerHTML="<h1>You Died</h1><div>Refresh the page to retry</div>";
            return false;
        }
    }
    Game.npcs.forEach(function(cur,index,arr)
        {
         if(cur!=undefined && Game.overlay[index]!=undefined && Game.overlay[index].value==0)
        {
            var remove = Math.floor(Math.random(0,(10*Game.level)+1)*Game.firemultiplier+1);
            cur.curhp-=remove;
             debug("enemy lost health");
        }
            if(cur!=undefined && (cur.curhp<1||(Game.skills[17] && cur.curhp<(Math.floor(cur.maxhp/10)))))
        {   
                Game.npcs[index] = undefined;
                Game.enemies_left--;
                console.log(Strings.enemydies[0]+cur.name+Strings.enemydies[1]);
                if(Game.objects[index] == undefined)
                {
                    if(Math.random(0,1)==0)
                        Game.objects[index] = HEART;
                    else 
                    {
                        switch(Math.random(0,2))
                        {
                            case 0:Game.objects[index] = FIRESHARD;break;
                            case 1:Game.objects[index] = ICESHARD;break;
                            case 2:Game.objects[index] = THUNDERSHARD;break;
                        }
                    }
                }
        }
        
        });
    Game.oldpos = Game.player.position;
    return true;
}

function generateMap(magnitude)
{
    Game.kstatus = Status.WAIT;
    Game.map.tiles = [];
    Game.npcs = [];
    Game.objects = [];
    Game.overlay = [];
    switch(magnitude)
    {
        case 1:
            {
                Game.player.model=new Tile(false,32,0);
                enableSkills(1);
                generateBase(15,25,15,25,2);
                document.getElementById("title").innerHTML = 'First Floor';
                break;
            }
        case 2:
            {
                Game.player.model=new Tile(false,64,0);
                generateBase(20,30,20,30,3);
                document.getElementById("title").innerHTML = 'Second Floor';
                break;
            }
        case 3:
            {
                Game.player.model=new Tile(false,96,0);
                enableSkills(3);
                generateBase(25,35,25,35,4);
                document.getElementById("title").innerHTML = 'Third Floor';
                break;
            }
        case 4:
            {
                Game.player.model=new Tile(false,128,0);
                //stringSwap1();
                generateBase(30,40,30,40,4);
                document.getElementById("title").innerHTML = 'Fourth Floor';
                break;
            }
        case 5:
            {
                Game.player.model=new Tile(false,160,0);
                enableSkills(5);
                generateBase(30,40,30,40,5);
                document.getElementById("title").innerHTML = 'Fifth Floor';
                break;
            }
        case 6:
            {
                Game.player.model=new Tile(false,192,0);
                generateBase(40,50,40,50,5);
                document.getElementById("title").innerHTML = 'Sixth Floor';
                break;
            }
        case 7:
            { 
                Game.player.model=new Tile(false,224,0);
                generateBase(45,55,45,55,5);
                enableSkills(7);
                document.getElementById("title").innerHTML = 'Seventh Floor';
                //stringSwap2();
                break;
            }
        case 8:
            {
                Game.player.model=new Tile(false,224,32);
                generateBase(50,60,50,60,6);
                document.getElementById("title").innerHTML = 'Eight Floor';
                break;
            }
        case 9:
            {
                Game.player.model=new Tile(false,224,64);
                generateBase(70,100,70,100,6);
                enableSkills(9);
                document.getElementById("title").innerHTML = 'Ninth Floor';
                break;
            }
        case 10:
            {
                Game.player.model=new Tile(false,224,96);
                document.getElementById("title").innerHTML = 'Archmage Quarters';
                generateBase(30,40,30,40,2);
                break;
            }
        case 11:
            {
                document.getElementById("title").innerHTML = 'Roof';
                generateBase(8,8,8,8,0);
                Game.objects = [];
                break;
                document.getElementById("mesg").style.display="block";
                document.getElementById("introbg").style.display="block";
                document.getElementById("mesg").innerHTML="<h1>Congratuliations</h1><div>You finished the game</div>";
                Game.kstatus = Status.DEAD;
            }
        default:
            {
                generateBase(10,20,10,20,0);
                document.getElementById("title").innerHTML = 'Ground Floor';break;
                Game.player.position.x = Math.random(1,Game.map.columns-2);
                Game.player.position.y = Game.map.rows-2;
            }
    }
    spawnEnemies(magnitude);
}

function nextLevel()
{
    if(Game.enemies_left == 0)
    {
        generateMap(++Game.level);
        var increase = Math.random(80,120);
        console.log(Strings.completefloor[0]+increase+Strings.completefloor[1]);
        var bonus_increase = 0;
        if(Game.skills[0])
        {
            bonus_increase=(Math.floor(Game.player.maxhp/10));
            console.log("Your skill Stoneskin grants you "+bonus_increase+" additional HP");
            increase+=bonus_increase;
        }
        Game.player.maxhp+=increase;
        Game.player.curhp+=increase;
    }
    else
        switch(Game.level)
    {
            case 0:console.log("Maybe it is better if you collect the shard and gain some magical power...");break;
            case 1:
            case 2:
            case 3:console.log(Strings.endfloor);break;
            case 4:
            case 5:
            case 6:console.log(Strings.endfloor);break;
            case 7:
            case 8:
            case 9:console.log(Strings.endfloor);break;
    }
}

function increaseFire()
{
    //I could have written a better flow for this function to avoid checking the
    //first level condition every time but who cares, this function does not
    //contain any loop
    var oldvalue = Game.player.fp;
    var newvalue = undefined;
    Game.player.maxhp = Game.player.maxhp-Math.round(Game.player.maxhp/10+Math.random(-10,10));
    if(Game.player.curhp > Game.player.maxhp)
        Game.player.curhp = Game.player.maxhp;
    if(oldvalue == 0 && Game.player.ip == 0 && Game.player.tp == 0)
    {
        Game.player.fp = 50;
        Game.abilities[0] = 1;
        document.getElementById("f1").innerHTML = "Fire";
        Game.enemies_left--;
    }
    else
    {
        Game.player.ip = Game.player.ip>2?Game.player.ip-2:0;
        Game.player.tp = Game.player.tp>2?Game.player.tp-2:0;
        Game.player.fp +=(Math.random(10,20)+Math.random(0,5));
        if(Game.player.fp > 300 && !Game.skills[1])
            Game.player.fp = 300;
        newvalue = Game.player.fp;
        console.log(Strings.shard);
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
    Game.player.maxhp = Game.player.maxhp-Math.round(Game.player.maxhp/10+Math.random(-10,10));
    if(Game.player.curhp > Game.player.maxhp)
        Game.player.curhp = Game.player.maxhp;
    if(oldvalue == 0 && Game.player.fp == 0 && Game.player.tp == 0)
    {
        Game.player.ip = 50;
        Game.abilities[1] = 1;
        document.getElementById("g1").innerHTML = "Frost";
        Game.enemies_left--;
    }
    else
    {
        Game.player.fp = Game.player.fp>2?Game.player.fp-2:0;
        Game.player.tp = Game.player.tp>2?Game.player.tp-2:0;
        Game.player.ip +=(Math.random(10,20)+Math.random(0,5));
        if(Game.player.ip > 300 && !Game.skills[1])
            Game.player.ip = 300;
        newvalue = Game.player.ip;
    }
    console.log(Strings.shard);

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
    var hpdecr = Math.round(Game.player.maxhp/10+Math.random(-10,10));
    Game.player.maxhp = Game.player.maxhp-hpdecr;
    if(Game.player.curhp > Game.player.maxhp)
        Game.player.curhp = Game.player.maxhp;
    if(oldvalue == 0 && Game.player.ip == 0 && Game.player.fp == 0)
    {
        Game.player.tp = 50;
        Game.abilities[2] = 1;
        document.getElementById("t1").innerHTML = "Spark";
        Game.enemies_left--;
    }
    else
    {
        Game.player.ip = Game.player.ip>2?Game.player.ip-2:0;
        Game.player.fp = Game.player.fp>2?Game.player.fp-2:0;
        Game.player.tp +=(Math.random(10,20)+Math.random(0,5));
        if(Game.player.tp>300 && !Game.skills[1])
            Game.player.tp = 300;
        newvalue = Game.player.tp;
    }
    console.log(Strings.shard);
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

function increaseHealth()
{
    Game.player.curhp += 50;
    console.log(Strings.health);
    if(Game.player.curhp >= Game.player.maxhp)
        Game.player.curhp = Game.player.maxhp;
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
                        Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f1"});
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
                        Game.aimed.push({x:Game.player.position.x-4,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f1"});
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
                        Game.aimed.push({x:Game.player.position.x+4,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f1"});
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
                        Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f2"});
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
                        Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f2"});
                        ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-3)].accessible && //left branch accessible
                            Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-4)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x-4,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f2"});
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
                        Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f2"});
                        ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+3)].accessible && //left branch accessible
                            Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+4)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+4,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f2"});
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
                        Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
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
                        Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
                        ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
                            ctx.fillRect((Game.player.position.x-2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                            if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-3)].accessible)
                            {
                                ctx.fillStyle = "rgba(0,150,0,0.5)";
                                Game.aimed.push({x:Game.player.position.x-3,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
                                ctx.fillRect((Game.player.position.x-3)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                                if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-4)].accessible)
                                {
                                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                                    Game.aimed.push({x:Game.player.position.x-4,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
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
                        Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
                        ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
                            ctx.fillRect((Game.player.position.x+2)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                            if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+3)].accessible)
                            {
                                ctx.fillStyle = "rgba(0,150,0,0.5)";
                                Game.aimed.push({x:Game.player.position.x+3,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
                                ctx.fillRect((Game.player.position.x+3)*Game.tilesize+startx,(Game.player.position.y+offsety)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                                if(Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+4)].accessible)
                                {
                                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                                    Game.aimed.push({x:Game.player.position.x+4,y:Game.player.position.y+3*yaim,caster:Game.player,type:"f3"});
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
                        Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g1"});
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
                        Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g1"});
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
                        Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g1"});
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
                        Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g2"});
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
                        Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g2"});
                        ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible &&
                            Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x-2)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+1*yaim,caster:Game.player,type:"g2"});
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
                        Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g2"});
                        ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible &&
                            Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+2)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+1*yaim,caster:Game.player,type:"g2"});
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
                        Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+yaim,caster:Game.player,type:"g3"});
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
                        Game.aimed.push({x:Game.player.position.x-1,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g3"});
                        ctx.fillRect((Game.player.position.x-1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x-2)].accessible &&
                            Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible &&
                            Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x-2)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x-2,y:Game.player.position.y+3*yaim,caster:Game.player,type:"g3"});
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
                        Game.aimed.push({x:Game.player.position.x+1,y:Game.player.position.y+2*yaim,caster:Game.player,type:"g3"});
                        ctx.fillRect((Game.player.position.x+1)*Game.tilesize+startx,(Game.player.position.y+2*yaim)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+yaim)*Game.map.columns+(Game.player.position.x+2)].accessible &&
                            Game.map.tiles[(Game.player.position.y+2*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible &&
                            Game.map.tiles[(Game.player.position.y+3*yaim)*Game.map.columns+(Game.player.position.x+2)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+2,y:Game.player.position.y+3*yaim,caster:Game.player,type:"g3"});
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
                        Game.aimed.push({x:Game.player.position.x,y:Game.player.position.y+4*yaim,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-4,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+4,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-2,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y-3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //left branch accessible
                            Game.map.tiles[(Game.player.position.y-4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-4,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+2,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible && //left branch accessible
                            Game.map.tiles[(Game.player.position.y+4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+4,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-1,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-2,caster:Game.player,type:Game.selected});
                            ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                            if(Game.map.tiles[(Game.player.position.y-3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                            {
                                ctx.fillStyle = "rgba(0,150,0,0.5)";
                                Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-3,caster:Game.player,type:Game.selected});
                                ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y-3)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                                if(Game.map.tiles[(Game.player.position.y-4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                                {
                                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                                    Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-4,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+1,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+2,caster:Game.player,type:Game.selected});
                            ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+2)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                            if(Game.map.tiles[(Game.player.position.y+3)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                            {
                                ctx.fillStyle = "rgba(0,150,0,0.5)";
                                Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+3,caster:Game.player,type:Game.selected});
                                ctx.fillRect((Game.player.position.x+3*yaim)*Game.tilesize+startx,(Game.player.position.y+3)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                                if(Game.map.tiles[(Game.player.position.y+4)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                                {
                                    ctx.fillStyle = "rgba(0,150,0,0.5)";
                                    Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+4,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y-1,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y+1,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y-1,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y-1)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
                            Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+yaim,y:Game.player.position.y-2,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y+1,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
                            Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+yaim,y:Game.player.position.y+2,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+yaim,y:Game.player.position.y,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y-1,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y-1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+yaim)].accessible &&
                            Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
                            Game.map.tiles[(Game.player.position.y-2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y-2,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+2*yaim,y:Game.player.position.y+1,caster:Game.player,type:Game.selected});
                        ctx.fillRect((Game.player.position.x+2*yaim)*Game.tilesize+startx,(Game.player.position.y+1)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                        if(Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+yaim)].accessible &&
                            Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+2*yaim)].accessible &&
                            Game.map.tiles[(Game.player.position.y+2)*Game.map.columns+(Game.player.position.x+3*yaim)].accessible)
                        {
                            ctx.fillStyle = "rgba(0,150,0,0.5)";
                            Game.aimed.push({x:Game.player.position.x+3*yaim,y:Game.player.position.y+2,caster:Game.player,type:Game.selected});
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
                        Game.aimed.push({x:Game.player.position.x+4*yaim,y:Game.player.position.y,caster:Game.player,type:Game.selected});
                    }
                    else
                        ctx.fillStyle = "rgba(150,0,0,0.5)";
                    ctx.fillRect((Game.player.position.x+4*yaim)*Game.tilesize+startx,(Game.player.position.y)*Game.tilesize+starty,Game.tilesize,Game.tilesize);
                    break;
                }
        }
    }
}

function cast()
{
    var current_pos;
    var type;
    var casterPlayer;
    for(var i=0;i<Game.aimed.length;i++)
    {
        type = Game.aimed[i].type;
        current_pos = Game.aimed[i].y*Game.map.columns+Game.aimed[i].x;
        casterPlayer = Game.aimed[i].caster==Game.player?true:false;

        if(type.charAt(0)=='t') //thunder spell may miss. If thunder spell this is performed only once
        {
            var tmp = Math.random(1,100),offsetx,offsety;

            if(type.charAt(1)=='1') //tier 1 spell
            {
                if(tmp < 30 && !Game.skills[11]) //miss
                {
                    if(casterPlayer)
                        console.log(Strings.failthunder[0]+"Spark"+Strings.failthunder[1]);
                    else
                        console.log(Strings.failthunderEnemy[0]+"Spark"+Strings.failthunderEnemy[1]);

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
                if((tmp < 40 && !Game.skills[11]) || (tmp < 6 && Game.skills[11])) //miss
                {
                    if(casterPlayer)
                        console.log(Strings.failthunder[0]+"Bolt"+Strings.failthunder[1]);
                    else
                        console.log(Strings.failthunderEnemy[0]+"Bolt"+Strings.failthunderEnemy[1]);

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
                if((tmp <50 && !Game.skills[11]) || (tmp < 11 && Game.skills[11]))//miss
                {
                    if(casterPlayer)
                        console.log(Strings.failthunder[0]+"Lightning"+Strings.failthunder[1]);
                    else
                        console.log(Strings.failthunderEnemy[0]+"Lightning"+Strings.failthunderEnemy[1]);

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
        /* EDIT: don't destroy, there would be too much flames and objects will always be destroyed
        if(Game.objects[current_pos]!=undefined && Game.objects[current_pos]!=STAIRS && Game.objects[current_pos]!=BSTAIRS)
            Game.objects[current_pos]=undefined;
        */

        //DAMAGE
        var intensity = type.charAt(0)=="f"?0.8*Game.aimed[i].caster.fp*Game.firemultiplier:type.charAt(0)=="t"?Game.aimed[i].caster.tp*Game.thundermultiplier:Game.aimed[i].caster.ip*0.9*Game.icemultiplier;
        var multiplier1 = type.charAt(2)==1?1:type.charAt(2)==2?1.17:1.35;
        var multiplier2 = Math.random(50,100)/100;
        var damage = Math.floor(intensity*multiplier1*multiplier2);
        if(Game.npcs[current_pos]!=undefined)
        { 
            Game.npcs[current_pos].curhp-=damage;
            if(Game.aimed[i].caster == Game.player)
            {
                if(Game.skills[12])
                {
                    Game.player.curhp+=Math.floor(damage/10);
                    if(Game.player.curhp>Game.player.maxhp)
                        Game.player.curhp=Game.player.maxhp;
                }
                console.log(Strings.playerenemy[0]+Game.npcs[current_pos].name+Strings.playerenemy[1]+damage+Strings.playerenemy[2]);
            }
            else
                console.log(Strings.enemyenemy[0]+Game.aimed[i].caster.name+Strings.enemyenemy[1]+Game.npcs[current_pos].name+Strings.enemyenemy[2]+damage+Strings.enemyenemy[3]);
        }
        if(Game.player.position.x+Game.player.position.y*Game.map.columns==current_pos)
        {
            if(!Game.skills[4] || (Game.skills[4] && Math.random(15,100)<85))
            {
                Game.player.curhp -= damage;
                console.log(Strings.enemyplayer[0]+Game.aimed[i].caster.name+Strings.enemyplayer[1]+damage+Strings.enemyplayer[2]);
            }
        }

        switch(type.charAt(0))
        {
            case 'f':
                {
                    if(Game.overlay[current_pos]==undefined)
                    {
                        if(Game.map.tiles[current_pos]==WOOD) //burn for 9 turns +1 because it decrements at the end of this one
                            Game.overlay[current_pos]=new Effect(FIRE,10,0);
                        else //burn for 4 turn
                            Game.overlay[current_pos]=new Effect(FIRE,5,0);

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
                    if(Game.npcs[current_pos]!=undefined)
                        break;
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
            if(Game.map.tiles[index]==WOOD)
                Game.map.tiles[index]=ASH;
            else if(Game.map.tiles[index]==ASH); //ASH is a lot more common than the others. In this way I avoid to process every else-if
            else if(Game.map.tiles[index]==HDOOR)
                Game.map.tiles[index]=BHDOOR;
            else if(Game.map.tiles[index]==VDOOR)
                Game.map.tiles[index]=BVDOOR;
            else if(Game.map.tiles[index]==TRAP)
                Game.map.tiles[index]=BTRAP;
            if(Game.objects[index]==STAIRS)
                Game.objects[index]=BSTAIRS;
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
            if(Math.random(1,100)<30) //propagate
            {
                var y = Math.random(-1,1);
                var x = Math.random(-1,1);
                var new_index = index+x+y*Game.map.columns;
                if(Game.overlay[new_index]==undefined)
                {
                    if(Game.map.tiles[new_index].accessible)
                    {
                        if(Game.map.tiles[new_index]==WOOD)
                            Game.Xoverlay[new_index] = new Effect(FIRE,10,0);
                        else
                            Game.Xoverlay[new_index] = new Effect(FIRE,3,0);
                        /*
                         * dont' destroy
                        if(Game.objects[new_index]!=undefined && Game.objects[new_index]!=STAIRS && Game.objects[new_index]!=BSTAIRS)
                            Game.objects[new_index]=undefined;
                            */
                    }
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

function enableSkills(magnitude)
{
    switch(magnitude)
    {
        case 1:
            {
                document.getElementById("s0").className = '';
                document.getElementById("s1").className = '';
                document.getElementById("s2").className = '';
                document.getElementById("s3").className = '';
                break;
            }
        case 3:
            {
                document.getElementById("s4").className = '';
                document.getElementById("s5").className = '';
                document.getElementById("s6").className = '';
                document.getElementById("s7").className = '';
                break;
            }
        case 5:
            {
                document.getElementById("s8").className = '';
                document.getElementById("s9").className = '';
                document.getElementById("s10").className = '';
                document.getElementById("s11").className = '';
                break;
            }
        case 7:
            {
                document.getElementById("s12").className = '';
                document.getElementById("s13").className = '';
                document.getElementById("s14").className = '';
                document.getElementById("s15").className = '';
                break;
            }
        case 9:
            {
                document.getElementById("s16").className = '';
                document.getElementById("s17").className = '';
                document.getElementById("s18").className = '';
                document.getElementById("s19").className = '';
                break;
            }
    }
}

function generateBase(minx,maxx,miny,maxy,maxiteration)
{
    Game.map.rows = Math.random(minx,maxx);
    Game.map.columns = Math.random(miny,maxy);
    Game.map.rooms = [{sx:0,sy:0,ex:Game.map.columns-1,ey:Game.map.rows-1}];
    Game.map.accessible = [];
    Math.random(0,1)==0?
        splitV(0,0,Game.map.columns-1,Game.map.rows-1,0,0,maxiteration):
        splitH(0,0,Game.map.columns-1,Game.map.rows-1,0,0,maxiteration);

    var ind,door;
    Game.map.rooms.forEach(function(element,index) //fill the rooms
        {
        for(var y=element.sy;y<=element.ey;y++)
            for(var x=element.sx;x<=element.ex;x++)
            {
                ind = y*Game.map.columns+x;
                Game.map.hidden[ind] = 1;
                if(x==element.sx || x==element.ex && Game.map.tiles[ind]==undefined)
                    Game.map.tiles[ind] = VWALL;
                else if(y==element.sy || y==element.ey && Game.map.tiles[ind]==undefined)
                    Game.map.tiles[ind] = HWALL;
                else if(Game.map.tiles[ind]==undefined)
                    Game.map.tiles[ind] = WOOD;
            }
        });
    Game.map.rooms.forEach(function(element,index) //apply doors and corners
    {
        //top left
        ind = element.sy*Game.map.columns+element.sx;
        if(Game.map.tiles[ind-1]!=WOOD && element.sx!=0)
            if(Game.map.tiles[(element.sy-1)*Game.map.columns+element.sx]!=WOOD && element.sy!=0)
                Game.map.tiles[ind]=XWALL;
            else
                Game.map.tiles[ind]=TDOWN;

        else
                if(Game.map.tiles[(element.sy-1)*Game.map.columns+element.sx]!=WOOD && element.sy!=0)
                    Game.map.tiles[ind] = TRIGHT;
                else
                    Game.map.tiles[ind] = TLCORNER;
        //top right
        ind = element.sy*Game.map.columns+element.ex;
        if(Game.map.tiles[ind]==VWALL || Game.map.tiles[ind]==HWALL) //otherwise already processed
        {
            if(Game.map.tiles[ind+1]!=WOOD && element.ex!=Game.map.columns-1)
                if(Game.map.tiles[(element.sy-1)*Game.map.columns+element.ex]!=WOOD && element.sy!=0)
                    Game.map.tiles[ind]=XWALL;
                else
                    Game.map.tiles[ind]=TDOWN;

            else
                if(Game.map.tiles[(element.sy-1)*Game.map.columns+element.ex]!=WOOD && element.sy!=0)
                    Game.map.tiles[ind] = TLEFT;
                else
                    Game.map.tiles[ind] = TRCORNER;
        }
        //bottom left
        ind = element.ey*Game.map.columns+element.sx
        if(Game.map.tiles[ind]==VWALL || Game.map.tiles[ind]==HWALL)
        {
        if(Game.map.tiles[ind-1]!=WOOD && element.sx!=0)
            if(Game.map.tiles[(element.ey+1)*Game.map.columns+element.sx]!=WOOD && element.ey!=Game.map.rows-1)
                Game.map.tiles[ind]=XWALL;
            else
                Game.map.tiles[ind]=TUP;

        else
                if(Game.map.tiles[(element.ey+1)*Game.map.columns+element.sx]!=WOOD && element.ey!=Game.map.rows-1)
                    Game.map.tiles[ind] = TRIGHT;
                else
                    Game.map.tiles[ind] = BLCORNER;
        }

        //bottom right
         ind = element.ey*Game.map.columns+element.ex
        if(Game.map.tiles[ind]==VWALL || Game.map.tiles[ind]==HWALL)
        {
        if(Game.map.tiles[ind+1]!=WOOD && element.ex!=Game.map.columns-1)
            if(Game.map.tiles[(element.ey+1)*Game.map.columns+element.ex]!=WOOD && element.ey!=Game.map.rows-1)
                Game.map.tiles[ind]=XWALL;
            else
                Game.map.tiles[ind]=TUP;

        else
                if(Game.map.tiles[(element.ey+1)*Game.map.columns+element.ex]!=WOOD && element.ey!=Game.map.rows-1)
                    Game.map.tiles[ind] = TLEFT;
                else
                    Game.map.tiles[ind] = BRCORNER;
        }
        //first bit -> door left
        //second bit -> door top
        //third bit -> door right
        //last bit -> door bottom
        var nrooms = Math.random(0,15)
        var already_door = false;
        var generated_doors = 0;
        var door_position;
        while(!generated_doors && Game.map.rooms.length>1) //at least one door per room
        {

            nrooms = Math.random(1,15);
            if(nrooms & 0x1 && element.sx!=0)
            {
                already_door = false;
                for(var i=element.sy;i<element.ey;i++)
                    if(Game.map.tiles[i*Game.map.columns+element.sx]==VDOOR)
                    {
                        already_door = true;
                        generated_doors++;
                        break;
                    }
                if(!already_door)
                {
                    door_position = Math.random(element.sy+1,element.ey-1);
                    if(Game.map.tiles[door_position*Game.map.columns+element.sx] == VWALL)
                    {
                        Game.map.tiles[door_position*Game.map.columns+element.sx]=VDOOR;
                        generated_doors++;
                    }
                }
            }
            if(nrooms & 0x2 && element.sy !=0 )
            {
                already_door = false;
                ind = element.sy*Game.map.columns;
                for(var i=element.sx;i<=element.ex;i++)
                    if(Game.map.tiles[ind+i]==HDOOR)
                    {
                        already_door = true;
                        generated_doors++;
                        break;
                    }
                if(!already_door)
                {
                    door_position = Math.random(element.sx+1,element.ex-1);
                    if(Game.map.tiles[ind+door_position]==HWALL)
                    {
                        Game.map.tiles[ind+door_position]=HDOOR;
                        generated_doors++;
                    }
                }
            }
            if(nrooms & 0x4 && element.ex!=Game.map.columns-1)
            {
                already_door = false;
                for(var i=element.sy;i<element.ey;i++)
                    if(Game.map.tiles[i*Game.map.columns+element.ex]==VDOOR)
                    {
                        already_door = true;
                        generated_doors++;
                        break;
                    }
                if(!already_door)
                {
                    door_position = Math.random(element.sy+1,element.ey-1);
                    if(Game.map.tiles[door_position*Game.map.columns+element.ex] == VWALL)
                    {
                        Game.map.tiles[door_position*Game.map.columns+element.ex]=VDOOR;
                        generated_doors++;
                    }
                }

            }
            if(nrooms & 0x8 && element.ey!=Game.map.rows-1)
            {
                already_door = false;
                ind = element.ey*Game.map.columns;
                for(var i=element.sx;i<=element.ex;i++)
                    if(Game.map.tiles[ind+i]==HDOOR)
                    {
                        already_door = true;
                        generated_doors++;
                        break;
                    }
                if(!already_door)
                {
                    door_position = Math.random(element.sx+1,element.ex-1);
                    if(Game.map.tiles[ind+door_position]==HWALL)
                    {
                        Game.map.tiles[ind+door_position]=HDOOR;
                        generated_doors++;
                    }
                }

            }
        }
    });

    //player position
    var room = Math.random(0,Game.map.rooms.length-1);
    Game.player.position.x = Math.random(Game.map.rooms[room].sx+2,Game.map.rooms[room].ex-2);
    Game.player.position.y = Math.random(Game.map.rooms[room].sy+2,Game.map.rooms[room].ey-2);
    if(Game.level>0)
        Game.map.tiles[Game.player.position.y*Game.map.columns+Game.player.position.x]=TRAP;
    floodFill_accessible(Game.player.position.x,Game.player.position.y);
    
    //remove non accessible rooms
    Game.map.rooms.slice().reverse().forEach(function(item, index, object) {
        if(Game.map.accessible[Math.floor((item.sy+item.ey)/2)*Game.map.columns+Math.floor((item.sx+item.ex)/2)]==undefined)
            Game.map.rooms.splice(object.length - 1 - index, 1);
    });

    //uncover spawn room
    Game.player.room = whichRoom(Game.player.position.x,Game.player.position.y);
    uncover(Game.player.position.x,Game.player.position.y,Game.player.room);
    
    //stairs
    var x,y;
    do
    {
        room = Math.random(0,Game.map.rooms.length-1);
        x = Math.random(Game.map.rooms[room].sx+2,Game.map.rooms[room].ex-2);
        y = Math.random(Game.map.rooms[room].sy+2,Game.map.rooms[room].ey-2);
    }
    while((x==Game.player.position.x && y==Game.player.position.y) ||
        !Game.map.tiles[y*Game.map.columns+x].accessible ||
        Game.objects[y*Game.map.columns+x]!=undefined);

    Game.objects[y*Game.map.columns+x] = STAIRS;
    do
    {
        room = Math.random(0,Game.map.rooms.length-1);
        x = Math.random(Game.map.rooms[room].sx+2,Game.map.rooms[room].ex-2);
        y = Math.random(Game.map.rooms[room].sy+2,Game.map.rooms[room].ey-2);
    }
    while((x==Game.player.position.x && y==Game.player.position.y) ||
        !Game.map.tiles[y*Game.map.columns+x].accessible ||
        Game.objects[y*Game.map.columns+x]!=undefined || 
        Game.map.tiles[y*Game.map.columns+x]==HDOOR ||
        Game.map.tiles[y*Game.map.columns+x]==VDOOR);

    var a = Math.random(0,2);
    switch(a)
    {
        case 0: Game.objects[y*Game.map.columns+x] = FIRESHARD;break;
        case 1: Game.objects[y*Game.map.columns+x] = ICESHARD;break;
        case 2: Game.objects[y*Game.map.columns+x] = THUNDERSHARD;break;
    }
    Game.kstatus = Status.MAP;
}

function splitV(sx,sy,ex,ey,entry,iteration,maxiteration)
{
    if(++iteration>maxiteration || (ex-sx)<12)
        return;
    Game.map.rooms.splice(entry,1);
    var xsplit = Math.random(sx+6,ex-6);
    var offsplit = sx+xsplit;

    splitH(sx,sy,xsplit,ey,Game.map.rooms.push({sx:sx,ex:xsplit,sy:sy,ey:ey})-1,iteration,maxiteration);
    splitH(xsplit,sy,ex,ey,Game.map.rooms.push({sx:xsplit,sy:sy,ex:ex,ey:ey})-1,iteration,maxiteration);
}

function splitH(sx,sy,ex,ey,entry,iteration,maxiteration)
{
    if(++iteration>maxiteration || (ey-sy)<12)
        return;

    Game.map.rooms.splice(entry,1);
    var ysplit = Math.random(sy+6,ey-6);
    var offsplit = sy+ysplit;

    splitV(sx,sy,ex,ysplit,Game.map.rooms.push({sx:sx,sy:sy,ex:ex,ey:ysplit})-1,iteration,maxiteration);
    splitV(sx,ysplit,ex,ey,Game.map.rooms.push({sx:sx,sy:ysplit,ex:ex,ey:ey})-1,iteration,maxiteration);
}
var counter = 0;
function floodFill_accessible(x,y)
{
    if(Game.map.accessible[y*Game.map.columns+x]==1)
        return;
    var tile = Game.map.tiles[y*Game.map.columns+x];
    if(tile==undefined)
        return;
    if(tile.accessible)
    {
        Game.map.accessible[y*Game.map.columns+x]=1;
        floodFill_accessible(x+1,y);
        floodFill_accessible(x-1,y);
        floodFill_accessible(x,y+1);
        floodFill_accessible(x,y-1);
    }
}

function floodFill_uncover(x,y)
{
    if(Game.map.hidden[y*Game.map.columns+x]==0)
        return;
    var tile = Game.map.tiles[y*Game.map.columns+x];
    if(tile==undefined)
        return;
    Game.map.hidden[y*Game.map.columns+x] = 0;
    if(tile.accessible && tile!=HDOOR && tile!=VDOOR && tile!=BHDOOR && tile!=BVDOOR)
    {
        floodFill_uncover(x+1,y);
        floodFill_uncover(x-1,y);
        floodFill_uncover(x,y+1);
        floodFill_uncover(x,y-1);
    }
}

function uncover(x,y,room)
{
    floodFill_uncover(x,y); 
    Game.map.hidden[Game.map.rooms[room].sy*Game.map.columns+Game.map.rooms[room].sx]=0;
    Game.map.hidden[Game.map.rooms[room].sy*Game.map.columns+Game.map.rooms[room].ex]=0;
    Game.map.hidden[Game.map.rooms[room].ey*Game.map.columns+Game.map.rooms[room].sx]=0;
    Game.map.hidden[Game.map.rooms[room].ey*Game.map.columns+Game.map.rooms[room].ex]=0;

}

function whichRoom(x,y)
{
    for(var i=0;i<Game.map.rooms.length;i++)
    {
        if(x>=Game.map.rooms[i].sx &&
           x<Game.map.rooms[i].ex  && //shared corner and border belong to the leftmost room
            y>=Game.map.rooms[i].sy &&
            y<Game.map.rooms[i].ey) //shared corner and border belong to the uppermost room
        return i;
    }
}

function spawnEnemies(level)
{
    var rooms = Game.map.rooms.concat([]); //deep copy array
    var spliced = [];
    spliced.push(rooms.splice(Game.player.room,1));
    var enemycount,minpower,maxpower,minhp,maxhp;
    switch(level)
    {
        case 1: enemycount = 2;minpower = 10;maxpower = 30;minhp = 80; maxhp=120;break;
        case 2: enemycount = 3;minpower = 30;maxpower = 50;minhp = 180; maxhp = 250;break;
        case 3: enemycount = 4;minpower = 50;maxpower = 99;minhp = 220; maxhp=320;break;
        case 4: enemycount = 4;minpower = 70;maxpower = 120; minhp = 380; maxhp = 420;break;
        case 5: enemycount = 5;minpower = 80;maxpower = 199; minhp = 480; maxhp = 520;break;
        case 6: enemycount = Math.random(5,6);minpower = 120; minhp = 580; maxhp = 620; maxpower = 199;break;
        case 7: enemycount = Math.random(5,7);minpower = 150; maxpower = 220; minhp = 650; maxhp = 750;break;
        case 8: enemycount = Math.random(6,7);minpower = 190; maxpower = 270; minhp = 700; maxhp = 820;break;
        case 9: enemycount = Math.random(6,10);minpower = 230; maxpower = 300;minhp = 750; maxhp = 920;break;
        case 10:enemycount = 1;minpower = 290;maxpower = 300;minhp = 1000; maxhp = 1500;break;
        default: break;
    }
    var i = 0;
    while(i<enemycount)
    {
        if(rooms.length==0)
        {
            rooms = Game.map.rooms.concat([]);
            spliced = [];
        }
        var selected_room = Math.random(0,rooms.length-1);
        var spawnedx = Math.random(rooms[selected_room].sx+2,rooms[selected_room].ex-2);
        var spawnedy = Math.random(rooms[selected_room].sy+2,rooms[selected_room].ey-2);
        var spawned = new Npc(i+Math.random(0,500),spawnedx,spawnedy,Math.random(minhp,maxhp),ENEMY,Math.random(0,1),Math.random(minpower,maxpower),Math.random(minpower,maxpower),AI);
        var target = spawned.position.y*Game.map.columns+spawned.position.x;
        if(Game.map.tiles[target]!=undefined && Game.map.tiles[target].accessible && Game.npcs[target]==undefined && Game.map.tiles[target]!=HDOOR && Game.map.tiles[target]!=VDOOR)
        {
            if(level<3)
                spliced.push(rooms.splice(selected_room,1));
            Game.npcs[spawned.position.y*Game.map.columns+spawned.position.x] = spawned;
            Game.enemies_left++;
            i++;
        }
    }
}

function AI(ppos) //ppos:player position
{

    if(this.turn == Game.turn) //avoid processing multiple times
        return;
    else
        this.turn++;
    var xtarget,ytarget,xthreshold,ythreshold;
    if(this.spell.charAt(0)=='t')
    {
        xtarget = 0;
        ytarget = 4;
        xthreshold = 1;
        ythreshold = 1;
    }
    else
    {
        xtarget = 0;
        ytarget = 3;
        xthreshold = 3;
        ythreshold = 0;
    }
    if(this.aistatus == 1)
    {
        this.model=ENEMY;
        if(Game.player.room == this.room)
        {
            this.aistatus = 0; //start chasing from the next turn
            this.model=ENEMYALERT;
        }
        else //roam around the room
        {
            var act = Math.random(1,10);
            if(act<4 || this.wanderingDirection==undefined) //change direction
            {
                do
                {
                    this.wanderingDirection = {x:Math.random(-1,1),y:Math.random(-1,1)};
                }
                while(!(Math.abs(this.wanderingDirection.x)^Math.abs(this.wanderingDirection.y)));
            }
            var target = (this.position.y+this.wanderingDirection.y)*Game.map.columns+this.wanderingDirection.x+this.position.x;
            var tile = Game.map.tiles[target];
            if(tile!=undefined && tile.accessible && tile!=HDOOR && tile!=VDOOR && tile!= BHDOOR && tile!=BVDOOR &&
               Game.overlay[target]==undefined && Game.objects[target]!=STAIRS && Game.objects[target]!=BSTAIRS && Game.npcs[target]==undefined)
            {
                if(!Game.skills[2] || Game.skills[2] && Math.random(1,10)>6)
                {
                    Game.npcs[target] = this;
                    Game.npcs[this.position.y*Game.map.columns+this.position.x] = undefined;
                    this.position.x += this.wanderingDirection.x;
                    this.position.y += this.wanderingDirection.y;
                }
            }
            else
                this.wanderingDirection = undefined;
        }
    }
    else if(!this.aistatus)  //chase
    {
        if(Game.player.room != this.room)
            this.aistatus = 7;
        var movex = 0;
        var movey = 0;
        if(this.escapeDirection.escaping > 0)
        {
            var old_target = this.position.y*Game.map.columns+this.position.x;
            var target = (this.position.y+this.escapeDirection.y)*Game.map.columns+this.position.x+this.escapeDirection.x;
            if(Game.map.tiles[target] != undefined && Game.map.tiles[target].accessible && Game.npcs[target]==undefined)
            {
                movex = this.escapeDirection.x;
                movey = this.escapeDirection.y;
            }
            else
                this.escapeDirection.escaping = 0;
        }
        if(this.escapeDirection.escaping == 0)
        {
            this.model = ENEMY;
            var distancex = Math.abs(this.position.x-ppos.x);
            var distancey = Math.abs(this.position.y-ppos.y);
            var offsetx1 = Math.abs(distancex-xtarget); //decide if it is better to position on top or side of player
            var offsetx2 = Math.abs(distancex-ytarget);
            var offsety1 = Math.abs(distancey-ytarget);
            var offsety2 = Math.abs(distancey-xtarget);
            var casted = false;
            if(offsetx1+offsety1 < offsetx2+offsety2) //align top or bottom
            {   
                if((!offsetx1 && !offsety1 && Math.random(1,10)<10) ||
                    (offsetx1 <= xthreshold && offsety1 <= ythreshold && Math.random(1,10)<4)) //90% casting chance when player was in range || 30% random cast when below threshold
                    casted = cast_enemy(this.position,this.spell,false,this);
                if(!casted && offsetx1 > offsety1) //align on x
                {
                    if((this.position.x-ppos.x)>0) //right of the alignment poin
                        movex=distancex-xtarget>0?-1:1;  //if positive I'm too far else I'm too near
                    else
                        movex=distancex-xtarget>0?1:-1;
                }
                else if(!casted && offsety1 > offsetx1)
                {
                    if((this.position.y-ppos.y)>0) //below player
                        movey=distancey-ytarget>0?-1:1;
                    else
                        movey=distancey-ytarget>0?1:-1; 
                }
            }
            else //align on left or right
            {
                if((!offsetx2 && !offsety2 && Math.random(1,10)<10) ||
                    (offsetx2 <= ythreshold && offsety2 <= xthreshold && Math.random(1,10)<4)) //90% casting chance when player was in range || 30% random cast when below threshold
                    casted = cast_enemy(this.position,this.spell,true,this);

                if(!casted && offsetx2 > offsety2) //align on x
                {
                    if((this.position.x-ppos.x)>0) //right of the alignment poin
                        movex=distancex-ytarget>0?-1:1;  //if positive I'm too far else I'm too near
                    else
                        movex=distancex-ytarget>0?1:-1;
                }
                else if(!casted && offsety2 > offsetx2)
                {
                    if((this.position.y-ppos.y)>0) //below player
                        movey=distancey-xtarget>0?-1:1;
                    else
                        movey=distancey-xtarget>0?1:-1; 
                }
            }
        }
        var target = (this.position.y+movey)*Game.map.columns+movex+this.position.x;
        var old_target = this.position.y*Game.map.columns+this.position.x;
        var tile = Game.map.tiles[target];
        if(tile!=undefined && tile.accessible && tile!=HDOOR && tile!=VDOOR && tile!= BHDOOR && tile!=BVDOOR &&
            //don't run on ice or fire, or run on fire with small chance or run on fire if already on fire
           (Game.overlay[target]==undefined || (Game.overlay[target].type==0 && (Math.random(1,10)<1 || (Game.overlay[old_target]!=undefined && Game.overlay[old_target].type==0)))) && 
           Game.objects[target]!=STAIRS && Game.objects[target]!=BSTAIRS && Game.npcs[target]==undefined &&
           (this.position.x+movex != Game.player.position.x && this.position.y+movey != Game.player.position.y))
        {
            if(!Game.skills[2] || (Game.skills[2] && Math.random(1,10)>6))
            {
                this.position.x += movex;
                this.position.y += movey;
                Game.npcs[target] = this;
                Game.npcs[old_target] = undefined;
            }
        }
        else
        {
            if(Math.random(1,10)>7 || (Math.random(1,10)==1 && this.aitype == 2))
            {
                if(movex)
                {
                    this.escapeDirection.escaping = 3;
                    this.escapeDirection.x = 0;
                    this.escapeDirection.y = Math.random(0,1)?-1:1;
                }
                else
                {
                    this.escapeDirection.escaping = 3;
                    this.escapeDirection.x = Math.random(0,1)?-1:1;
                    this.escapeDirection.y = 0;
                }
            }
            else if(this.aitype == 1)
            {
                cast_enemy(this.position,this.spell,Math.random(0,1),this);
            }
        }
    }
    else if(this.aistatus == 99); //lumina spell
    else //wait some turns
    {
        this.model = ENEMYGONE;
        if(Game.player.room == this.room)
        {
            this.aistatus = 0;
            this.model = ENEMYALERT;
        }
        else
            this.aistatus--;
    }
}

function cast_enemy(position,magic,side,enemy)
{
    if(Game.skills[19] && (Math.random(1,100)<15))
    {
        console.log("The enemy was so scared of you that he managed to hit himself with the spell");
        Game.aimed.push({x:position.x,y:position.y,caster:enemy,type:magic});
    }
    if(!side)
    {
        var isTop = Game.player.position.y < position.y?1:-1;
        switch(magic.charAt(0))
        {
            case "f":
                {
                    var target1 = (position.y-1*isTop)*Game.map.columns+position.x;
                    var target2 = (position.y-2*isTop)*Game.map.columns+position.x;
                    var target3 = (position.y-3*isTop)*Game.map.columns+position.x;
                    if(Game.map.tiles[target1] != undefined && Game.map.tiles[target1].accessible &&
                        Game.map.tiles[target2] != undefined && Game.map.tiles[target2].accessible &&
                        Game.map.tiles[target3] != undefined && Game.map.tiles[target3].accessible)
                    {
                        Game.aimed.push({x:position.x,y:position.y-3*isTop,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x+1] != undefined &&
                           Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x+1].accessible &&
                           Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x+2] != undefined &&
                           Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x+2].accessible)
                        Game.aimed.push({x:position.x+2,y:position.y-3*isTop,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x-1] != undefined &&
                           Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x-1].accessible &&
                           Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x-2] != undefined &&
                           Game.map.tiles[(position.y-3*isTop)*Game.map.columns+position.x-2].accessible)
                        Game.aimed.push({x:position.x-2,y:position.y-3*isTop,caster:enemy,type:magic});
                        return true;
                    }
                    break;
                }
            case "g":
                {
                    var target1 = (position.y-1*isTop)*Game.map.columns+position.x;
                    var target2 = (position.y-2*isTop)*Game.map.columns+position.x;
                    if(Game.map.tiles[target1] != undefined && Game.map.tiles[target1].accessible &&
                        Game.map.tiles[target2] != undefined && Game.map.tiles[target2].accessible)
                    {
                        Game.aimed.push({x:position.x,y:position.y-2*isTop,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y-2*isTop)*Game.map.columns+position.x-1] != undefined &&
                            Game.map.tiles[(position.y-2*isTop)*Game.map.columns+position.x-1].accessible)
                        Game.aimed.push({x:position.x-1,y:position.y-2*isTop,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y-2*isTop)*Game.map.columns+position.x+1] != undefined &&
                            Game.map.tiles[(position.y-2*isTop)*Game.map.columns+position.x+1].accessible)
                        Game.aimed.push({x:position.x+1,y:position.y-2*isTop,caster:enemy,type:magic});
                        return true;    
                    }
                }
            case "t":
                {
                    var target4 = (position.y-4*isTop)*Game.map.columns+position.x;
                    var target3 = (position.y-3*isTop)*Game.map.columns+position.x;
                    var target2 = (position.y-2*isTop)*Game.map.columns+position.x;
                    var target1 = (position.y-1*isTop)*Game.map.columns+position.x;

                    if(Game.map.tiles[target1] != undefined && Game.map.tiles[target1].accessible &&
                        Game.map.tiles[target2] != undefined && Game.map.tiles[target2].accessible &&
                        Game.map.tiles[target3] != undefined && Game.map.tiles[target3].accessible &&
                        Game.map.tiles[target4] != undefined && Game.map.tiles[target4].accessible)
                    {
                        Game.aimed.push({x:position.x,y:position.y-4*isTop,caster:enemy,type:magic});
                        return true;
                    }
                    break;
                }
        }
    }
    else
    {
        var isLeft = Game.player.position.x < position.x?1:-1;
        switch(magic.charAt(0))
        {
            case "f":
                {
                    var target1 = position.y*Game.map.columns+position.x-1*isLeft;
                    var target2 = position.y*Game.map.columns+position.x-2*isLeft;
                    var target3 = position.y*Game.map.columns+position.x-3*isLeft;
                    if(Game.map.tiles[target1] != undefined && Game.map.tiles[target1].accessible &&
                        Game.map.tiles[target2] != undefined && Game.map.tiles[target2].accessible &&
                        Game.map.tiles[target3] != undefined && Game.map.tiles[target3].accessible)
                    {
                        Game.aimed.push({x:position.x-3*isLeft,y:position.y,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y+1)*Game.map.columns+position.x-3*isLeft] != undefined &&
                           Game.map.tiles[(position.y+1)*Game.map.columns+position.x-3*isLeft].accessible &&
                           Game.map.tiles[(position.y+2)*Game.map.columns+position.x-3*isLeft] != undefined &&
                           Game.map.tiles[(position.y+2)*Game.map.columns+position.x-3*isLeft].accessible)
                        Game.aimed.push({x:position.x-3*isLeft,y:position.y+2,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y-1)*Game.map.columns+position.x-3*isLeft] != undefined &&
                           Game.map.tiles[(position.y-1)*Game.map.columns+position.x-3*isLeft].accessible &&
                           Game.map.tiles[(position.y-2)*Game.map.columns+position.x-3*isLeft] != undefined &&
                           Game.map.tiles[(position.y-2)*Game.map.columns+position.x-3*isLeft].accessible)
                        Game.aimed.push({x:position.x-3*isLeft,y:position.y-2,caster:enemy,type:magic});
                        return true;
                    }
                    break;
                }
            case "g":
                {
                    var target1 = position.y*Game.map.columns+position.x-1*isLeft;
                    var target2 = position.y*Game.map.columns+position.x-2*isLeft;
                    if(Game.map.tiles[target1] != undefined && Game.map.tiles[target1].accessible &&
                        Game.map.tiles[target2] != undefined && Game.map.tiles[target2].accessible)
                    {
                        Game.aimed.push({x:position.x-2*isLeft,y:position.y,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y+1)*Game.map.columns+position.x-2*isLeft] != undefined &&
                            Game.map.tiles[(position.y+1)*Game.map.columns+position.x-2*isLeft].accessible)
                        Game.aimed.push({x:position.x-2*isLeft,y:position.y+1,caster:enemy,type:magic});
                        if(Game.map.tiles[(position.y-1)*Game.map.columns+position.x-2*isLeft] != undefined &&
                            Game.map.tiles[(position.y-1)*Game.map.columns+position.x-2*isLeft].accessible)
                        Game.aimed.push({x:position.x-2*isLeft,y:position.y-1,caster:enemy,type:magic});
                        return true;    
                    }
                    break;
                }
            case "t":
                {
                    var target4 = position.y*Game.map.columns+position.x-4*isLeft;
                    var target3 = position.y*Game.map.columns+position.x-3*isLeft;
                    var target2 = position.y*Game.map.columns+position.x-2*isLeft;
                    var target1 = position.y*Game.map.columns+position.x-1*isLeft;
                    if(Game.map.tiles[target1] != undefined && Game.map.tiles[target1].accessible &&
                        Game.map.tiles[target2] != undefined && Game.map.tiles[target2].accessible &&
                        Game.map.tiles[target3] != undefined && Game.map.tiles[target3].accessible &&
                        Game.map.tiles[target4] != undefined && Game.map.tiles[target4].accessible)
                    {
                        Game.aimed.push({x:position.x-4*isLeft,y:position.y,caster:enemy,type:magic});
                        return true;
                    }
                    break;
                }
        }
    }
    return false;
}
