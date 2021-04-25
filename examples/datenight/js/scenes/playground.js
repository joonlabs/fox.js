import fox from "../../../../src/index.js";
import {Player} from "../objects/player.js";
import {Platform} from "../objects/platform.js";

let scene = new fox.Scene()

scene.onInit({
    callback: function(){
        let camera = new fox.Camera({
            viewport: {
                width: 360/2,
                height: 260/2
            },
        })
        let camera2 = new fox.Camera({
            x: 360/2,
            y: 0,
            viewport: {
                width: 360/2,
                height: 260/2
            },
        })
        let camera3 = new fox.Camera({
            x: 0,
            y: 260/2,
            viewport: {
                width: 360/2,
                height: 260/2
            },
        })
        let camera4 = new fox.Camera({
            x: 360/2,
            y: 260/2,
            viewport: {
                width: 360/2,
                height: 260/2
            },
        })

        let layer = new fox.Layers.Canvas({
            width: 360,
            height: 260,
            renderer: new fox.Renderers.WebGL(),
        })
        let lightning = new fox.Layers.Lightning({
            width: 360,
            height: 360,
            globalLight: 0.5
        })

        scene.addLayer({layer: layer})
        scene.addLayer({layer: lightning})
        scene.addCamera({camera: camera})
        scene.addCamera({camera: camera2})
        scene.addCamera({camera: camera3})
        scene.addCamera({camera: camera4})

        // create background
        let background = new fox.GameObjects.Sprite({
            x: 0,
            y: 0,
            width: 360,
            height: 260,
            layer: layer,
            texture: fox.AssetManager.getTexture({name: "background"})
        })
        layer.addObject({object: background})

        // create players
        let playerOne = new Player({
            x: 25,
            y: 170-16,
            texture: "Blue",
            layer: layer,
            lightningLayer: lightning,
            scene: scene,
            movement: {
                keyLeft: "ArrowLeft",
                keyRight: "ArrowRight",
                keyUp: "ArrowUp"
            }
        })

        let playerTwo = new Player({
            x: 55,
            y: 170-16,
            texture: "Pink",
            layer: layer,
            lightningLayer: lightning,
            scene: scene,
            movement: {
                keyLeft: "a",
                keyRight: "d",
                keyUp: "w"
            }
        })

        camera.followObject({object: playerOne.player})
        camera4.followObject({object: playerOne.player})
        camera2.followObject({object: playerTwo.player})
        camera3.followObject({object: playerTwo.player})

        // create platforms
        let platforms = [
            {type: Platform.types.WOODEN_BIG, coordinates: [0, 220]},
            {type: Platform.types.WOODEN_BIG, coordinates: [80, 220]},
            {type: Platform.types.WOODEN_BIG, coordinates: [160, 220]},
            {type: Platform.types.WOODEN_BIG, coordinates: [240, 220]},
            {type: Platform.types.WOODEN_BIG, coordinates: [320, 220]},
        ]
        let counter = 0
        for (let platform of platforms) {
            let createdPlatform = new Platform({
                x: platform.coordinates[0],
                y: platform.coordinates[1],
                type: platform.type,
                layer: layer,
                lightningLayer: lightning,
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