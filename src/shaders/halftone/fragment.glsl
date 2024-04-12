uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uHalftoneResolution;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0),
        1.0
    );

    light += directionalLight(
        vec3(1.0),
        1.0,
        normal,
        vec3(1.0, 1.0, 0.0),
        viewDirection,
        1.0
    );
    color *= light;

    // Halftone grid
        vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= uHalftoneResolution;
    uv = mod(uv, 1.0);
    

    // Final color
    gl_FragColor = vec4(uv, 1.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}