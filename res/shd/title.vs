#version 300 es
        
layout (location = 0) in vec2 v_pos;
layout (location = 1) in vec2 v_tex;
        
out vec2 f_tex;
flat out int f_instance;

uniform mat4 u_gmodel;
uniform mat4 u_mmodel;
uniform mat4 u_projView;

void main(){          
    f_tex = v_tex;
    f_instance = gl_InstanceID;
    if(gl_InstanceID == 0)
    {gl_Position = u_projView * u_gmodel * vec4(v_pos, 0.0, 1.0);}
    if(gl_InstanceID == 1)
    {gl_Position = u_projView * u_mmodel * vec4(v_pos, 0.0, 1.0);}
}