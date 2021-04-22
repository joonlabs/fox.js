import {WebGL} from "../../renderers/renderers/webgl.js";
import {ObjectManager} from '../../objectmanager/index.js'

/**
 * The Layer represents the canvas that is added to the document's dom 
 *
 * @class Layer
 */
export class Layer{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} width Width of the canvas, if not specified the project's width is taken automatically
     * @param {number} height Width of the canvas, if not specified the project's height is taken automatically
     * @param {Renderer} renderer Renderer to use when rendering this layer (either new WebGL() or new Canvas2D())
     * @returns Layer
     */
    constructor({width, height, renderer}={}){
        //dimensions
        this.dimensions = {
            "width" : width,
            "height" : height,
        }

        // set the renderer and initiate
        this.renderer = renderer || new WebGL()
        this.renderer.init({
            width : width,
            height : height
        })

        //game stuff
        this.objectmanager = new ObjectManager()
    }

    getCanvas(){
        return this.renderer.getCanvas()
    }

    /**
     * Is called in every loop, up to 60 times a second
     */
    calc({timestep}){
        this.objectmanager.calc({timestep: timestep})
    }

    /**
     * Is called in every loop after the calc method
     */
    render({offset, zoom, camera}){
        for(let obj of this.objectmanager.objects){
            obj.render({
                x: parseInt((offset.x + obj.position.x)*zoom),
                y: parseInt((offset.y + obj.position.y)*zoom),
                width: parseInt(obj.dimensions.width * zoom),
                height: parseInt(obj.dimensions.height * zoom),
                zoom: zoom,
                camera: camera,
                renderer: this.renderer
            })
        }
    }
    
    /**
     * Is called in every loop after the render method
     * @method postprocess
     * @return {void}
     */
    postProcess(_this=this){
        
    }
    
    /**
     * Is called every time before the render method is called and clears the whole canvas 
     * @method clear
     * @return {void}
     */
    clear(){
        // to be implemented by child
    }

    addObject({object}){
        this.objectmanager.addObject({object:object})
    }
}