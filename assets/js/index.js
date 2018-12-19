import '../scss/index.scss'
import './canvas_space'

// import Libraries
const Handlebars = require('./handlebars-v4.0.12');

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
    this.sectionTemplate = Handlebars.compile(document.getElementById('template-section').innerHTML);
  }
  
  moveToContainerPage() {
    this.wrapElement.classList.add('is-container-view');
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
  
  appView.btnStartElement.addEventListener('click', function(e) {
    e.preventDefault();
    appView.moveToContainerPage();
  });
  
  appView.renderSection(SECTIONS);
}());
