class Layer_menu {
    constructor() {
        this.m_timer = 0.0;
        this.m_dt = 0.0;
        this.m_currentLayer = this;

        this.scene = new MenuScene;
    }

    update(a_delta) {
        this.m_timer += a_delta;
        this.m_dt = a_delta;

        this.scene.update(this);

        return this.m_currentLayer;
    }

    draw() {
        this.scene.draw(this);
    }
}

class MenuScene {
    constructor() {
        this.camera = new Camera(MathUtil.orthoMat(0, 800, 0, 600, 0.1, 100), [0, 0, -10]);
        this.filter = new ScreenFilter;
        this.title = new TitleText;
        this.mesh = new Quad;

        this.button = new TitleButton;
    }

    update(a_layer) {
        this.title.update(a_layer);
        this.button.update(a_layer);
    }

    draw(a_layer) {
        this.filter.enableTarget();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);

        const bg = 0.1;

        gl.clearColor(Math.sin(a_layer.m_timer / 2) * bg + bg, Math.sin(a_layer.m_timer / 2 + 3.14 * 2 * 0.33) * bg + bg, Math.sin(a_layer.m_timer / 2 + 3.14 * 2 * 0.66) * bg + bg, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.title.draw(this.camera, a_layer);
        this.button.draw(this.camera);

        this.filter.disableTarget();

        this.mesh.enable();

        this.filter.draw();
    }
}

class TitleText {
    constructor() {
        this.texture = new Texture("res/tex/golf.png", 216, 56, 2, 0);
        this.golfStart = MathUtil.multiplyMatrices([MathUtil.transMat([400, 200, -1]), MathUtil.scaleMat([300, 100, 1])]);
        this.miniStart = MathUtil.multiplyMatrices([MathUtil.transMat([150, 60, 1]), MathUtil.scaleMat([120, 30, 1])]);
        this.golfModel = this.golfStart;
        this.miniModel = this.miniStart;
        this.shader = new Shader(s_title_vertex, s_title_fragment);
        this.mesh = new Quad;

        this.shader.u_gmodel = gl.getUniformLocation(this.shader.id, "u_gmodel");
        this.shader.u_mmodel = gl.getUniformLocation(this.shader.id, "u_mmodel");
        this.shader.u_projView = gl.getUniformLocation(this.shader.id, "u_projView");
        this.shader.u_time = gl.getUniformLocation(this.shader.id, "u_time");
    }

    update(a_layer) {
        this.golfModel = MathUtil.multiplyMatrices([this.golfStart, MathUtil.zRotationMat(Math.sin(a_layer.m_timer / 2) * 3.14 / 24)]);
        this.miniModel = MathUtil.multiplyMatrices([this.miniStart, MathUtil.zRotationMat(Math.sin(a_layer.m_timer / 2) * 3.14 / 64)]);
    }

    draw(a_camera, a_layer) {
        this.shader.enable();
        this.mesh.enable();
        this.texture.enable(0);

        gl.uniformMatrix4fv(this.shader.u_gmodel, false, this.golfModel);
        gl.uniformMatrix4fv(this.shader.u_mmodel, false, this.miniModel);
        gl.uniformMatrix4fv(this.shader.u_projView, false, a_camera.getPV);
        gl.uniform1f(this.shader.u_time, a_layer.m_timer);

        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 2);
        
    }
}

class TitleButton {
    constructor() {
        this.texture = new Texture("res/tex/play.png", 32, 32, 1, 0);
        this.shader = new Shader(s_basic_vertex, s_basic_fragment);
        this.mesh = new Quad;
        this.pos = MathUtil.transMat([400, 450, 0]);
        this.scale = MathUtil.scaleMat([90, 90, 1]);
        this.rot = MathUtil.idMat;
        this.boundingBox = new AABB([-90, -90, 0], [90, 90, 0]);

        this.shader.u_model = gl.getUniformLocation(this.shader.id, "u_model");
        this.shader.u_projView = gl.getUniformLocation(this.shader.id, "u_projView");
        this.shader.u_texId = gl.getUniformLocation(this.shader.id, "u_texId");
    }

    update(a_layer) {
        if (AABB.againstMouse(this.boundingBox.dimentions([400, 450, 0]), [input.mouseX, input.mouseY, 0])) {
            if (input.mouse1) {
                a_layer.m_currentLayer = new Layer_game("res/level/level1.json");
                this.scale = MathUtil.scaleMat([90, 90, 1]);
            }
            else {
                this.scale = MathUtil.scaleMat([99, 100, 1]);
            }
        }
        else {
            this.scale = MathUtil.scaleMat([90, 90, 1]);
        }
        this.rot = MathUtil.zRotationMat(Math.sin(a_layer.m_timer / 2) * 3.14 / 32)
    }

    draw(a_camera) {
        this.shader.enable();
        this.mesh.enable();
        this.texture.enable(0);

        gl.uniformMatrix4fv(this.shader.u_model, false, MathUtil.multiplyMatrices([this.pos, this.scale, this.rot]));
        gl.uniformMatrix4fv(this.shader.u_projView, false, MathUtil.multiplyMatrices([a_camera.getPV]));
        gl.uniform1i(this.shader.u_texId, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}