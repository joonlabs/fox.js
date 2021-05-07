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
        if (this.vaoRef !== null) {
            this.renderer.glVao.bindVertexArrayOES(this.vaoRef)
        } else {
            this.setup()
        }
    }

    unbind() {
        if (this.vaoRef !== null) {
            this.renderer.glVao.bindVertexArrayOES(null)
        }
    }

    destroy() {
        if (this.vaoRef !== null) {
            this.renderer.glVao.deleteVertexArrayOES(this.vaoRef)
        }
    }
}