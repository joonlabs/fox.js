import * as fox from "../../../../fox/fox.js";
import {TimingPlatform} from "../components/timingPlatform.js";

export class Platform {
    constructor({x, y, layer, lightningLayer, type}) {
        this.x = x
        this.y = y

        this.type = type || Platform.types.DEFAULT

        this.ownedByPlayerType = undefined

        let width, height, texture

        // size
        if (type === Platform.types.DEFAULT
            || type === Platform.types.WOODEN
            || type === Platform.types.TIMING) {
            width = 28 * 2
            height = 10 * 2
        } else if (type === Platform.types.DEFAULT_BIG
            || type === Platform.types.WOODEN_BIG
            || type === Platform.types.GOAL) {
            width = 44 * 2
            height = 10 * 2
        } else if (type === Platform.types.VERTICAL){
            height = 42 * 2
            width = 12 * 2
        }else{
            console.error("Unsupported platform type: ", type)
        }

        // texture
        if (type === Platform.types.DEFAULT) texture = fox.AssetManager.getTexture({name: "Platform_Uncolored"})
        if (type === Platform.types.DEFAULT_BIG) texture = fox.AssetManager.getTexture({name: "Platform_Uncolored_Wide"})
        if (type === Platform.types.VERTICAL) texture = fox.AssetManager.getTexture({name: "Platform_Vertical_Uncolored"})
        if (type === Platform.types.WOODEN) texture = fox.AssetManager.getTexture({name: "Platform_Wood"})
        if (type === Platform.types.WOODEN_BIG) texture = fox.AssetManager.getTexture({name: "Platform_Wood_Wide"})
        if (type === Platform.types.TIMING) texture = fox.AssetManager.getTexture({name: "Platform_Pink"})
        if (type === Platform.types.GOAL) texture = fox.AssetManager.getTexture({name: "Platform_Wood_Wide"})

        this.platform = new fox.GameObjects.Sprite({
            x: x,
            y: y,
            width: width,
            height: height,
            layer: layer,
            texture: texture,
        })

        this.platform.addComponent({
            name : "collider",
            component: new fox.Colliders.RectangleCollider({
                width: width - (type===Platform.types.VERTICAL ? 18 : 10),
                height: height,
                offset: {
                    x: (type===Platform.types.VERTICAL ? 9 : 5),
                    y: (type===Platform.types.VERTICAL ? 3 : 0)
                },
                debug: {hitbox: false}
            })
        })

        if(type === Platform.types.TIMING){
            this.platform.addComponent({
                component: new TimingPlatform({platform: this})
            })
        }

        layer.addObject({object: this.platform})

        if(type === Platform.types.GOAL){
            this.reachedGoal = {
                Blue : false,
                Pink : false,
            }
            this.table = new fox.GameObjects.Sprite({
                x: x-5,
                y: y-42,
                width: 48*2,
                height: 38*2,
                layer: layer,
                texture: fox.AssetManager.getTexture({name: "DinnerTable"}),
            })
            layer.addObject({object: this.table})

            this.light = new fox.GameObjects.Lights.PointLight({
                x: x+35,
                y: y-15,
                radius: 120,
                intensity: 1,
                layer: lightningLayer
            })
            lightningLayer.addObject({object: this.light})
        }
    }

    getCollider() {
        return this.platform.getComponent({name: "collider"})
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }
}

Platform.types = {
    DEFAULT: 0,
    DEFAULT_BIG: 1,
    WOODEN: 2,
    WOODEN_BIG: 3,
    VERTICAL: 4,
    TIMING: 5,
    GOAL: 6,
}