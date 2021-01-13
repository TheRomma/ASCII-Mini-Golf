class Shader {
    constructor(a_vertexSource, a_fragmentSource) {
        this.m_program = gl.createProgram();
        let vertex = this.create(gl.VERTEX_SHADER, a_vertexSource);
        let fragment = this.create(gl.FRAGMENT_SHADER, a_fragmentSource);

        gl.attachShader(this.m_program, vertex);
        gl.attachShader(this.m_program, fragment);
        gl.linkProgram(this.m_program);

        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
    }

    create(a_type, a_source) {
        let shd = gl.createShader(a_type);
        gl.shaderSource(shd, a_source);
        gl.compileShader(shd);
        let success = gl.getShaderParameter(shd, gl.COMPILE_STATUS);
        if (success) {
            return shd;
        }

        console.error(gl.getShaderInfoLog(shd));
        gl.deleteShader(shd);
    }

    get id() {
        return this.m_program;
    }

    enable() {
        gl.useProgram(this.m_program);
    }

    disable() {
        gl.useProgram(null);
    }
}