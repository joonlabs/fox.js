
export class RandomObject {
    constructor({x, y, width, height, layer, rotationSpeed}) {

        this.sprite = new fox.GameObjects.Sprite({
            x, y,
            width, height,
            texture: new fox.Assets.Texture({
                src: "assets/player.png",
                width, height
            })
        })

        this.sprite.addComponent({
            component: new ConstantRotation({rotationSpeed})
        })

        layer.addObject({
            object: this.sprite
        })

    }
}

class ConstantRotation extends fox.Component {
    constructor({rotationSpeed}) {
        super();
        this.rotationSpeed = rotationSpeed
    }

    onCalc({object, timestep} = {}) {
        object.rotation += this.rotationSpeed * timestep
    }
}