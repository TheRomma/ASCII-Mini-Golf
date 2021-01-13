#version 300 es

precision mediump float;

in vec2 f_tex;
flat in int f_instance;

precision mediump sampler2DArray;
uniform sampler2DArray u_tex;

uniform int u_ballTex;
uniform int u_periTex;
uniform int u_holeTex;
uniform int u_arrowTex;
uniform float u_force;

out vec4 outColor;

void main(){
    
    if(f_instance >= 0 && f_instance < 4)
    {
        outColor = texture(u_tex, vec3(f_tex, u_periTex));
    }
    if(f_instance == 4)
    {
        outColor = texture(u_tex, vec3(f_tex, u_holeTex));
    }
    if(f_instance == 5)
    {
        outColor = texture(u_tex, vec3(f_tex, u_arrowTex)) * vec4(1.0, 1.0 - u_force, 1.0 - u_force, 1.0);
    }
    if(f_instance == 6)
    {
        outColor = texture(u_tex, vec3(f_tex, u_ballTex));
    }
}