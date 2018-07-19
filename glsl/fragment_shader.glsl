#version 300 es
		precision mediump float;
		uniform sampler2D uAltas;
		in highp vec2 vUV;
		out vec4 outColor;

		void main(void){ outColor = texture(uAltas,vUV); }