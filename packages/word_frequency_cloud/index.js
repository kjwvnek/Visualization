import '@/common/js/d3.v3.min.js'
import cloud from './layout.cloud'
import './index.scss'

const customFilter = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 
  'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 
  'q', 'r', 's', 't', 'u', 'v', 'w', 
  'x', 'y', 'z',
  'of',
  'or',
  'and',
  'only',
  'as',
  'by',
  'is',
  'be',
  'to',
  'the',
  'an',
  'but',
  'for',
  'in',
  'on',
  'at',
  'because',
  'could',
  'from',
  'would',
  'with',
  'was',
  'were'
];

const LEVEL = {
  1: { fontSize: 12, color: '#AAAAAA' },
  2: { fontSize: 18, color: '#B47805' },
  3: { fontSize: 24, color: '#B54803' },
  4: { fontSize: 30, color: '#99150F' },
  5: { fontSize: 36, color: '#480714' },
  6: { fontSize: 42, color: '#888888' },
  7: { fontSize: 48, color: '#B47805' },
  8: { fontSize: 54, color: '#B54803' },
  9: { fontSize: 60, color: '#99150F' },
  10: { fontSize: 66, color: '#480714' }
};

(function() {
  class WordsModel {
    constructor(text, customFilter) {
      this.text = text;
      this.customFilter = customFilter || [];
      this.frequencyMap = this.textToFrequencyMap();
      this.sortedArray = this.frequencyMapToSortedArray();
    }

    textToFrequencyMap() {
      const result = {};
    
      this.text.split(' ').forEach(splitedText => {
        this.wordToFilteredWordsArray(splitedText).forEach(word => {
          if (!word || this.customFilter.indexOf(word.toLowerCase()) !== -1) {
            return;
          }
    
          if (result[word]) {
            result[word]++;
          } else if (word) {
            result[word] = 1;
          }
        });
      });
    
      return result;
    }

    frequencyMapToSortedArray() {
      const map = this.frequencyMap;
      const result = [];
      const wordsArray = Object.keys(map);
      const maxFrequency = Object.values(map).reduce((maxFrequency, frequency) => (frequency > maxFrequency ? frequency : maxFrequency), 0);
      const levelUnit = maxFrequency / Object.keys(LEVEL).length;
    
      for (let i = 0; i < wordsArray.length; i++) {
        if (result.length >= 100) {
          break;
        }
    
        const item = {
          word: wordsArray[i],
          frequency: map[wordsArray[i]],
          level: null,
          size: null,
          color: null
        };
    
        item.level = Math.round(item.frequency / levelUnit);
        item.size = LEVEL[item.level].fontSize;
        item.color = LEVEL[item.level].color;
    
        if (i === 0) {
          result.push(item);
        } else {
          for (let j = 0; j < result.length; j++) {
            if (result[j].frequency > item.frequency) {
              continue;
            } else {
              result.splice(j, 0, item);
              break;
            }
          }
        }
      }
    
      return result;
    }

    wordToFilteredWordsArray(word) {
      let filteredWord = word.replace(/[^A-Za-z]+/g, ' ').trim();
    
      return filteredWord.split(' ');
    }
  }

  class View {
    constructor() {
      this.popupElement = document.getElementById('popup-field');
      this.resultElement = document.getElementById('result');
      this.btnPopupElement = document.getElementById('btn-popup');
      this.btnRenderElement = document.getElementById('btn-render');
      this.textFieldElement = document.getElementById('text-field');
      this.svgElement = null;
    }

    renderWordsCloud(wordsArray) {
      this.resultElement.innerHTML = '';

      const width = Math.floor(this.resultElement.clientWidth);
      const height = Math.floor(this.resultElement.clientHeight);

      this.svgElement = d3.select('#result')
        .append('svg').attr('width', width).attr('height', height)
        .append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

      const layout = cloud()
        .size([width, height])
        .words(wordsArray)
        .padding(7)
        .fontSize(d => d.size)
        .on('end', this.draw.bind(this));

      layout.start();
    }

    draw(data) {
      const cloud = this.svgElement.selectAll('text').data(data);

      cloud.enter()
        .append('text')
        .style('font-family', 'Inconsolata')
        .style('fill', d => d.color)
        .style('fill-opacity', .5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 3)
        .text(d => d.word);

      cloud.transition()
        .duration(600)
        .style('font-size', d => `${d.size}px`)
        .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
        .style('fill-opacity', 1);
    }
  }
  
  class Controller {
    constructor() {
      this.view = new View();
    }

    start() {
      this.bindEvents();
    }
  
    bindEvents() {
      const self = this;
  
      this.view.btnPopupElement.addEventListener('click', function(e) {
        let buttonElement = e.currentTarget;
        
        if (buttonElement.interval) {
          window.clearInterval(buttonElement.interval);
          buttonElement.interval = null;
        }

        if (self.view.popupElement.classList.contains('is-shown')) {
          self.view.popupElement.classList.remove('is-shown');
          buttonElement.interval = setTimeout(() => {
            self.view.popupElement.style.zIndex = -1;
          }, 500);
        } else {
          self.view.popupElement.style.zIndex = 100;
          self.view.popupElement.classList.add('is-shown');
        }
      });

      this.view.btnRenderElement.addEventListener('click', function() {
        self.view.btnPopupElement.click();

        const text = self.view.textFieldElement.value;
        const words = new WordsModel(text, customFilter);

        self.view.renderWordsCloud(words.sortedArray);
      });
    }
  }

  const controller = new Controller();
  controller.start();
}())
