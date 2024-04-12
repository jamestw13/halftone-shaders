uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uHalftoneResolution;
uniform float uLowThreshold;
uniform float uHighThreshold;

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
vec3 direction = vec3(0.0, -1.0, 0.0);
float low = uLowThreshold;
float high = uHighThreshold;

float intensity = dot(normal, direction);
intensity = smoothstep(low, high, intensity);

        vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= uHalftoneResolution;
    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);
    

    // Final color
    gl_FragColor = vec4(point , point , point, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}