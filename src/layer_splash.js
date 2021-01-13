class Layer_splash {
    constructor() {
        this.m_timer = 0.0;
        this.m_dt = 0.0;

        this.quad = new Quad();
        this.shader = new Shader(s_basic_vertex, s_basic_fragment);
        this.texture = new Texture("res/tex/splash_title.png", 192, 112, 3, 0);
        this.camera = new Camera(MathUtil.orthoMat(0.0, 16.0, 0.0, 12.0, 0.1, 100.0), [7.7, 6.0, -10.0]);
        this.animation = new Animation(0.2, [0, 1, 2]);

        this.shader.u_projView = gl.getUniformLocation(this.shader.id, "u_projView");
        this.shader.u_model = gl.getUniformLocation(this.shader.id, "u_model");
        this.shader.u_texId = gl.getUniformLocation(this.shader.id, "u_texId");

        this.messageStart = MathUtil.scaleMat([7.8, 5.0, 1.0]);

        this.filter = new ScreenFilter();
    }

    update(a_delta) {
        this.m_timer += a_delta;
        this.m_dt = a_delta;

        let message = this.messageStart;

        if (this.m_timer < 1.0) {
            message = MathUtil.multiplyMatrices([MathUtil.yRotationMat(-3.14 / 2 + (this.m_timer) * 3.14 / 2), this.messageStart]);
        }

        if (this.m_timer > 3.0 && this.m_timer < 4.0) {
            message = MathUtil.multiplyMatrices([MathUtil.yRotationMat((this.m_timer - 3) * 3.14 / 2), this.messageStart]);
        }

        if (this.m_timer >= 4.0) {
            message = MathUtil.transMat([20, 20, 0]);
        }

        if (this.m_timer >= 4.0) {
            return new Layer_menu;
        }

        this.animation.update(a_delta);

        this.shader.enable();
        gl.uniformMatrix4fv(this.shader.u_projView, false, this.camera.getPV);
        gl.uniformMatrix4fv(this.shader.u_model, false, message);
        gl.uniform1i(this.shader.u_texId, this.animation.getFrame);
        this.shader.disable();

        return this;
    }

    draw() {
        this.filter.enableTarget();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.shader.enable();
        this.quad.enable();
        this.texture.enable(0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        this.texture.disable(0);

        this.filter.disableTarget();

        this.filter.draw();

        this.quad.disable();
    }
}

class ScreenFilter {
    constructor() {
        this.charset = new Texture("res/tex/chars.png", 7, 7, 7, 0);
        this.screenShader = new Shader(s_screen_vertex, s_screen_fragment);
        this.target = new RenderTarget(100, 75, 1);

        this.screenShader.u_projView = gl.getUniformLocation(this.screenShader.id, "u_projView");
        this.screenShader.u_width = gl.getUniformLocation(this.screenShader.id, "u_width");
        this.screenShader.u_height = gl.getUniformLocation(this.screenShader.id, "u_height");
        this.screenShader.u_tex = gl.getUniformLocation(this.screenShader.id, "u_tex");
        this.screenShader.u_atex = gl.getUniformLocation(this.screenShader.id, "u_atex");

        this.screenShader.enable();

        gl.uniform1i(this.screenShader.u_tex, 0);
        gl.uniform1i(this.screenShader.u_atex, 1);
        gl.uniform1f(this.screenShader.u_width, 100);
        gl.uniform1f(this.screenShader.u_height, 75);
        let screenView = new Camera(MathUtil.orthoMat(0, 200, 0, 150, 0.1, 100), [1, 1, -10]);
        gl.uniformMatrix4fv(this.screenShader.u_projView, false, screenView.getPV);

        this.screenShader.disable();
    }

    enableTarget() {
        this.target.enable();
    }

    disableTarget() {
        this.target.disable();
    }

    draw() {
        gl.viewport(0, 0, 800, 600);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.target.enableTex(0);
        this.charset.enable(1);
        this.screenShader.enable();

        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 100 * 75);

        this.target.disableTex(0);
        this.charset.disable(1);
        this.screenShader.disable();
    }
}