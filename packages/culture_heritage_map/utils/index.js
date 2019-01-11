export function toFixed(num, digit) {
  return Number(num.toFixed(digit));
}

export function wait(duration) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, duration);
  });
}

/* ref: https://bl.ocks.org/mbostock/3711652 */
export function projectionTween(projection0, projection1, center) {
  return function(d) {
    var t = 0;
    
    var projection = window.d3.geoProjection(project)
      .scale(1)
      .translate(center);
    
    var path = window.d3.geoPath()
      .projection(projection);
    
    function project(λ, φ) {
      λ *= 180 / Math.PI, φ *= 180 / Math.PI;
      var p0 = projection0([λ, φ]), p1 = projection1([λ, φ]);
      return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
    }
    
    return function(_) {
      t = _;
      return path(d);
    };
  };
}