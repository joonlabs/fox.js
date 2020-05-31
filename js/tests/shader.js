import * as FOX from '../../fox/fox.js'
window.FOX = FOX //make FOX avaiable in console

let app = new FOX.Application({width: 320*3, height: 180*3})
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
            width: 320*3,
            height: 180*3
        }
    })
    let layer = new FOX.Layers.Canvas({
        width: 320*3, 
        height: 180*3
    })

    scene.addLayer({layer: layer})
    app.addCamera({camera: camera})
    app.addScene({scene: scene})
    
    /*
    * TESTING
    */
    let val = 2
    class Tinting extends FOX.Shaders.CPU{
        onInit({data}={}){
            this.repaint = true
        }
        
        shouldRepaint(){
            return this.repaint    
        }
        
        onCalc({data, width, height}={}){
            let rand = FOX.Random.rangeInt({min: 0, max: 255})
            for(let i=0; i<data.length; i+=4){
                data[i] *= val;
                data[i+1] *= val;
                data[i+2] *= val;
            }
            this.repaint = false
        }
    }  
    
    class Moving extends FOX.Component{
        onInit({object}={}){
            this.dir = 1    
        }
        
        onCalc({timestep, object}={}){
            if(object.position.x>500) this.dir = -1
            if(object.position.x<=0) this.dir = 1
            object.position.x += 5 * this.dir * timestep
            object.position.y += 5 * this.dir * timestep
            object.rotation += FOX.Random.range({min:0.1, max:0.2})*this.dir
        }
    }
    
    //layer.addShader({shader: new Tinting})
                     
    let sprite = new FOX.GameObjects.Sprite({x:0,y:0,width:200,height:200,texture:FOX.AssetManager.getTexture({name:"test"}),layer:layer, z:400})
    sprite.addComponent({component: new Moving})
    sprite.addShader({shader: new Tinting})
    
    scene.objectmanager.addObject({object:sprite})
    
    let sprite2 = new FOX.GameObjects.Sprite({x:300,y:300,width:200,height:200,texture:FOX.AssetManager.getTexture({name:"test"}),layer:layer, z:401})
    sprite2.addComponent({component: new Moving})
    sprite2.addShader({shader: new Tinting})
    
    scene.objectmanager.addObject({object:sprite2})
    
    for(var i=0; i<50; i++){
        var c = FOX.Random.rangeInt({min: 0, max:500})
        var sp = new FOX.GameObjects.Sprite({x:40*i,y:40*i,width:200,height:200,texture:FOX.AssetManager.getTexture({name:"test"}),layer:layer})
        sp.addComponent({component: new Moving})
        sp.addShader({shader: new Tinting})
        scene.objectmanager.addObject({object:sp})
    }
}