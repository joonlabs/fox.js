import {Component} from "../components/index.js";

export class Animator extends Component{
    /**
     *
     * @param {object} animations Animations mapped by name (e.g. [{"idleAnim":Animation}])
     * @param {string} active Name of the default active animation
     */
    constructor({animations, active}) {
        super();
        this.animations = animations

        this.activeAnimation = active || Object.keys(animations)[0]

        this.framecounter = 0
    }

    onCalc({object} = {}, _this = this) {
        _this.framecounter ++

        object.texture = _this.animations[_this.activeAnimation].getTexture({frame:_this.framecounter})
        object.applyTexture()
    }

    setActiveAnimation({name}, _this=this){
        if(_this.activeAnimation!==name){
            _this.activeAnimation = name
            _this.framecounter = 0
        }
    }
}