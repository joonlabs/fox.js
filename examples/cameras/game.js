window.addEventListener("load", init)

function init(){
    /*
    --------------- Textures ---------------
     */
    // load player texture
    fox.AssetManager.addTexture({
        name: "idle_0",
        asset: new fox.Assets.Texture({
            src: "assets/player.png"
        })
    })


    /*
    --------------- Application ---------------
     */
    // create a new application
    let app = new fox.Application({
        width: 1280,
        height: 720,
    })
    // add the game's view to the DOM
    document.body.appendChild(app.view)


    /*
    --------------- Scene ---------------
     */
    let scene = new fox.Scene()

    scene.onInit({
        callback: function () {
            // logic when scene gets loaded comes here (see below)
        }
    })


    /*
    --------------- Camera + Layers ---------------
     */

    let camera1 = new fox.Camera({
        viewport: {
            width: (1280/2),
            height: (720/2)
        },
    })
    let camera2 = new fox.Camera({
        x: (1280/2),
        y: 0,
        viewport: {
            x: (1280/2),
            width: (1280/2),
            height: (720/2)
        },
    })
    let camera3 = new fox.Camera({
        x: 0,
        y: (720/2),
        viewport: {
            y: (720/2),
            width: (1280/2),
            height: (720/2)
        },
    })
    let camera4 = new fox.Camera({
        x: (1280/2),
        y: (720/2),
        viewport: {
            x: 0,
            y: 0,
            width: 1280,
            height: 720
        },
        zoom: 0.5,
    })

    // creates a canvas layer for rendering the objects
    let layer = new fox.Layers.Canvas({
        width: 1280,
        height: 720,
    })

    // add elements to the scene
    scene.addLayer({layer: layer})
    scene.addCamera({camera: camera1})
    scene.addCamera({camera: camera2})
    scene.addCamera({camera: camera3})
    scene.addCamera({camera: camera4})


    /*
    --------------- GameObjects ---------------
     */
    // create a new sprite
    let player = new fox.GameObjects.Sprite({
        x: 100,
        y: 100,
        width: 64,
        height: 64,
        texture: fox.AssetManager.getTexture({name: "idle_0"})
    })
    // add the sprite to the canvas layer
    layer.addObject({name: "player", object: player})

    let boundingBox = new fox.GameObjects.Rectangle({
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        color: new fox.Color({r: 255}),
        borderWidth: 10
    })
    layer.addObject({object: boundingBox})

    /*
    --------------- Components ---------------
     */
    // create a new component
    class CameraMovement extends fox.Component {
        onCalc({timestep, object} = {}) {
            if (fox.Input.isKeyDown({key: "ArrowLeft"})) object.viewportPosition.x -= timestep * 5
            if (fox.Input.isKeyDown({key: "ArrowRight"})) object.viewportPosition.x += timestep * 5
            if (fox.Input.isKeyDown({key: "ArrowUp"})) object.viewportPosition.y -= timestep * 5
            if (fox.Input.isKeyDown({key: "ArrowDown"})) object.viewportPosition.y += timestep * 5
        }
    }

    class CameraZoom extends fox.Component {

        constructor() {
            super()
            this.zoomFactor = 0
        }

        onCalc({timestep, object} = {}) {

            if (fox.Input.isKeyDown({key: "PageUp"})) this.zoomFactor -= 0.01 * timestep
            if (fox.Input.isKeyDown({key: "PageDown"})) this.zoomFactor += 0.01 * timestep

            object.settings.zoom = Math.exp(this.zoomFactor)
        }
    }

    // add the component to the player
    camera1.addComponent({
        name: "movement",
        component: new CameraMovement()
    })

    camera4.addComponent({
        name: "zoom",
        component: new CameraZoom()
    })

    // add a scene to the app
    app.addScene({name: "myFirstLevel", scene: scene})
    // load the scene to display it
    app.loadScene({name: "myFirstLevel"})
}