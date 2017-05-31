import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import timeLoop from "./loopHOC";

// in gl-react you need to statically define "shaders":
const shaders = Shaders.create({
  helloGL: {
// This is our first fragment shader in GLSL language (OpenGL Shading Language)
// (GLSL code gets compiled and run on the GPU)
    frag: GLSL`

precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define MAX_ITER 20

float remap(float value, float l1, float h1, float l2, float h2) {
  return l2 + (value - l1) * (h2 - l2) / (h1 - l1);
}

float mapRed(float r) {
//  r = remap(r, 0.0, 1.0, 0.0, 1.0);
  return r;
}

float mapGreen(float g) {
//  g = remap(g, 0.0, 1.0, 0.0, 1.0);
  return g;
}

float mapBlue(float b) {
 //b = remap(b, 0.0, 1.0, 0.0, 0.9);
  return b;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution * 4.0) - vec2(-10.0, 0.0);
	vec2 i = p;
	float scaleTime = time * 0.04 + 1000.0;

	float c = 1.0;
	float inten = .05;

	for (int n = 0; n < MAX_ITER; n++){
		float t = -scaleTime * (1.5 - (10.0 / float(n+1)));
    i[1] = i[1] + scaleTime * 10.0;
		i = p + vec2(
      cos(t - i.x) + cos(t - i.y),
      sin(t - i.y) + cos(t + i.x)
    );
		c += 1.0/length(vec2(p.x / (cos(i.y + t)/inten)));
	}
	c /= float(MAX_ITER);
	float col = c*c*c*c*c;
	gl_FragColor = vec4(mapRed(col), mapGreen(col), mapBlue(col), 1.0);
}

`
// the main() function is called FOR EACH PIXELS
// the varying uv is a vec2 where x and y respectively varying from 0.0 to 1.0.
// we set in output the pixel color using the vec4(r,g,b,a) format.
// see GLSL_ES_Specification_1.0.17
  }
});

const Sketch = ({ time, width, height }) => {
  return (
    <Surface width={width} height={height}>
      <Node
        shader={shaders.helloGL}
        uniforms={{ time, resolution: [ width, height ] }} />
    </Surface>
  )
}

const Comp = timeLoop(Sketch)

export default class GL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
  }
  componentDidMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  render() {
    return (
      <Comp width={this.state.width} height={this.state.height} />
    );
  }
}

const app = document.createElement('div');  
document.body.appendChild(app);

ReactDOM.render(<GL />, app);  
