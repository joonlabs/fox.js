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

    scene.addLayer({layer: layer})
    app.addCamera({camera: camera})
    app.addScene({scene: scene})

    let sprite = new FOX.GameObjects.Sprite({x: 50, y:50, layer:layer, debug: {hitbox: true}, texture: FOX.AssetManager.getTexture({name: "test"})})
    scene.objectmanager.addObject({object: sprite})

    window.app = app
}