import '../../../common/js/exec/d3.4.5.0.min.exec'

class WorldMap {
  constructor(mapWidth, mapHeight) {
    this.scalar = {
      width: mapWidth || 3000,
      height: mapHeight || 1200,
      countryStroke: 1
    };
    this.zoom = {
      min: 1,
      max: 1,
      d3: window.d3.zoom().on('zoom', () => {
        let t = window.d3.event.transform;
  
        this.countries.attr('transform', `translate(${t.x}, ${t.y}) scale(${t.k})`);
      })
    };
    this.position = {
      centerX: 0,
      centerY: 0
    };
    this.className = {
      wrap: '_map-wrap',
      country: '_map-country',
      countryHighlight: '_map-country-on',
      graticule: '_map-graticule'
    };
    this.containerElement = null;
    this.svg = null;
    this.path = null;
    this.countries = null;
  }

  createSvg(holderId) {
    this.svg = window.d3.select(holderId)
      .append('svg')
      .attr('width', this.containerElement.clientWidth)
      .attr('height', this.containerElement.clientHeight)
      .call(this.zoom.d3);
  }

  calculatePath() {
    let projection = window.d3.geoEquirectangular()
      .center([0, 15])
      .scale([this.scalar.width / (2 * Math.PI)])
      .translate([this.scalar.width / 2, this.scalar.height / 2]);

    this.path = d3.geoPath().projection(projection);
  }

  initializeViewport() {
    let containerWidth = this.containerElement.clientWidth;
    let containerHeight = this.containerElement.clientHeight;
    let mapWidth = this.scalar.width;
    let mapHeight = this.scalar.height;

    this.zoom.min = Math.max(
      containerWidth / mapWidth,
      containerHeight / mapHeight
    );
    this.zoom.max = 5 * this.zoom.min;
    this.centerX = (containerWidth - this.zoom.min * mapWidth) / 2;
    this.centerY = (containerHeight - this.zoom.min * mapHeight) / 2;
  }

  initializeZoom() {
    this.zoom.d3.scaleExtent([ this.zoom.min, this.zoom.max ])
      .translateExtent([[0, 0], [this.scalar.width, this.scalar.height]]);

    this.svg.call(
      this.zoom.d3.transform,
      window.d3.zoomIdentity.translate(this.centerX, this.centerY).scale(this.zoom.min)
    );
  }

  handleMouseOverCountry() {
    console.log('mouseover');
  }

  handleMouseOutCountry() {
    console.log('mouseout');
  }

  handleClickCountry() {
    console.log('click!');
  }

  drawMap(json) {
    this.countries = this.svg.append('g').attr('id', 'map');
    // draw background
    this.countries.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.scalar.width)
      .attr('height', this.scalar.height)
      .attr('class', this.className.wrap);
    
    // draw countries
    this.countries.selectAll('path')
      .data(json)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('id', (d, i) => `country${d.properties.iso_a3}`)
      .attr('class', this.className.country)
      .on('mouseover', () => this.handleMouseOverCountry)
      .on('mouseout', this.handleMouseOutCountry)
      .on('click', this.handleClickCountry);
  }

  drawGraticule() {
    const graticule = d3.geoGraticule().step([10, 10]);

    this.svg.append('path')
      .datum(graticule)
      .attr('class', this.className.graticule)
      .attr('d', this.path);
  }
  
  render(containerElement, holderId, json) {
    this.containerElement = containerElement;

    // initialize
    this.createSvg(`#${holderId}`);
    this.calculatePath();
    this.initializeViewport();

    this.drawMap(json);
    this.drawGraticule();
    this.initializeZoom();
  }

  destroy() {
    const svgElement = this.containerElement.querySelector('svg');
    svgElement.parentElement.removeChild(svgElement);
  }
}

export default WorldMap
