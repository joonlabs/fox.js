import fox from "../../../../src/index.js";
import {Player} from "../objects/player.js";
import {Platform} from "../objects/platform.js";

let scene = new fox.Scene()

scene.onInit({
    callback: function(){
        let camera = new fox.Camera({
            viewport: {
                width: (360/2) * 3,
                height: (260/2) * 3
            },
        })
        let camera2 = new fox.Camera({
            x: (360/2) * 3,
            y: 0,
            viewport: {
                x: -(360/4),
                y: -(260/4),
                width: (360/2) * 3,
                height: (260/2) * 3
            },
            zoom: 1/3
        })
        let camera3 = new fox.Camera({
            x: 0,
            y: (260/2)  * 3,
            viewport: {
                y: (260/2) * 3,
                width: (360/2) * 3,
                height: (260/2) * 3
            },
        })
        let camera4 = new fox.Camera({
            x: (360/2) * 3,
            y: (260/2) * 3,
            viewport: {
                width: 360/2 * 3,
                height: 260/2 * 3
            },
        })

        let layer = new fox.Layers.Canvas({
            width: 360 * 3,
            height: 260 * 3,
        })
        let lighting = new fox.Layers.Lighting({
            width: 360 * 3,
            height: 360 * 3,
            globalLight: 0.5
        })

        scene.addLayer({layer: layer})
        scene.addLayer({layer: lighting})
        scene.addCamera({camera: camera})
        scene.addCamera({camera: camera2})
        scene.addCamera({camera: camera3})
        scene.addCamera({camera: camera4})

        // create background
        let background = new fox.GameObjects.Sprite({
            x: 0,
            y: 0,
            width: 360 * 3,
            height: 260 * 3,
            layer: layer,
            texture: fox.AssetManager.getTexture({name: "background"})
        })
        layer.addObject({object: background})

        // create players
        let playerOne = new Player({
            x: 25 * 3,
            y: (170-16) * 3,
            texture: "Blue",
            layer: layer,
            lightingLayer: lighting,
            scene: scene,
            movement: {
                keyLeft: "ArrowLeft",
                keyRight: "ArrowRight",
                keyUp: "ArrowUp"
            }
        })

        let playerTwo = new Player({
            x: 55 * 3,
            y: (170-16) * 3,
            texture: "Pink",
            layer: layer,
            lightingLayer: lighting,
            scene: scene,
            movement: {
                keyLeft: "a",
                keyRight: "d",
                keyUp: "w"
            }
        })

        camera.addComponent({
            component: new fox.Components.Basic.FollowGameObject({gameObject: playerOne.player, offset: new fox.Vectors.Vec2D({x: -270, y: -200})})
        })
        camera4.addComponent({
            component: new fox.Components.Basic.FollowGameObject({gameObject: playerTwo.player, offset: new fox.Vectors.Vec2D({x: -270, y: -200})})
        })

        // create platforms
        let platforms = [
            {type: Platform.types.WOODEN_BIG, coordinates: [0 * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [80 * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [160 * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [240 * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [320 * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [(400+0) * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [(400+80) * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [(400+160) * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [(400+240) * 3, 220 * 3]},
            {type: Platform.types.WOODEN_BIG, coordinates: [(400+320) * 3, 220 * 3]},
        ]
        let counter = 0
        for (let platform of platforms) {
            let createdPlatform = new Platform({
                x: platform.coordinates[0],
                y: platform.coordinates[1],
                type: platform.type,
                layer: layer,
                lightingLayer: lighting,
            })
            scene.storeItem({
                name: "platform" + counter.toString(),
                item: createdPlatform
            })
            counter++
        }
    }
})

export {scene as playground}