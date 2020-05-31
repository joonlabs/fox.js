window.onload = async function(){
    await loadEngine();
    fox.init({width:320,height:180})
    fox.project.logFPS = true
    
    //add scenes
    let gameScene = new Scene()
    
    //layers 
    let layer_background = new Layers.Canvas({id:"layer_background", width:320, height:180})
    let layer_foreground = new Layers.Canvas({id:"layer_foreground", width:320, height:180})
    let layer_lightning = new Layers.Lightning({id:"layer_lightning", width:320, height:180})
    gameScene.addLayer({layer: layer_background})
    gameScene.addLayer({layer: layer_foreground})
    gameScene.addLayer({layer: layer_lightning})
    
    fox.addScene({scene:gameScene})
    fox.setActiveScene({scene:gameScene})
    
    //add cameras
    camera1 = new Cameras.Camera()
    camera2 = new Cameras.Camera({x:-200, y:-100, viewport:{x:260, y: 10, width:50, height: 30}, zoom:0.1})
    fox.addCamera({camera:camera1})
    fox.addCamera({camera:camera2})
    
    //load sprites into memory
    Assetmanager.add("image", "background", (new Assets.Image({src:"js/src/sprites/background/1.png",width:246,height:178})))
    Assetmanager.add("image", "wall_v", (new Assets.Image({src:"js/src/sprites/wall.png",width:10,height:178*4})))
    Assetmanager.add("image", "wall_h", (new Assets.Image({src:"js/src/sprites/wall.png",width:246*2,height:10})))
    
    Assetmanager.add("image", "player1", (new Assets.Animation({framesrcs: [
        {frame: 0, asset:(new Assets.Image({src:"js/src/sprites/p1/1.png", width: 15, height: 16}))},
        {frame: 15, asset:(new Assets.Image({src:"js/src/sprites/p1/2.png", y:1, width: 15, height: 16}))},
    ], repeatat: 30})))
    
    Assetmanager.add("image", "player2", (new Assets.Animation({framesrcs: [
        {frame: 0, asset:(new Assets.Image({src:"js/src/sprites/p2/1.png", width: 15, height: 16}))},
        {frame: 20, asset:(new Assets.Image({src:"js/src/sprites/p2/2.png", y:1, width: 15, height: 16}))},
    ], repeatat: 40})))
    
    //game objects 
    let backgrounds = []
    backgrounds.push(new Sprite({x:246*0,y:178*0,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    backgrounds.push(new Sprite({x:246*1,y:178*0,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    backgrounds.push(new Sprite({x:246*0,y:178*1,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    backgrounds.push(new Sprite({x:246*1,y:178*1,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    backgrounds.push(new Sprite({x:246*0,y:178*2,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    backgrounds.push(new Sprite({x:246*1,y:178*2,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    backgrounds.push(new Sprite({x:246*0,y:178*3,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    backgrounds.push(new Sprite({x:246*1,y:178*3,width:246,height:178,layer:layer_background,tag:"background",assetkey:"background",debug:{hitbox:false,sprite:true}}));
    
    let showHitbox = false
    let hitplayer = false
    
    player1 = new Sprite({x:20,y:10,width:15,height:15,layer:layer_foreground,tag:"player",assetkey:"player1",debug:{hitbox:showHitbox,sprite:true}})
    player2 = new Sprite({x:50,y:50,width:15,height:15,layer:layer_foreground,tag:"player",assetkey:"player2",debug:{hitbox:showHitbox,sprite:true}})
    let light1 = new Lights.PointLight({x:0, y:0, layer:layer_lightning, radius:50, intensity:1})
    let light2 = new Lights.PointLight({x:0, y:0, layer:layer_lightning, radius:50, intensity:1})
    let globallight = new Lights.GlobalLight({layer:layer_lightning, intensity:.35})
    
    //walls
    let walls = []
    walls.push(new Sprite({x:0,y:0,width:10,height:178*4,layer:layer_foreground,tag:"wall",assetkey:"wall_v",debug:{hitbox:showHitbox,sprite:true}}));
    walls.push(new Sprite({x:246*2-10,y:0,width:10,height:178*4,layer:layer_foreground,tag:"wall",assetkey:"wall_v",debug:{hitbox:showHitbox,sprite:true}}));
    walls.push(new Sprite({x:0,y:0,width:246*2,height:10,layer:layer_foreground,tag:"wall",assetkey:"wall_h",debug:{hitbox:showHitbox,sprite:true}}));
    walls.push(new Sprite({x:0,y:178*4-10,width:246*2,height:10,layer:layer_foreground,tag:"wall",assetkey:"wall_h",debug:{hitbox:showHitbox,sprite:true}}));
    
    light1.followGameObject({gameobject: player1})
    light2.followGameObject({gameobject: player2})
    
    playerAllowedMoving = [{l:true,r:true,t:true,b:true}, {l:true,r:true,t:true,b:true}]
    player1.calc = function(_this=this){
        let speed =  2.8
        if(Input.isKeyDown({key:Input.keys.A})) _this.position.x -= playerAllowedMoving[0].l ? speed : 0;
        if(Input.isKeyDown({key:Input.keys.D})) _this.position.x += playerAllowedMoving[0].r ? speed : 0;
        if(Input.isKeyDown({key:Input.keys.W})) _this.position.y -= playerAllowedMoving[0].t ? speed : 0;
        if(Input.isKeyDown({key:Input.keys.S})) _this.position.y += playerAllowedMoving[0].b ? speed : 0;
        
        playerAllowedMoving[0] = {l:true,r:true,t:true,b:true}
    }
    
    player1.onCollisionEnter = function({collision}, _this=this){
        if(collision.object.tag=="wall"){
            if(_this.position.x<collision.object.position.x) playerAllowedMoving[0].r = false
            if(_this.position.x>collision.object.position.x) playerAllowedMoving[0].l = false
            if(_this.position.y>collision.object.position.y) playerAllowedMoving[0].t = false
            if(_this.position.y<collision.object.position.y) playerAllowedMoving[0].b = false
        }
        if(collision.object.tag=="player" && !hitplayer){
            hitplayer = true
            camera1.shake({min:7,max:20,duration:2500,smoothout:true})
            setTimeout(function(){hitplayer=false},1500)
        }
    }
    
    player2.calc = function(_this=this){
        let speed =  2.5
        if(Input.isKeyDown({key:Input.keys.Left})) _this.position.x -= playerAllowedMoving[1].l ? speed : 0;
        if(Input.isKeyDown({key:Input.keys.Right})) _this.position.x += playerAllowedMoving[1].r ? speed : 0;
        if(Input.isKeyDown({key:Input.keys.Up})) _this.position.y -= playerAllowedMoving[1].t ? speed : 0;
        if(Input.isKeyDown({key:Input.keys.Down})) _this.position.y += playerAllowedMoving[1].b ? speed : 0;
        
        playerAllowedMoving[1] = {l:true,r:true,t:true,b:true}
    }
    player2.onCollisionEnter = function({collision}, _this=this){
        if(collision.object.tag=="wall"){
            if(_this.position.x<collision.object.position.x) playerAllowedMoving[1].r = false
            if(_this.position.x>collision.object.position.x) playerAllowedMoving[1].l = false
            if(_this.position.y>collision.object.position.y) playerAllowedMoving[1].t = false
            if(_this.position.y<collision.object.position.y) playerAllowedMoving[1].b = false
        }
    }
    
    for(let wall of walls){
        gameScene.objectmanager.addObject({object:wall})
    }
    
    gameScene.objectmanager.addObject({object:player1})
    gameScene.objectmanager.addObject({object:player2})
    gameScene.objectmanager.addObject({object:globallight})
    gameScene.objectmanager.addObject({object:light1})
    gameScene.objectmanager.addObject({object:light2})
    
    for(let bg of backgrounds){
        gameScene.objectmanager.addObject({object:bg})
    }
    
    camera1.followObject({object:player1})
}