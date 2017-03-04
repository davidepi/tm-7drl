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
/*
Game.map.rows=13;
Game.map.columns=15;
Game.map.tiles=[TLCORNER,HWALL,HWALL,HWALL,HWALL,HWALL,HWALL,TDOWN,HWALL,HWALL,HWALL,HWALL,HWALL,HWALL,TRCORNER,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, TLCORNER, TUP, TRCORNER, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          TRIGHT, HDOOR, HWALL, HWALL, HWALL, HWALL, TLEFT, WATER, TRIGHT, HWALL, HWALL, HWALL, HWALL, HDOOR, TLEFT,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, BLCORNER, HDOOR, BRCORNER, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          VWALL, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, WOOD, VWALL,
          BLCORNER, HWALL, HWALL, HWALL, HWALL, HWALL, HWALL, HWALL, HWALL, HWALL, HWALL, HWALL ,HWALL ,HWALL, BRCORNER];
*/
generateMap(0);
render();

function endTurn()
{
    console.log(Game.player.position);
    document.getElementById("turn").innerHTML = ++Game.turn;
}

function generateMap(magnitude)
{
    Game.kstatus = Status.WAIT;
    if(!magnitude) //first function
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
        Game.player.position.y = Game.map.rows-2;
        Game.player.position.x = Math.random(1,Game.map.columns-2);
    }
}

function introHall()
{

}
