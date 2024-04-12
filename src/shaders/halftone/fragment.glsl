uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uRepetition;

uniform vec3 uShadowColor;
uniform float uShadowLowThreshold;
uniform float uShadowHighThreshold;

uniform vec3 uHighlightColor;
uniform float uHighlightLowThreshold;
uniform float uHighlightHighThreshold;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;
#include ../includes/halftone.glsl;

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

    vec3 lightDirection = vec3(1.0, 1.0, 0.0);

    light += directionalLight(
        vec3(1.0),
        1.0,
        normal,
        lightDirection,
        viewDirection,
        1.0
    );
    color *= light;

    // Halftone
    
    vec3 direction = vec3(0.0, -1.0, 0.0);
    vec3 pointColor = vec3(1.0, 0.0, 0.0);

    
    color = halftone(
        color,
        direction,
        uShadowLowThreshold,
        uShadowHighThreshold,
        uShadowColor,
        normal,
        vec2(0.45)
    );
    color = halftone(
        color,
        lightDirection,
        uHighlightLowThreshold,
        uHighlightHighThreshold,
        uHighlightColor,
        normal,
        vec2(0.55)
    );

    // Final color
    gl_FragColor = vec4( color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}