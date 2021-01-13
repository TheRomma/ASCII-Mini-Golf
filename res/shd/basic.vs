#version 300 es
        
layout (location = 0) in vec2 v_pos;
layout (location = 1) in vec2 v_tex;
        
out vec2 f_tex;

uniform mat4 u_model;
uniform mat4 u_projView;

void main(){          
    f_tex = v_tex;
    gl_Position = u_projView * u_model * vec4(v_pos, 0.0, 1.0);
}