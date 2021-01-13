#version 300 es

precision mediump float;

in vec2 f_tex;

precision mediump sampler2DArray;
uniform sampler2DArray u_tex;

uniform int u_texId;

out vec4 outColor;

void main(){
    outColor = texture(u_tex, vec3(f_tex, u_texId));
}