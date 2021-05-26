<p align="center">
    <img src="https://joonlabs.com/fox/logo.png" alt="index.js logo" width="300" align="center" style="width: 300px; display: block; margin-left: auto; margin-right: auto;"/>
</p>

# fox.js

fox.js is a lightweight and easy-to-use game engine for the development of pixel-art games. It is implemented in
javascript and supports the Canvas2D-API and WebGL-API for rendering the game onto HTML5-canvases. You can either clone
the whole repository and include fox.js with

````javascript
import fox from 'fox/src/index.js'
````

or you can use the packed and minified version of fox.js found in the `dist/` folder or using jsdelivr.

````html
<!-- fox.js by local resource -->
<script src="fox/dist/fox-v1.js"></script>

<!-- fox.js by jsdelivr -->
<script src="https://cdn.jsdelivr.net/gh/joonlabs/fox.js@1.1/dist/fox-v1.js"></script>
````

## packages

fox.js is structured in different packages. Each package usually represents one or more classes, which take different
roles in the implementation of a game.

Available packages are:

- fox.Animation
- fox.Animator
- fox.Application
- fox.Assets.Audio
- fox.Assets.Texture
- fox.Assets.TextureAtlas
- fox.AssetManager
- fox.AudioController
- fox.Camera
- fox.Colliders.Collider
- fox.Colliders.CircleCollider
- fox.Colliders.RectangleCollider
- fox.CollisionManager
- fox.Color
- fox.Component
- fox.GameObjects.Circle
- fox.GameObjects.Rectangle
- fox.GameObjects.Sprite
- fox.GameObjects.Lights.PointLight
- fox.Input
- fox.Layers.Canvas
- fox.Layers.Lighting
- fox.ObjectManager
- fox.ParticleSystem
- fox.Random
- fox.Renderers.Canvas2D
- fox.Renderers.WebGL
- fox.Scene
- fox.Scene
- fox.Utils
- fox.Vectors.Vec2D

# basics

This section will help you get familiar with the basics of fox.js

### loading assets

fox.js makes it incredibly easy to get started with game development. First, you tell fox.js what resources you want to
use. To start, you let the engine load your audio and image files. The fox.AssetManager helps you with this:

````javascript
// single images
fox.AssetManager.addTexture({
    name: "background",
    asset: new fox.Assets.Texture({
        src: "assets/background.png"
    })
})

// texture atlas
fox.AssetManager.addTextureAtlas({
    atlas: new fox.Assets.TextureAtlas({
        src: "assets/player.png",
        mappings: [
            {
                name: "idle_0",
                x: 0, y: 0,
                width: 15,
                height: 16
            },
            {
                name: "idle_1",
                x: 19,
                y: 1,
                width: 15,
                height: 15,
                offset: new fox.Vectors.Vec2D({y: 1})
            },
            ...
    })
})

// audio
fox.AssetManager.addAudio({
    name: "main-theme",
    asset: new fox.Assets.Audio({
        src: "assets/main-theme.mp3"
    })
})
````

### creating an application

After all the resources are loaded, you can now create the heart of your game - the application. An application is the
holder for the complete gameplay. It takes care of screen updates and many other events.

````javascript
// create a new application
let app = new fox.Application({
    width: 360,
    height: 260,
})
// add the game's view to the DOM
document.body.appendChild(app.view)
````

From the application you can also load your different scenes.

````javascript
// add a scene to the app
app.addScene({name: "myFirstLevel", scene: level01})
// load the scene to display it
app.loadScene({name: "myFirstLevel"})
````

You can find out more about scenes and how to use them in the following section.

### creating a scene

Since you probably have different views, such as a menu, the actual game, a store, etc., that you want to display,
fox.js provides a way to logically separate them from each other. One such unit is a scene. Scenes can be held and
managed by your application.

````javascript
let scene = new fox.Scene()

scene.onInit({
    callback: function () {
        // logic when scene gets loaded comes here (see below)
    }
})

scene.onDestroy({
    callback: function () {
        // logic when scene gets unloaded comes here
    }
})

````

Within a scene you can divide the game action into different layers. Usually a canvas layer is enough to draw game
characters, backgrounds, particles, etc. and a lighting layer to add lights to the scene.

````javascript
scene.onInit({
    callback: function () {
        // creates a new camera
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

        // creates a lighting layer for the lights
        let lighting = new fox.Layers.Lighting({
            width: 360,
            height: 360,
            globalLight: 0.5
        })

        // add elements to the scene
        scene.addLayer({layer: layer})
        scene.addLayer({layer: lighting})
        scene.addCamera({camera: camera})
    }
})
````

### create game objects

You can now add gameobjects to a canvas layer like this...

````javascript
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
````

... and lights to the lighting layer like this

````javascript
// create the new light source
let light = new fox.GameObjects.Lights.PointLight({
    radius: 50,
    intensity: 1
})
// make the light follow the player
light.addComponent({
    name: "FollowPlayer",
    component: new fox.Components.Basic.FollowGameObject({gameObject: player})
})

// add the light to the lighting layer
lighting.addObject({name: "light", object: light})
````

### create components
So far, not so much is happening in the game. Everything is still standing still and nothing is moving. This circumstance can be counteracted with components.

Components are attached to a GameObject like a sprite or a light. These have among other things their own `onCalc` method, in which you can then influence the behavior of the gameobjects.

````javascript
// create a new component
class PlayerMovement extends fox.Component {
    onCalc({timestep, object} = {}) {
        // move player according to arrow keys
        if (fox.Input.isKeyDown({key: "ArrowLeft"})) object.position.x -= 5 * timestep
        if (fox.Input.isKeyDown({key: "ArrowRight"})) object.position.x += 5 * timestep
        if (fox.Input.isKeyDown({key: "ArrowUp"})) object.position.y -= 5 * timestep
        if (fox.Input.isKeyDown({key: "ArrowDown"})) object.position.y += 5 * timestep
    }
}

// add the component to the player
player.addComponent({
    name: "movement",
    component: new PlayerMovement()
})
````

### result
The result (without the lights) should look like this. The source code of the example (without the lights) can be found in the `examples/` directory.

https://user-images.githubusercontent.com/52662462/116005901-51124380-a609-11eb-9fbe-f6bce21d6253.mov

Now try it yourself!
