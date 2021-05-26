import {Component} from "../../component/component.js";
import {Vec2D} from "../../vectors/vectors/index.js";

export class FollowGameObject extends Component{
    /**
     * Creates a component that updates the holder object's position to the passed GameObject's position
     *
     * @param {GameObject} gameObject GameObject that should be followed
     * @param {Vec2D} offset Offset that is added to the followed GameObject's position
     */
    constructor({gameObject, offset}) {
        super();
        this.gameObject = gameObject
        this.offset = offset || new Vec2D()
    }

    /**
     * Is called every time when the game object is calculated
     * @param {number} timestep
     * @param {GameObject} object
     */
    onCalc({timestep, object} = {}) {
        super.onCalc({timestep, object});

        object.position = this.gameObject.position.add({vector: this.offset})
    }
}