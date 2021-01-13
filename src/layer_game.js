class Layer_game {
    constructor(a_levelPath) {
        this.m_timer = 0.0;
        this.m_dt = 0.0;
        this.m_currentLayer = this;

        this.filter = new ScreenFilter;
        this.mesh = new Quad;

        this.entities = new GameObjects(a_levelPath);
    }

    update(a_delta) {
        this.m_timer += a_delta;
        this.m_dt = a_delta;

        this.entities.update(this);

        return this.m_currentLayer;
    }

    draw() {
        this.filter.enableTarget();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);

        const bg = 0.1;

        gl.clearColor(Math.sin(this.m_timer / 2) * bg + bg, Math.sin(this.m_timer / 2 + 3.14 * 2 * 0.33) * bg + bg, Math.sin(this.m_timer / 2 + 3.14 * 2 * 0.66) * bg + bg, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.entities.draw(this);

        this.filter.disableTarget();

        this.mesh.enable();
        this.filter.draw();
        this.mesh.disable();
    }
}

class GameObjects {
    constructor(a_path) {
        this.levelData = JSON.parse(FileUtil.fileToString(a_path));
        this.shader = new Shader(s_game_vertex, s_game_fragment);
        this.mesh = new Quad;
        this.camera = new Camera(MathUtil.orthoMat(0, 800, 0, 600, 0.1, 100), [-5, -1, -10]);
        this.physicsEngine = Matter.Engine.create();
        this.texture = new Texture("res/tex/gametex.png", 32, 32, 8, 0);

        this.ball = new Ball([this.levelData.ball.x, this.levelData.ball.y], this.physicsEngine);
        this.perimeter = new Perimeter(this.physicsEngine);
        this.hole = new Hole([this.levelData.hole.x, this.levelData.hole.y, 0]);

        this.level = new Level(a_path, this.physicsEngine);

        this.shader.u_ball = gl.getUniformLocation(this.shader.id, "u_ball");
        this.shader.u_left = gl.getUniformLocation(this.shader.id, "u_left");
        this.shader.u_right = gl.getUniformLocation(this.shader.id, "u_right");
        this.shader.u_top = gl.getUniformLocation(this.shader.id, "u_top");
        this.shader.u_bottom = gl.getUniformLocation(this.shader.id, "u_bottom");
        this.shader.u_hole = gl.getUniformLocation(this.shader.id, "u_hole");
        this.shader.u_projView = gl.getUniformLocation(this.shader.id, "u_projView");
        this.shader.u_arrow = gl.getUniformLocation(this.shader.id, "u_arrow");
        this.shader.u_arrowTex = gl.getUniformLocation(this.shader.id, "u_arrowTex");
        this.shader.u_force = gl.getUniformLocation(this.shader.id, "u_force");

        this.shader.u_ballTex = gl.getUniformLocation(this.shader.id, "u_ballTex");
        this.shader.u_periTex = gl.getUniformLocation(this.shader.id, "u_periTex");
        this.shader.u_holeTex = gl.getUniformLocation(this.shader.id, "u_holeTex");

        this.physicsEngine.world.gravity.scale = 0;

        //Matter.Engine.run(this.physicsEngine);
    }

    update(a_layer) {
        Matter.Engine.update(this.physicsEngine, a_layer.m_dt * 1000);
        this.ball.update(a_layer, this.hole);
    }

    draw(a_layer) {

        this.level.draw(this.camera);

        this.shader.enable();
        this.mesh.enable();
        this.texture.enable(0);

        gl.uniformMatrix4fv(this.shader.u_projView, false, this.camera.getPV);
        this.ball.draw(this.shader);
        this.perimeter.draw(this.shader);
        this.hole.draw(this.shader);

        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, 7);

        this.shader.disable();
        this.mesh.disable();
        this.texture.disable(0);

        
    }
}

class Perimeter {
    constructor(a_physics) {
        this.left = Matter.Bodies.rectangle(10, 300, 20, 600, { isStatic: true });
        this.right = Matter.Bodies.rectangle(790, 300, 30, 600, { isStatic: true });
        this.top = Matter.Bodies.rectangle(400, 10, 780, 20, { isStatic: true });
        this.bottom = Matter.Bodies.rectangle(400, 590, 780, 20, { isStatic: true });
        //console.log(this.left);
        Matter.World.add(a_physics.world, [this.left, this.right, this.top, this.bottom]);
        
    }

    update() {
        
    }

    draw(a_shader) {
        gl.uniformMatrix4fv(a_shader.u_left, false, MathUtil.multiplyMatrices([MathUtil.transMat([this.left.position.x, this.left.position.y, 0]), MathUtil.scaleMat([10, 300, 1])]));
        gl.uniformMatrix4fv(a_shader.u_right, false, MathUtil.multiplyMatrices([MathUtil.transMat([this.right.position.x, this.right.position.y, 0]), MathUtil.scaleMat([15, 300, 1])]));
        gl.uniformMatrix4fv(a_shader.u_top, false, MathUtil.multiplyMatrices([MathUtil.transMat([this.top.position.x, this.top.position.y, 0]), MathUtil.scaleMat([390, 10, 1])]));
        gl.uniformMatrix4fv(a_shader.u_bottom, false, MathUtil.multiplyMatrices([MathUtil.transMat([this.bottom.position.x, this.bottom.position.y, 0]), MathUtil.scaleMat([390, 10, 1])]));

        gl.uniform1i(a_shader.u_periTex, 4);
    }
}

