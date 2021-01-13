#version 300 es

precision mediump float;

in vec2 f_tex;
flat in int f_instance;

precision mediump sampler2DArray;
uniform sampler2DArray u_tex;

uniform float u_time;

out vec4 outColor;

void main(){
    vec4 texColor = texture(u_tex, vec3(f_tex, f_instance));

    if(f_instance == 0)
    {
        outColor = texColor;
    }
    
    if(f_instance == 1)
    {
        outColor = texColor * vec4(sin(u_time - f_tex.x * 2.0) * 0.5 + 0.5, sin(u_time + 3.14 * 2.0 * 0.33 - f_tex.x * 2.0) * 0.5 + 0.5, sin(u_time + 3.14 * 2.0 * 0.66 - f_tex.x * 2.0) * 0.5 + 0.5, 1.0);
    }
}