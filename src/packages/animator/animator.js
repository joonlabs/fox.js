import {Component} from "../components/index.js";

/**
 * An Animator is a GameObject-Component for Sprites that holds different animations and changes them accordingly.
 */
export class Animator extends Component {
    /**
     * Creates an Animator object.
     * @param {object} animations Animations mapped by name (e.g. [{"idleAnim":Animation}])
     * @param {string} activeAnimation Name of the default active animation
     */
    constructor({animations, activeAnimation}) {
        super();
        this.animations = animations

        this.activeAnimation = activeAnimation || Object.keys(animations)[0]

        this.framecounter = 0
    }

    /**
     * Called every frame, up to 60 times per second
     * @param {number} timestep
     * @param {object} object
     */
    onCalc({timestep, object} = {}) {
        this.framecounter += timestep

        object.texture = this.animations[this.activeAnimation].getTexture({frame: parseInt(this.framecounter)})
        object.applyTexture()
    }

    /**
     * Changes the active animation by the name provided in the animations parameter of the constructor.
     * @param {string} name Name of the animation
     */
    setActiveAnimation({name}) {
        if (this.activeAnimation !== name) {
            this.activeAnimation = name
            this.framecounter = 0
        }
    }
}