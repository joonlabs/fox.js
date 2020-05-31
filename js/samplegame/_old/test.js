window.onload = async function(){
    await initVox()
    
    //init fox engine
    fox.init({width:320,height:180})
    fox.project.logFPS = true
    
    //Add Cameras
    fox.addCamera({key:"firstPlayer",camera:(new Cameras.Camera({viewport:{width:160}}))})
    fox.addCamera({key:"secondPlayer",camera:(new Cameras.Camera({viewport:{x:160,width:160}}))})
    
    //Load Sprites in Memory
    fox.assetmanager.add("image", "player1", (new Assets.Image({src:"js/sprites/p1/1.png"})))
    fox.assetmanager.add("image", "background", (new Assets.Image({src:"js/background.png",width:246,height:178})))
    
    fox.assetmanager.add("image", "player1", (new Assets.Animation({framesrcs: [
        {frame: 0, asset:(new Assets.Image({src:"js/sprites/p1/1.png", width: 15, height: 16}))},
        {frame: 15, asset:(new Assets.Image({src:"js/sprites/p1/2.png", y:1, width: 15, height: 16}))},
    ], repeatat: 30})))
    
    fox.assetmanager.add("image", "player2", (new Assets.Animation({framesrcs: [
        {frame: 0, asset:(new Assets.Image({src:"js/sprites/p2/1.png", width: 15, height: 16}))},
        {frame: 20, asset:(new Assets.Image({src:"js/sprites/p2/2.png", y:1, width: 15, height: 16}))},
    ], repeatat: 40})))
    
    fox.assetmanager.add("audio", "themeA", (new Assets.Audio({src:"js/audio/themeA_short.mp3"})))
    
    //Create Layers
    layerBackground = new Layers.Canvas({id:"layerBackground"})
    layerSprites = new Layers.Canvas({id:"layerSprites"})
    layerLightning = new Layers.Lightning({id:"layerLightning"})
    fox.addLayer({layer:layerBackground})
    fox.addLayer({layer:layerSprites})
    fox.addLayer({layer:layerLightning})

    layerBackground.postprocessing.saturate = 1.5
    layerSprites.postprocessing.contrast = 1.5
    
    //Create Starting Scene
    let sceneDefault = new Scene()
    fox.addScene({key:"default", scene:sceneDefault})
    fox.setActiveScene({key:"default"})
    
    //Create GameObjects for Scene
    sceneDefault.objectmanager.addObject(new Sprite({x:0,y:0,width:246,height:178,layer:layerBackground,assetkey:"background",/*debug:{hitbox:true,sprite:false}*/}))
    sceneDefault.objectmanager.addObject(new Sprite({x:246,y:0,width:246,height:178,layer:layerBackground,assetkey:"background",/*debug:{hitbox:true,sprite:false}*/}))
    sceneDefault.objectmanager.addObject(new Sprite({x:0,y:173,width:246,height:178,layer:layerBackground,assetkey:"background",/*debug:{hitbox:true,sprite:false}*/}))
    sceneDefault.objectmanager.addObject(new Sprite({x:246,y:173,width:246,height:178,layer:layerBackground,assetkey:"background",/*debug:{hitbox:true,sprite:false}*/}))
    
    player1 = new Sprite({x:260,y:160,width:15,height:15,layer:layerSprites,tag:"player",assetkey:"player1",debug:{hitbox:false,sprite:true}})
    player2 = new Sprite({x:320,y:160,width:15,height:15,layer:layerSprites,tag:"player",assetkey:"player2",debug:{hitbox:false,sprite:true}})
    
    
    //Lights
    light_global = new Lights.PointLight({x:160,y:90,layer:layerLightning,radius:2000,intensity:.5})
    light1 = new Lights.PointLight({x:0,y:0,layer:layerLightning,radius:60,fallout:30,intensity:1})
    light1.followGameObject({gameobject:player1})
    
    light2 = new Lights.PointLight({x:0,y:0,layer:layerLightning,radius:60,hue:{r:0,g:20,b:0},intensity:1})
    light2.followGameObject({gameobject:player2})
    
    
    sceneDefault.objectmanager.addObject(player1)
    sceneDefault.objectmanager.addObject(player2)
    sceneDefault.objectmanager.addObject(light_global)
    sceneDefault.objectmanager.addObject(light1)
    sceneDefault.objectmanager.addObject(light2)
    
    //Camera Settings
    fox.cameras.firstPlayer.settings.mode = Cameras.Camera.modes.CENTER
    fox.cameras.firstPlayer.followGameObject({gameobject:player1})
    
    if(fox.cameras.secondPlayer!=undefined){
        fox.cameras.secondPlayer.settings.mode = Cameras.Camera.modes.CENTER
        fox.cameras.secondPlayer.followGameObject({gameobject:player2})
    }
    
//    let rotation = 0;
//    setInterval(function(){
//        rotation += 0.01
//        player1.rotation = Math.PI*(rotation%2)
//        player2.rotation = -Math.PI*(rotation%2)
//    }, 10)
    
//    setInterval(function(){sceneDefault.objectmanager.addObject((new Lights.PointLight({x:(Math.random()*1000-500),y:(Math.random()*1000-500),layer:layerLightning,radius:120,hue:{r:255,g:255,b:255},intensity:(Math.random())}))); if(!window.hasOwnProperty('counter')){counter=0}else{counter++;}console.log(counter)},10)

//    fox.cameras.firstPlayer.settings.zoom = 1.2
//    fox.cameras.secondPlayer.settings.zoom = .65
    
    //CALCULATIONS
    player1.calc = function(_this=this){
        let speed = 3*fox.fps.timestep
        let zoomfactor = 0
        let axisThreshold = .5
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.W}) || fox.inputcontroller.hasGamePad({idx:0}) && fox.inputcontroller.getGamePad({idx:0}).axes[1]<-axisThreshold){ _this.position.y -= speed }
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.D}) || fox.inputcontroller.hasGamePad({idx:0}) && fox.inputcontroller.getGamePad({idx:0}).axes[0]>axisThreshold){ _this.position.x += speed; fox.cameras.firstPlayer.settings.zoom *= 1 + zoomfactor }
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.S}) || fox.inputcontroller.hasGamePad({idx:0}) && fox.inputcontroller.getGamePad({idx:0}).axes[1]>axisThreshold) { _this.position.y += speed }
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.A}) || fox.inputcontroller.hasGamePad({idx:0}) && fox.inputcontroller.getGamePad({idx:0}).axes[0]<-axisThreshold){ _this.position.x -= speed; fox.cameras.firstPlayer.settings.zoom *= 1 /(1 + zoomfactor) }
    }
    
    player2.calc = function(_this=this){
        let speed = 2.5*fox.fps.timestep
        let zoomfactor = 0
        let axisThreshold = .5
        
        //if(fox.inputcontroller.hasGamePad({idx:1}) && fox.inputcontroller.getGamePad({idx:1}).buttons[1].pressed){ speed*=2 }
        
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.UP}) || fox.inputcontroller.hasGamePad({idx:1}) && fox.inputcontroller.getGamePad({idx:1}).axes[1]<-axisThreshold){ _this.position.y -= speed }
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.RIGHT}) || fox.inputcontroller.hasGamePad({idx:1}) && fox.inputcontroller.getGamePad({idx:1}).axes[0]>axisThreshold){ _this.position.x += speed; fox.cameras.firstPlayer.settings.zoom *= 1 + zoomfactor }
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.DOWN}) || fox.inputcontroller.hasGamePad({idx:1}) && fox.inputcontroller.getGamePad({idx:1}).axes[1]>axisThreshold) { _this.position.y += speed }
        if(fox.inputcontroller.isKeyDown({key:Inputcontroller.LEFT}) || fox.inputcontroller.hasGamePad({idx:1}) && fox.inputcontroller.getGamePad({idx:1}).axes[0]<-axisThreshold){ _this.position.x -= speed; fox.cameras.firstPlayer.settings.zoom *= 1 /(1 + zoomfactor) }
        
        
    }
    
    player2.limitCollisionTargetsTo({targets:["player"]})
    player2.onCollisionEnter = function({collision}={}){
        //alert("GETROFFEN")
        fox.cameras.secondPlayer.shake({max:25,min:0,duration:1500,smoothout:true})
        //setTimeout(function(){window.location.reload()}, 1000)
        if(collision.object.position.x<player2.position.x){
            player2.position.x += 20
        }else{
            player2.position.x -= 20
        }
    }
}