class Layer {
    constructor() {
        this.m_timer = 0.0;
        this.m_dt = 0.0;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.m_shader = new Shader(Util.fileToString("res/shd/test.vs"), Util.fileToString("res/shd/test.fs"));
        this.screen = new Shader(Util.fileToString("res/shd/screen.vs"), Util.fileToString("res/shd/screen.fs"));
        this.m_quad = new Quad;
        this.m_texture = new Texture("res/tex/ball.png", 64, 64, 1, 0);

        this.m_shader.u_texId = gl.getUniformLocation(this.m_shader.id, "u_texId");
        this.m_shader.u_proj = gl.getUniformLocation(this.m_shader.id, "u_proj");
        this.m_shader.u_view = gl.getUniformLocation(this.m_shader.id, "u_view");
        this.m_shader.u_model = gl.getUniformLocation(this.m_shader.id, "u_model");

        this.proj = MathUtil.orthoMat(0.0, 32.0, 0.0, 24.0, 0.1, 100.0);
        this.view = MathUtil.transMat(1.0, 1.0, -10.0);

        this.x = 0;
        this.y = 0;

        this.m_target = new RenderTarget(200, 150, 0);

        this.otex = new Texture("res/tex/chars.png", 7, 7, 7, 1);

        this.screen.enable();
        this.screen.u_projView = gl.getUniformLocation(this.screen.id, "u_projView");
        gl.uniformMatrix4fv(this.screen.u_projView, false, MathUtil.multiplyMatrices([MathUtil.orthoMat(0.0, 200.0, 0.0, 150.0, 0.1, 100.0), MathUtil.transMat(1.0, 1.0, -10.0)]));

        gl.uniform1i(gl.getUniformLocation(this.screen.id, "u_tex"), 0);
        gl.uniform1i(gl.getUniformLocation(this.screen.id, "u_atex"), 1);

        this.screen.disable();
    }

    update(a_delta) {
        this.m_timer += a_delta;
        this.m_dt = a_delta;

        //let model = MathUtil.zRotationMat(2 * (3.14 / 45.0) * Math.sin(this.m_timer));
        let model = MathUtil.idMat();
        if (input.KeyW) { this.y -= 7 * this.m_dt; }
        if (input.KeyS) { this.y += 7 * this.m_dt; }
        if (input.KeyA) { this.x -= 7 * this.m_dt; }
        if (input.KeyD) { this.x += 7 * this.m_dt; }
        let trans = MathUtil.transMat(this.x, this.y, 0.0);
        let scale = MathUtil.scaleMat(1.0, 1.0, 1.0);

        let result = MathUtil.multiplyMatrices([trans, model, scale]);

        let final = MathUtil.multiplyMatrices([this.proj, this.view, result]);

        this.m_shader.enable();
        gl.uniform1i(this.m_shader.u_texId, 0);
        gl.uniformMatrix4fv(this.m_shader.u_proj, false, this.proj);
        gl.uniformMatrix4fv(this.m_shader.u_view, false, this.view);
        gl.uniformMatrix4fv(this.m_shader.u_model, false, result);

        return this;
    }

    draw() {
        //gl.enable(gl.DEPTH_TEST);
        this.m_target.enable();

        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        this.m_shader.enable();
        this.m_quad.enable();
        this.m_texture.enable(0);
        //this.otex.enable(0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        this.m_texture.disable(0);

        this.m_target.disable();

        //gl.disable(gl.DEPTH_TEST);
        gl.viewport(0, 0, 800, 600);

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.screen.enable();
        this.m_target.enableTex(0);
        this.otex.enable(1);

        //gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 100 * 75);

        this.otex.disable(1);
        this.m_target.disableTex(0);
    }
}