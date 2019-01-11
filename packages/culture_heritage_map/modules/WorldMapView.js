import '../../../common/js/exec/d3.4.5.0.min.exec'
import _ from 'lodash'
import { wait, projectionTween } from '../utils'
var d3 = window.d3;

WorldMapView.action = {
  rotate: WorldMapView.prototype.rotate
};

function WorldMapView(customOptions) {
  customOptions = customOptions || {};
  
  var defaultOptions = {
    geometry: null,
    width: 960,
    height: 500,
    globeWidth: 800,
    globeHeight: 800,
    rotation: {
      x: 0,
      y: -20,
      z: 0
    },
    classNames: {
      background: 'background',
      segment: 'segment',
      grid: 'grid',
      marker: 'marker',
      segment_group: 'segment_group',
      grid_group: 'grid_group',
      marker_group: 'marker_group'
    },
  };
  
  var instance = Object.create(WorldMapView.prototype);
  var twoDepthKeys = ['rotate', 'classNames'];
  
  _.forOwn(defaultOptions, function(defaultValue, key) {
    var value = customOptions[key];
    
    if (twoDepthKeys.indexOf(key) === -1)
      instance[key] = value === undefined ? defaultValue : value;
    else if (value !== undefined)
      instance[key] = _.assign(defaultValue, value);
  });
  
  instance.el = {
    background: null,
    grids: null,
    segments: null,
    markers: null
  };
  
  instance._d3 = null;
  instance._projection = null;
  instance._geoPath = null;
  
  return instance;
}

WorldMapView.prototype.getGlobeProjection = function() {
  return d3.geoOrthographic()
    .fitExtent([[1, 1], [this.globeWidth - 1, this.globeHeight - 1]], { type: 'Sphere' })
    .translate([this.width / 2, this.height / 2])
    .rotate([this.rotation.x, this.rotation.y, this.rotation.z]);
};

WorldMapView.prototype.getPlaneMapProjection = function() {
  var extent;
  var rate = 1627 / 813.5;
  
  if (this.width / this.height > rate) {
    extent = [[0, 0], [this.width, this.width / rate]];
  } else {
    extent = [[0, 0], [this.height * rate, this.height]];
  }
  
  return d3.geoEquirectangular()
    .fitExtent(extent, this.geometry)
    .translate([this.width / 2, this.height / 2])
    .rotate([0, 0, 0]);
};

WorldMapView.prototype.initElementGroups = function(targetEl) {
  var background = document.createElement('div');
  background.className = this.classNames.background;
  
  targetEl.appendChild(background);
  
  var svg = d3
    .select('#' + targetEl.id)
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height);
  
  var grids = svg
    .append('g')
    .attr('class', this.classNames.grid_group);
  
  var segments = svg
    .append('g')
    .attr('class', this.classNames.segment_group);
  
  var markers = svg
    .append('g')
    .attr('class', this.classNames.marker_group);
  
  this._d3 = {
    svg: svg,
    grids: grids,
    segments: segments,
    markers: markers
  };
  
  this.el.background = targetEl.querySelector('.' + this.classNames.background);
  this.el.grids = targetEl.querySelector('.' + this.classNames.grid_group);
  this.el.segments = targetEl.querySelector('.' + this.classNames.segment_group);
  this.el.markers = targetEl.querySelector('.' + this.classNames.marker_group);
  
  return this._d3;
};

WorldMapView.prototype.renderSVG = function(targetEl, data, type) {
  var _d3 = this.initElementGroups(targetEl);
  var projection = type.toUpperCase() === '3D' ? this.getGlobeProjection() : this.getPlaneMapProjection();
  var geoPath = d3.geoPath().projection(projection);
  var grid = d3.geoGraticule().step([10, 10]);

  // Draw Grids
  this._d3.grids = _d3.grids
    .append('path')
    .datum(grid)
    .attr('class', this.classNames.grid)
    .attr('d', geoPath);

  // Draw Globe
  this._d3.segments = _d3.segments
    .selectAll('.' + this.classNames.segment)
    .data(this.geometry.features)
    .enter()
    .append('path')
    .attr('class', this.classNames.segment)
    .attr('d', geoPath);
  
  // Draw Markers
  this._d3.markers = _d3.markers
    .selectAll('.' + this.classNames.marker)
    .data(data.marker)
    .enter()
    .append('circle')
    .attr('class', this.classNames.marker);
  
  this._projection = projection;
  this._geoPath = geoPath;
  
  this.drawMarkers(projection);
};

WorldMapView.prototype.drawMarkers = function(projection) {
  var center = [ this.width / 2, this.height / 2 ];
  
  this._d3.markers
    .attr('cx', function(d) {
      return projection(d.coordinate)[0]
    })
    .attr('cy', function(d) {
      return projection(d.coordinate)[1]
    })
    .attr('style', function(d) {
      var distance = d3.geoDistance(d.coordinate, projection.invert(center));
    
      return distance > 1.57 ? 'display:none' : 'display:block'
    });
};

WorldMapView.prototype.rotate = function(rotation) {
  this.rotation.x = rotation[0];
  this.rotation.y = rotation[1];
  this.rotation.z = rotation[2];

  var projection = this._projection.rotate(rotation);
  this._d3.grids.attr('d', this._geoPath);
  this._d3.segments.attr('d', this._geoPath);
  
  this.drawMarkers(projection);
};

WorldMapView.prototype.animate = function(from, to, action, duration, isInfinity) {
  var self = this;
  var unit = from.map(function(fr, i) {
    return (to[i] - fr) / duration;
  });
  
  var timer = d3.timer(function(elapsed) {
    var frame = from.map(function(fr, i, from) {
      return fr + unit[i] * elapsed;
    });

    action.call(self, frame);
    
    if (!isInfinity && elapsed >= duration) {
      timer.stop();
    }
  });
  
  return timer;
};

WorldMapView.prototype.transformToPlaneMap = function() {
  var self = this;
  var planeProjection = this.getPlaneMapProjection().rotate([0, 0]).center([0, 0]);
  var globeProjection = this.getGlobeProjection().rotate([0, 0]).center([0, 0]);
  var center = [this.width / 2, this.height / 2];
  var path = d3.geoPath().projection(planeProjection);
  
  return new Promise(function(resolve) {
    self.el.segments.style.opacity = 0;
    self.el.markers.style.opacity = 0;
    self.el.background.classList.add('fade-out');

    var x = Math.ceil(self.rotation.x / 10) * 10;

    self.animate(
      [ self.rotation.x, self.rotation.y, self.rotation.z ],
      [ x, 0, self.rotation.z ],
      self.rotate,
      400
    )

    resolve();
  }).then(function() {
    return wait(400);
  }).then(function() {
    self._d3.grids
      .transition()
      .duration(800)
      .attrTween('d', projectionTween(
        globeProjection,
        planeProjection,
        center
      ));
  }).then(function() {
    return wait(800);
  }).then(function() {
    self._d3.segments.attr('d', path);
    self.drawMarkers(planeProjection);
    self.el.segments.style.opacity = 1;
    self.el.markers.style.opacity = 1;
    self.el.background.classList.add('is-plane');
  });
};

export default WorldMapView