class Ball {
    constructor(a_pos, a_physics) {
        this.body = Matter.Bodies.circle(a_pos[0], a_pos[1], 25);

        this.state = 0;
        this.force = 0;

        this.body.restitution = 1;
        this.body.density = 0.003;

        this.arrowTex = 6;

        this.direction = 0;
        this.bodyPos = this.body.position;

        this.ballTex = 1;

        this.divider = 1;

        Matter.World.add(a_physics.world, [this.body]);
        
    }

    update(a_layer, a_hole) {

        if (this.state != 2) {
            if (input.KeyR) {
                a_layer.m_currentLayer = new Layer_game(a_layer.entities.levelData.level.current);
            }
        }

        if (AABB.againstAABB(a_hole.dimentions, [[this.bodyPos.x, this.bodyPos.y, -1], [this.bodyPos.x, this.bodyPos.y, 1]])) {
            this.state = 2;
        }

        if (this.state == 0) {
            this.arrowTex = 6;
            let vec = MathUtil.reduceVectors([[this.bodyPos.x, this.bodyPos.y, 0], [input.mouseX - 5, input.mouseY - 1, 0]]);
            this.direction = MathUtil.normalizeVector(vec);

            
            

            if (input.mouse1 == true) {
                this.force += a_layer.m_dt;
                if (this.force >= 1) { this.force = 1; }
                //console.log(this.force);

            }
            if (input.mouse1 == false && this.force != 0) {

                //console.log(direction);
                Matter.Body.applyForce(this.body, { x: this.bodyPos.x, y: this.bodyPos.y }, { x: this.direction[0] * ((this.force / (144 * a_layer.m_dt)) * (this.force / (144 * a_layer.m_dt))), y: this.direction[1] * ((this.force / (144 * a_layer.m_dt)) * (this.force / (144 * a_layer.m_dt))) });
                this.state = 1;
                this.force = 0;
            }
        }
        else if (this.state == 1) {
            if (this.body.speed < 0.001) {
                Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
                this.state = 0;

            }
            this.arrowTex = 7;
        }
        else if (this.state == 2) {
            this.arrowTex = 7;
            //this.ballTex = 7;
            this.divider += a_layer.m_dt * 5;
            Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
            if (this.divider >= 4) { a_layer.m_currentLayer = new Layer_game(a_layer.entities.levelData.level.next); }
        }
    }

    draw(a_shader) {
        gl.uniformMatrix4fv(a_shader.u_ball, false, MathUtil.multiplyMatrices([MathUtil.transMat([this.body.position.x, this.body.position.y, 1]), MathUtil.scaleMat([25 / this.divider, 25 / this.divider, 1])]));
        let dir = MathUtil.zRotationMat(-Math.atan(this.direction[1] / this.direction[0]));
        let correction = 0;
           
        if (this.direction[0] < 0) {
            correction = 0;
        }
        else {
            correction = 3.14;
        }
        gl.uniformMatrix4fv(a_shader.u_arrow, false, MathUtil.multiplyMatrices([MathUtil.scaleMat([2.5, 2.5, 2.5]), dir, MathUtil.zRotationMat(3.14 / 4 + 3.14 / 2 + correction)]));

        gl.uniform1i(a_shader.u_ballTex, this.ballTex);
        gl.uniform1i(a_shader.u_arrowTex, this.arrowTex);
        gl.uniform1f(a_shader.u_force, this.force);
    }
}

class Hole {
    constructor(a_pos) {
        this.pos = a_pos;
        this.bounds = new AABB([-25, -25, 0], [25, 25, 0]);
        this.dimentions = this.bounds.dimentions(this.pos);
    }

    update() {

    }

    draw(a_shader) {
        gl.uniformMatrix4fv(a_shader.u_hole, false, MathUtil.multiplyMatrices([MathUtil.transMat(this.pos), MathUtil.scaleMat([30, 30, 1])]));
        gl.uniform1i(a_shader.u_holeTex, 5);
    }
}

class Level {
    constructor(a_path, a_physics) {
        this.objects = JSON.parse(FileUtil.fileToString(a_path));
        //console.log(this.objects.container[0].h);
        this.bodies = [];
        for (let i = 0; i < this.objects.container.length; i++) {
            this.bodies[i] = Matter.Bodies.rectangle(this.objects.container[i].x, this.objects.container[i].y, this.objects.container[i].w, this.objects.container[i].h, { isStatic: true });
        }
        //console.log(this.bodies[0]);

        Matter.World.add(a_physics.world, this.bodies);

        this.shader = new Shader(s_basic_vertex, s_basic_fragment);
        this.mesh = new Quad;
        this.texture = new Texture("res/tex/wall.png", 32, 32, 1, 0);

        this.shader.u_model = gl.getUniformLocation(this.shader.id, "u_model");
        this.shader.u_projView = gl.getUniformLocation(this.shader.id, "u_projView");
        this.shader.u_texId = gl.getUniformLocation(this.shader.id, "u_texId");

    }

    draw(a_camera) {
        this.shader.enable();
        gl.uniformMatrix4fv(this.shader.u_projView, false, a_camera.getPV);
        gl.uniform1i(this.shader.u_texId, 0);

        this.mesh.enable();
        this.texture.enable(0);

        for (let i = 0; i < this.objects.container.length; i++) {
            let trans = MathUtil.transMat([this.objects.container[i].x, this.objects.container[i].y, 0]);
            let scale = MathUtil.scaleMat([this.objects.container[i].w/2, this.objects.container[i].h/2, 1]);

            gl.uniformMatrix4fv(this.shader.u_model, false, MathUtil.multiplyMatrices([trans, scale]));

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        this.shader.disable();
        this.mesh.disable();
        this.texture.disable(0);
    }
}