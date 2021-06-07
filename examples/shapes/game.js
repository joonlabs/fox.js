import fox from '../../src/index.js'

// create the new application
let app = new fox.Application({
    width: 1080,
    height: 780,
    logFPS: true,
    renderer: new fox.Renderers.WebGL()
})
document.body.appendChild(app.view)

// after all resources loaded
fox.AssetManager.onResourcesLoaded({
    callback: function () {
        let playground = new fox.Scene()

        let camera = new fox.Camera({
            viewport: {
                width: 1080,
                height: 780
            },
        })

        let layer = new fox.Layers.Canvas({
            width: 1080,
            height: 780,
        })

        // add elements to the scene
        playground.addLayer({layer: layer})
        playground.addCamera({camera: camera})

        let rectangle = new fox.GameObjects.Rectangle({
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            color: new fox.Color({r: 255})
        })
        layer.addObject({object: rectangle})

        let strokeRectangle = new fox.GameObjects.Rectangle({
            x: 50,
            y: 200,
            width: 100,
            height: 100,
            color: new fox.Color({g: 255}),
            borderWidth: 10,
        })
        layer.addObject({object: strokeRectangle})

        let circle = new fox.GameObjects.Circle({
            x: 200,
            y: 50,
            diameter: 100,
            color: new fox.Color({b: 255})
        })
        layer.addObject({object: circle})

        let strokeCircle = new fox.GameObjects.Circle({
            x: 200,
            y: 200,
            diameter: 100,
            color: new fox.Color({r: 255, b: 255}),
            borderWidth: 10,
        })
        layer.addObject({object: strokeCircle})

        app.addScene({name: "playground", scene: playground})

        app.loadScene({name: "playground"})
        window.app = app
    }
})