vec3 halftone(vec3 color, vec3 direction, float low, float high, vec3 pointColor, vec3 normal, vec2 offset) {
  float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= uRepetition;
    uv = mod(uv, 1.0);

    float point = distance(uv, offset);
    point = 1.0 - step(0.5 * intensity, point);
    
  return mix(color, pointColor, point);
  
      
}