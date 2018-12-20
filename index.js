import './index.scss'

// import Libraries
const Handlebars = require('./common/js/handlebars-v4.0.12.js');
const { CanvasSpace, Form, Line, Vector, Const } = require('./common/js/pt.min.js');

const SECTIONS = [
  {
    title: 'Data',
    icon: 'data',
    list: [
      { name: 'word frequency cloud', url: './word_frequency_cloud/index.html' },
      { name: 'travel risk map', url: './travel_risk_map/index.html', disabled: true }
    ]
  },
  {
    title: 'Algorithm',
    icon: 'algorithm',
    list: [
      { name: 'bubble sort', url: './bubble_sort/index.html' },
      { name: 'insertion sort', url: './insert_sort/index.html', disabled: true }
    ]
  }
];

class AppView {
  constructor() {
    this.wrapElement = document.getElementById('wrap');
    this.contentElement = document.getElementById('content');
    this.btnStartElement = document.getElementById('btn-start');
    this.ptElement = document.getElementById('pt');
    this.sectionTemplate = Handlebars.compile(document.getElementById('template-section').innerHTML);

    this.space = null;
  }
  
  moveToContainerPage() {
    this.wrapElement.classList.add('is-container-view');
  }

  renderSpace() {
    const colors = ['#FF3F8E', '#04C2C9', '#2E55C1'];

    this.space = new CanvasSpace('canvas', '#252934').display();

    let space = this.space;
    let form = new Form(space);
    let pts = [];
    let center = space.size.$divide(1.8);
    let angle = window.innerWidth * 0.5 * -1;
    let count = window.innerWidth * 0.05;
    count = count > 150 ? 150 : count;
    let line = new Line(0, angle).to(space.size.x, 0);
    let mouse = center.clone();
    let r = Math.min(space.size.x, space.size.y) * 1;

    for (let i = 0; i < count; i++) {
      let p = new Vector(Math.random()* r - Math.random() * r, Math.random() * r - Math.random() * r) ;
      p.moveBy(center).rotate2D(i * Math.PI / count, center);
      p.brightness = 0.1;
      pts.push(p);
    }

    space.add({
      animate: function() {
        for (let i = 0; i < pts.length; i++) {
          let pt = pts[i];

          pt.rotate2D(Const.one_degree / 20, center);
          form.stroke(false).fill(colors[i % 3]).point(pt, 1);

          let ln = new Line(pt).to(line.getPerpendicularFromPoint(pt));
          let opacity = Math.min(0.8, 1 - Math.abs(line.getDistanceFromPoint(pt)) / r);
          let distFromMouse = Math.abs(ln.getDistanceFromPoint(mouse));

          if (distFromMouse < 50) {
            if (pts[i].brightness < 0.3) pts[i].brightness += 0.015;
          } else {
            if (pts[i].brightness < 0.3) pts[i].brightness += 0.01;
          }

          let color = `rgba(255,255,255,${pts[i].brightness})`;
          form.stroke(color).fill(true).line(ln);
        }
      },
      onMouseAction: function(type, x, y) {
        if (type === 'move') {
          mouse.set(x, y);
        }
      },
      onTouchAction: function(type, x, y) {
        this.onMouseAction(type, x, y);
      }
    });

    space.bindMouse();
    space.play();
  }

  reRenderSpace() {
    this.space.removeAll();
    this.ptElement.innerHTML = '';
    this.renderSpace();
  }
  
  renderSection(sections) {
    sections.forEach(section => {
      section.list = section.list.map(item => {
        return {
          name: item.name,
          url: item.disabled ? 'javascript:void(0)' : item.url,
          className: item.disabled ? 'disabled': ''
        };
      });
      this.contentElement.innerHTML += this.sectionTemplate(section);
    });
  }
}

(function main() {
  const appView = new AppView();
  
  appView.renderSpace();
  appView.renderSection(SECTIONS);

  window.addEventListener('resize', function() {
    appView.reRenderSpace();
  });
  
  appView.btnStartElement.addEventListener('click', function(e) {
    e.preventDefault();
    appView.moveToContainerPage();
  });
}());
