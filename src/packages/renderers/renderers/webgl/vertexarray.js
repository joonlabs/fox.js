import {WebGLCache} from "../webgl.js"

export class VertexArray {

    /**
     *
     * @param renderer {WebGL}
     * @param setup {function}
     */
    constructor({renderer, setup}) {
        this.renderer = renderer
        this.vaoRef = null

        if (renderer.glVao !== null) {
            this.vaoRef = renderer.glVao.createVertexArrayOES()
            this.bind()
            setup()
            this.unbind()
        } else {
            this.setup = setup
        }
    }

    bind() {
        this.renderer.cache(WebGLCache.VAO).validate(this.vaoRef)
    }

    unbind() {
        this.renderer.cache(WebGLCache.VAO).validate(null)
    }

    destroy() {
        if (this.vaoRef !== null) {
            this.renderer.glVao.deleteVertexArrayOES(this.vaoRef)
        }
    }
}