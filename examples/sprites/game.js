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
        width: 360,
        height: 260,
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
    let camera = new fox.Camera({
        viewport: {
            width: 360,
            height: 260
        },
    })

    // creates a canvas layer for rendering the objects
    let layer = new fox.Layers.Canvas({
        width: 360,
        height: 260,
    })

    // add elements to the scene
    scene.addLayer({layer: layer})
    scene.addCamera({camera: camera})


    /*
    --------------- GameObjects ---------------
     */
    // create a new sprite
    let player = new fox.GameObjects.Sprite({
        x: 100,
        y: 100,
        width: 16,
        height: 16,
        texture: fox.AssetManager.getTexture({name: "idle_0"})
    })
    // add the sprite to the canvas layer
    layer.addObject({name: "player", object: player})

    /*
    --------------- Components ---------------
     */
    // create a new component
    class PlayerMovement extends fox.Component {
        onCalc({timestep, object} = {}) {
            // move player according to arrow keys
            if (fox.Input.isKeyDown({key: "ArrowLeft"})) object.position.x -= 5
            if (fox.Input.isKeyDown({key: "ArrowRight"})) object.position.x += 5
            if (fox.Input.isKeyDown({key: "ArrowUp"})) object.position.y -= 5
            if (fox.Input.isKeyDown({key: "ArrowDown"})) object.position.y += 5
        }
    }

    // add the component to the player
    player.addComponent({
        name: "movement",
        component: new PlayerMovement()
    })


    // add a scene to the app
    app.addScene({name: "myFirstLevel", scene: scene})
    // load the scene to display it
    app.loadScene({name: "myFirstLevel"})
}