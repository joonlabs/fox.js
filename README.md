<img src="https://joonlabs.com/fox/logo.png" alt="index.js logo" width="300" align="center" style="width: 300px; display: block; margin-left: auto; margin-right: auto;"/>

# fox.js
fox.js is a lightweight and easy-to-use game engine for the development of pixel-art games. It is implemented in javascript and supports the Canvas2D-API and WebGL-API for rendering the game onto HTML5-canvases. 
You can either clone the whole repository and include fox.js with 
````javascript
import fox from 'fox/src/index.js'
````
or you can use the packed and minified version of fox.js found in the `dist/` folder or using jsdelivr.
````html
<!-- fox.js by local resource -->
<srcipt src="fox/dist/fox-v1.js"></srcipt>

<!-- fox.js by jsdelivr -->
<srcipt src="https://cdn.jsdelivr.net/gh/joonlabs/fox.js/dist/fox-v1.js"></srcipt>
````
## packages
fox.js is structured in different packages. Each package usually represents one or more classes, which take different roles in the implementation of a game.

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


