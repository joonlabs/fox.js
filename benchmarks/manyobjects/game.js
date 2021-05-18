import fox from "../../src/index.js"
import {RandomObject} from "./js/randomObject.js"

window.addEventListener("load", init)

function init(){

    const canvasWidth = 1280
    const canvasHeight = 720

    let app = new fox.Application({
        width: canvasWidth,
        height: canvasHeight,
        logFPS: true,
    })
    document.body.appendChild(app.view)


    let scene = new fox.Scene()
    let camera = new fox.Camera({
        viewport: {
            width: canvasWidth,
            height: canvasHeight,
        },
    })

    let layer = new fox.Layers.Canvas({
        width: canvasWidth,
        height: canvasHeight,
    })

    scene.addLayer({layer: layer})
    scene.addCamera({camera: camera})

    for (let i = 0; i < 1000; i++) {
        const objWidth  = fox.Random.range({min: 10, max: 200})
        const objHeight = fox.Random.range({min: 10, max: 200})
        const objX      = fox.Random.range({min: 0, max: canvasWidth - objWidth})
        const objY      = fox.Random.range({min: 0, max: canvasHeight - objHeight})
        const objRot    = fox.Random.range({min: 0.001, max: 0.03})

        new RandomObject({
            x: objX,
            y: objY,
            width: objWidth,
            height: objHeight,
            rotationSpeed: objRot,
            layer
        })
    }




    app.addScene({name: "manyObjects", scene: scene})
    app.loadScene({name: "manyObjects"})
}