import * as FOX from '../../fox/fox.js'
window.FOX = FOX //make FOX avaiable in console

let app = new FOX.Application({width: 320*2, height: 180*2})
document.body.appendChild(app.view)

FOX.AssetManager.addTexture({name:"test", asset:new FOX.Assets.Texture({src: "/js/test/_resources/peach.png"})})
FOX.AssetManager.onResourcesLoaded({callback:init})

function init(){
    let scene = new FOX.Scene()
    let camera = new FOX.Camera({
        x:0,
        y:0,
        viewport: {
            x:0,
            y:0,
            width: 320*2,
            height: 180*2
        }
    })
    let layer = new FOX.Layers.Canvas({
        width: 320*3, 
        height: 180*3
    })
    let lightning = new FOX.Layers.Lightning({
        width: 320*3,
        height: 180*3
    })

    scene.addLayer({layer: layer})
    scene.addLayer({layer: lightning})
    app.addCamera({camera: camera})
    app.addScene({scene: scene})
    
    class Moving extends FOX.Component{
        onCalc({timestep, object}={}){
            let direction = new FOX.Vectors.Vec2D()
            let speed = 5
            if(FOX.Input.isKeyDown({key: FOX.Input.keys.Left})) direction.x = -1
            if(FOX.Input.isKeyDown({key: FOX.Input.keys.Right})) direction.x = 1
            if(FOX.Input.isKeyDown({key: FOX.Input.keys.Up})) direction.y = -1
            if(FOX.Input.isKeyDown({key: FOX.Input.keys.Down})) direction.y = 1
            object.position = object.position.add({vector: direction.multS({scalar: speed})})
        }
    }

    let sprite = new FOX.GameObjects.Sprite({x: 50, y:50, width: 100, height: 100, layer:layer, texture: FOX.AssetManager.getTexture({name: "test"})})
    sprite.addComponent({component: new Moving})
    scene.objectmanager.addObject({object: sprite})
    
    let light = new FOX.GameObjects.Lights.PointLight({radius: 200, fallout: 0, layer: lightning})
    light.followObject({object: sprite})
    scene.objectmanager.addObject({object: light})
    
    let light2 = new FOX.GameObjects.Lights.GlobalLight({layer:lightning, intensity: .5})
    scene.objectmanager.addObject({object: light2})

    window.app = app
}