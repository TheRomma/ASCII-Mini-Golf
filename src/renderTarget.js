class RenderTarget {
    constructor(a_width, a_height, a_unit) {
        this.m_width = a_width;
        this.m_height = a_height;

        this.m_FBO = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_FBO);

        this.m_TCB = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, this.m_TCB);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, this.m_width, this.m_height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.m_TCB, 0);

        this.m_RBO = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.m_RBO);

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, this.m_width, this.m_height);

        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.m_RBO);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {
            
        }
        else {
            console.warn("Could not create framebuffer.");
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    enable() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_FBO);
        gl.viewport(0, 0, this.m_width, this.m_height);
    }

    disable() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    enableTex(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, this.m_TCB);
    }

    disableTex(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}