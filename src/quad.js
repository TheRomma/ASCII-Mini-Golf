class Quad {
    constructor() {
        this.m_VAO = gl.createVertexArray();
        this.m_VBO = gl.createBuffer();

        gl.bindVertexArray(this.m_VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_VBO);

        let vertices = [
            -1.0, -1.0, 0.0, 0.0,
            1.0, -1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0, 1.0,

            1.0, 1.0, 1.0, 1.0,
            -1.0, 1.0, 0.0, 1.0,
            1.0, -1.0, 1.0, 0.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    get id() {
        return this.m_VAO;
    }

    enable() {
        gl.bindVertexArray(this.m_VAO);
    }

    disable() {
        gl.bindVertexArray(null);
    }
}