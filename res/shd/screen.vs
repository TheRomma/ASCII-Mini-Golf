#version 300 es
        
layout (location = 0) in vec2 v_pos;
layout (location = 1) in vec2 v_tex;
        
out vec2 f_tex;
out float f_width;
out float f_height;
out float f_offset_width;
out float f_offset_height;

uniform mat4 u_projView;
uniform float u_width;
uniform float u_height;

void main(){     

    float instance = float(gl_InstanceID);

    float offset_height = floor(instance / u_width);
    float offset_width = instance - offset_height * u_width;

    f_offset_width = offset_width;
    f_offset_height = offset_height;
    f_width = u_width;
    f_height = u_height;
    f_tex = v_tex;
    gl_Position = u_projView * vec4(v_pos + vec2(offset_width, offset_height) * 2.0, 0.0, 1.0);
}