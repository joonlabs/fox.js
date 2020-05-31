import * as FOX from '../../fox/fox.js'
window.FOX = FOX //make FOX avaiable in console

let app = new FOX.Application({width: 320*5, height: 180*5})
window.app = app
document.body.appendChild(app.view)

FOX.AssetManager.addTexture({name:"test", asset:new FOX.Assets.Texture({src: "/js/test/_resources/peach.png"})})
FOX.AssetManager.onResourcesLoaded({callback:init})

function init(){        
    /*
    * INITIATION
    */
    let scene = new FOX.Scene()
    let camera = new FOX.Camera({
        x:0,
        y:0,
        viewport: {
            x:0,
            y:0,
            width: 320*5,
            height: 180*5
        }
    })
    let layer = new FOX.Layers.Canvas({
        width: 320*3, 
        height: 180*3
    })

    scene.addLayer({layer: layer})
    app.addCamera({camera: camera})
    app.addScene({scene: scene})
 
    
    // create test objects
    class Move{
        constructor(axis){
            this.dir = 1
            this.axis = axis
        }
        
        onCalc({object}={}){
            let deltaTime = window.app.fps.timestep
            if(FOX.Input.cursor.isdown || FOX.Input.getTouches().length>0) deltaTime*=.025
            if(rectangle.position[this.axis]<=100) this.dir=1 
            if(rectangle.position[this.axis]>=500) this.dir=-1

            rectangle.components[0].position[this.axis] += deltaTime * 5 * this.dir
            circle.components[0].position[this.axis] += deltaTime * -5 * this.dir

            player.components[0].rotation += Math.PI/60*.5 * deltaTime
            rectangle.components[0].rotation -= Math.PI/60*.15 * deltaTime
            circle.components[0].rotation -= Math.PI/60*.085 * deltaTime


            if(FOX.Input.getTouches().length>0){
                player.components[0].position.x = (FOX.Input.getTouches()[0].position.x-player.components[0].dimensions.width)/camera.settings.zoom
                player.components[0].position.y = (FOX.Input.getTouches()[0].position.y-player.components[0].dimensions.height)/camera.settings.zoom
            }else{
                if(FOX.Input.cursor.x!=0 && FOX.Input.cursor.y!=0){
                    player.components[0].position.x = (FOX.Input.cursor.x-player.components[0].dimensions.width/2)/camera.settings.zoom
                    player.components[0].position.y = (FOX.Input.cursor.y-player.components[0].dimensions.height/2)/camera.settings.zoom
                }                
            }

            if(FOX.CollisionManager.colliding({obj1: player.components[0], obj2: rectangle.components[0]})){
                player.color = new FOX.Color({r:255})
            }else if(FOX.CollisionManager.colliding({obj1: player.components[0], obj2: circle.components[0]})){
                player.color = new FOX.Color({r:255})
            }else{
                player.color = new FOX.Color()
            }
            
        }
        
        onAfterRender({renderer, object}={}){
            if(FOX.CollisionManager.colliding({obj1: player.components[0], obj2: rectangle.components[0]})){
                let collisions = FOX.CollisionManager.colliding({obj1: player.components[0], obj2: rectangle.components[0]})
                for(let col of collisions){
                    renderer.fillRect({x:col.x-5,y:col.y-5,width:10,height:10,color:new FOX.Color({r:255,g:255,b:0}),angleEnd:Math.PI*5, ctx:layer.ctx,rotationPosition:{x:0,y:0}})
                }
            }
            
            if(FOX.CollisionManager.colliding({obj1: player.components[0], obj2: circle.components[0]})){
                let collisions = FOX.CollisionManager.colliding({obj1: player.components[0], obj2: circle.components[0]})
                for(let col of collisions){
                    renderer.fillRect({x:col.x-5,y:col.y-5,width:10,height:10,color:new FOX.Color({r:255,g:255,b:0}),angleEnd:Math.PI*5, ctx:layer.ctx,rotationPosition:{x:0,y:0}})
                }
            }
        }
    }
    
    window.rectangle = new FOX.GameObjects.Rectangle({x:250,y:200,width:500,rotation:90, color:FOX.Random.color(),layer:layer,debug:{hitbox:true}})
    window.rectangle.addComponent({component: new FOX.Colliders.RectangleCollider({width:450,height:50,offset:{x:25,y:25},rotationPosition:{x:0,y:0},rotation:Math.PI*0,debug:{hitbox:true}})})
    window.rectangle.addComponent({component: new Move("y")})
    scene.objectmanager.addObject({object:window.rectangle})
    
    window.circle = new FOX.GameObjects.Circle({x: 800, y:550, radius: 50, color: FOX.Random.color(), angleEnd: Math.PI*5, layer:layer, z: 0, debug:{hitbox:true}})
    window.circle.addComponent({component: new FOX.Colliders.CircleCollider({width:50,height:50,offset:{x:25,y:25},debug:{hitbox:true}})})
    scene.objectmanager.addObject({object:window.circle})
    
    window.player = new FOX.GameObjects.Rectangle({x:100,y:200,color:FOX.Random.color(),layer:layer,debug:{hitbox:true}})
    window.player.addComponent({component: new FOX.Colliders.RectangleCollider({width:100,height:100,offset:{x:0,y:0},debug:{hitbox:true}})})
    window.player.addComponent({component: new Move("x")})
    scene.objectmanager.addObject({object:window.player})
}