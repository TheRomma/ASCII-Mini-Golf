#version 300 es
        
layout (location = 0) in vec2 v_pos;
layout (location = 1) in vec2 v_tex;
        
out vec2 f_tex;
flat out int f_instance;

uniform mat4 u_ball;
uniform mat4 u_left;
uniform mat4 u_right;
uniform mat4 u_top;
uniform mat4 u_bottom;
uniform mat4 u_hole;
uniform mat4 u_arrow;

uniform mat4 u_projView;

void main(){          
    f_tex = v_tex;
    f_instance = gl_InstanceID;

    
    if(gl_InstanceID == 0)
    {gl_Position = u_projView * u_left * vec4(v_pos, 0.0, 1.0);}
    if(gl_InstanceID == 1)
    {gl_Position = u_projView * u_right * vec4(v_pos, 0.0, 1.0);}
    if(gl_InstanceID == 2)
    {gl_Position = u_projView * u_top * vec4(v_pos, 0.0, 1.0);}
    if(gl_InstanceID == 3)
    {gl_Position = u_projView * u_bottom * vec4(v_pos, 0.0, 1.0);}
    if(gl_InstanceID == 4)
    {gl_Position = u_projView * u_hole * vec4(v_pos, 0.0, 1.0);}
    if(gl_InstanceID == 5)
    {gl_Position = u_projView * u_ball * u_arrow * vec4(v_pos, 0.0, 1.0);}
    if(gl_InstanceID == 6)
    {gl_Position = u_projView * u_ball * vec4(v_pos, 0.1, 1.0);}
}