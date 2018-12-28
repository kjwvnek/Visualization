import '../../../common/js/exec/d3.4.5.0.min.exec'

function DimensionalWorldMap(options) {
  this.geometryData = options.geometryData;
  this.width = options.width || 960;
  this.height = options.height || 500;
  this.rotateX = options.rotateX || 0;
  this.rotateY = options.rotateY || -20;
  this.rotateZ = options.rotateZ || 0;

  options.classNames = options.classNames || {};
  this.classNames = {
    segment: options.classNames.segment || 'segment',
    graticule: options.classNames.graticule || 'graticule'
  };

  this.elements = {};
  this.elements.svg = window.d3.select('#' + options.holderId).attr('width', this.width).attr('height', this.height);
  this.elements.markers = this.elements.svg.append('g');
  this.elements.paths = this.elements.svg.selectAll('path');

  this.projection = null;
  this.path = null;
}

DimensionalWorldMap.prototype.render3D = function() {
  this.projection = this.get3DProjection().rotate([this.rotateX, this.rotateY, this.rotateZ]);
  this.path = window.d3.geoPath().projection(this.projection);

  var graticule = window.d3.geoGraticule().step([10, 10]);

  // Draw Graticule
  this.elements.svg.append('path')
    .datum(graticule)
    .attr('d', this.path)
    .attr('class', this.classNames.graticule);

  // Draw Globe
  this.elements.svg.selectAll('.' + this.classNames.segment)
    .data(this.geometryData)
    .enter()
    .append('path')
    .attr('d', this.path)
    .attr('class', this.classNames.segment);
};

DimensionalWorldMap.prototype.rotate3D = function(rotation, delay, units) {
  var self = this;
  var timeUnit = 16; // 60fps
  var unit, xUnit, yUnit, zUnit;

  if (delay !== -1) {
    unit = Math.ceil(delay / timeUnit);

    xUnit = (rotation[0] - this.rotateX) / unit;
    yUnit = (rotation[1] - this.rotateY) / unit;
    zUnit = (rotation[2] - this.rotateZ) / unit;
  } else {
    xUnit = units[0] || 0;
    yUnit = units[1] || 0;
    zUnit = units[2] || 0;
  }

  var timer = d3.timer(function(elapsed) {
    self.rotateX += xUnit;
    self.rotateY += yUnit;
    self.rotateZ += zUnit;

    self.projection = self.projection.rotate([self.rotateX, self.rotateY, self.rotateZ]);
    self.elements.svg.selectAll('path').attr('d', self.path);

    if (delay !== -1 && elapsed >= delay) {
      timer.stop();
    }
  }, timeUnit);

  return timer;
};

DimensionalWorldMap.prototype.transform3Dto2D = function() {
  this.projection = this.interpolatedProjection(
    this.get3DProjection(),
    this.get2DProjection()
  );
  this.path = window.d3.geoPath().projection(this.projection);
  this.elements.paths = this.elements.svg.selectAll('path');

  this.animate3Dto2D();
};

DimensionalWorldMap.prototype.animate3Dto2D = function() {
  var self = this;

  this.elements.svg.transition()
    .duration(5000)
    .tween('projection', function() {
      return function(x) {
        self.projection.alpha(x);
        self.elements.paths.attr('d', self.path);
      }
    });
};

DimensionalWorldMap.prototype.get3DProjection = function() {
  return window.d3.geoOrthographic();
};

DimensionalWorldMap.prototype.get2DProjection = function() {
  return window.d3.geoEquirectangular();
}

DimensionalWorldMap.prototype.interpolatedProjection = function(a, b) {
  var projection = d3.geoProjection(raw).scale(1),
      center = projection.center,
      translate = projection.translate,
      α;

  function raw(λ, φ) {
    var pa = a([λ *= 180 / Math.PI, φ *= 180 / Math.PI]), pb = b([λ, φ]);
    return [(1 - α) * pa[0] + α * pb[0], (α - 1) * pa[1] - α * pb[1]];
  }

  projection.alpha = function(_) {
    if (!arguments.length) return α;
    α = +_;
    var ca = a.center(), cb = b.center(),
        ta = a.translate(), tb = b.translate();
    center([(1 - α) * ca[0] + α * cb[0], (1 - α) * ca[1] + α * cb[1]]);
    translate([(1 - α) * ta[0] + α * tb[0], (1 - α) * ta[1] + α * tb[1]]);
    return projection;
  };

  delete projection.scale;
  delete projection.translate;
  delete projection.center;
  return projection.alpha(0);
}

export default DimensionalWorldMap
