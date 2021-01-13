#version 300 es

precision mediump float;

in vec2 f_tex;
in float f_width;
in float f_height;
in float f_offset_width;
in float f_offset_height;

uniform sampler2D u_tex;

precision mediump sampler2DArray;
uniform sampler2DArray u_atex;

out vec4 outColor;

void main(){
    vec4 sourceImg = texture(u_tex, vec2(f_offset_width / f_width, 1.0 - (f_offset_height / f_height)));
    int texId = 0;

    float R = round(sourceImg.r);
    float G = round(sourceImg.g);
    float B = round(sourceImg.b);

    if(R < 0.5 && G < 0.5 && B < 0.5){texId = 0;}
    if(R < 0.5 && G < 0.5 && B > 0.5){texId = 0;}
    if(R < 0.5 && G > 0.5 && B < 0.5){texId = 1;}
    if(R < 0.5 && G > 0.5 && B > 0.5){texId = 2;}
    if(R > 0.5 && G < 0.5 && B < 0.5){texId = 3;}
    if(R > 0.5 && G < 0.5 && B > 0.5){texId = 4;}
    if(R > 0.5 && G > 0.5 && B < 0.5){texId = 5;}
    if(R > 0.5 && G > 0.5 && B > 0.5){texId = 6;}

    //outColor = texture(u_tex, f_tex);
    outColor = texture(u_atex, vec3(f_tex, texId)) * sourceImg;
}