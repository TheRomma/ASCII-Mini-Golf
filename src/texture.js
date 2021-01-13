class Texture {
    constructor(a_imgSource, a_width, a_height, a_count, a_unit) {
        this.m_texture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.m_texture);

        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

        const image = new Image();

        image.onload = () => {
            gl.activeTexture(gl.TEXTURE0 + a_unit);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.m_texture);

            gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, a_width, a_height, a_count, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D_ARRAY);

            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
        };

        image.src = a_imgSource;
    }

    get id() {
        return this.m_texture;
    }

    enable(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.m_texture);
    }

    disable(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }
}