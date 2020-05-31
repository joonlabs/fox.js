/**
* The Touch represents a touch input caused by a touchscreen (gesture)
*
* @class Touch
*/
export class Touch{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the collider
     * @param {number} y Y-position of the collider
     * @param {string} identifier Identifier of the touch
     * @returns Touch
     */
    constructor({identifier, x, y}){
        this.identifier = identifier
        this.position = {
            "x" : x,
            "y" : y,
        }
    }
}