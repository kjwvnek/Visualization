(function() {
  const EXAMPLE = [
    [29, 10, 14, 37, 14],
    [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48],
    [43, 17, 62, 43, 102, 33],
    [1, 2, 3, 5, 4, 6, 8],
    [14, 7, 32, 34, 8, 9]
  ];

  const STEP_FOCUS = 'STEP_FOCUS';
  const STEP_BLUR = 'STEP_BLUR';
  const STEP_SWAP = 'STEP_SWAP';
  const STEP_FIX = 'STEP_FIX';
  const SWAP_DELAY = 500;
  const COLOR_DELAY = 400;

  const inputArrayElement = document.getElementById('input-array');
  const btnStartElement = document.getElementById('btn-start');
  const btnExampleElement = document.getElementById('btn-example');
  const resultElement = document.getElementById('result');
  let visualizedArray = null;
  
  /* Bind Events */
  inputArrayElement.addEventListener('keyup', function(e) {
    const isValidInput = validateInput(e.target.value);
    
    btnStartElement.disabled = !isValidInput;
  });
  
  btnStartElement.addEventListener('click', function() {
    if (visualizedArray) {
      visualizedArray.remove(resultElement);
    }
    
    visualizedArray = new VisualizedArray(stringToArray(inputArrayElement.value));
    visualizedArray.render(resultElement);

    let animationQueue = bubbleSorting(visualizedArray._input);
    animateAsync(animationQueue);
  });
  
  btnExampleElement.addEventListener('click', function() {
    const prevIndex = btnExampleElement.exampleIndex === undefined ? -1 : btnExampleElement.exampleIndex;
    let index = prevIndex;
    
    while (index === prevIndex) {
      index = Math.floor(Math.random() * EXAMPLE.length);
    }

    btnExampleElement.exampleIndex = index;

    inputArrayElement.value = JSON.stringify(EXAMPLE[index]);
    btnStartElement.disabled = false;
    btnStartElement.click();
  });
  
  /* Visualized Array Class */
  class VisualizedArray {
    constructor(input) {
      this.barMaxWidth = 32;
      this.barGapSize = 7;
      this.defaultBarColor = '#bbb';
      this.focusedBarColor = '#04c2c9';
      this.fixedBarColor = '#fada5e';
      this.colorDelay = COLOR_DELAY / 1000;
      this.swapDelay = SWAP_DELAY / 1000;
      this.wrapElementStyle = {
        position: 'relative',
        height: '100%',
        textAlign: 'center'
      };
      this.barElementStyle = {
        position: 'absolute',
        bottom: '0',
        borderRadius: '4px 4px 0 0',
        backgroundColor: this.defaultBarColor,
        transition: 'transform ' +  this.swapDelay + 's ease-in-out, background-color ' + this.colorDelay + 's ease-in-out'
      };
      this.valueElementStyle = {
        position: 'absolute',
        top: '5px',
        left: '50%',
        transform: 'translateX(-50%)'
      };
      this._input = input;
      this._element = null;
      this._barElements = [];
      this._barWidth = 0;
    }
    
    remove(targetElement) {
      targetElement.removeChild(this._element);
    }
    
    render(targetElement) {
      this.createElement();
      this.positionElement();
      targetElement.appendChild(this._element);
    }
    
    createElement() {
      const wrapElement = document.createElement('div');
      setInlineStyle(wrapElement, this.wrapElementStyle);
      
      let width = (Math.floor(resultElement.clientWidth / this._input.length) - this.barGapSize - 2);
      this._barWidth = width = width > this.barMaxWidth ? this.barMaxWidth : width;
      let maxMinValue = this._input.reduce((accumulator, value, index) => (index === 0 ? {
          max: value,
          min: value
        } : {
          max: Math.max(accumulator.max, value),
          min: Math.min(accumulator.min, value)
      }), {});
      let heightUnit = (maxMinValue.max - maxMinValue.min) / 70;
      let fullWidth = width * this._input.length + this.barGapSize * (this._input.length - 1);
      let startPositionLeft = Math.round((resultElement.clientWidth - fullWidth) / 2);
      
      this._input.forEach((value) => {
        const barElement = document.createElement('div');
        const valueElement = document.createElement('span');
        
        setInlineStyle(barElement, _.assign({}, this.barElementStyle, {
          width: width + 'px',
          height: Math.floor(((value - maxMinValue.min) / heightUnit) + 25) + '%',
          left: startPositionLeft + 'px'
        }));
        setInlineStyle(valueElement, this.valueElementStyle);
        valueElement.innerText = value;
        
        barElement.appendChild(valueElement);
        wrapElement.appendChild(barElement);

        this._barElements.push(barElement);
      });
      
      this._element = wrapElement;
    }

    positionElement() {
      this._barElements.forEach((barElement, index) => {
        let position = index * (this._barWidth + this.barGapSize);

        barElement.style.transform = 'translateX(' + position + 'px)';
      });
    }

    focus(indexArray) {
      indexArray.forEach(index => {
        this._barElements[index].style.backgroundColor = this.focusedBarColor;
      })
    }

    blur(indexArray) {
      indexArray.forEach(index => {
        this._barElements[index].style.backgroundColor = this.defaultBarColor;
      });
    }

    fix(index) {
      this._barElements[index].style.backgroundColor = this.fixedBarColor;
    }

    swap(left, right) {
      let leftElement = this._barElements[left];
      let rightElement = this._barElements[right];

      this._barElements.splice(left, 1, rightElement);
      this._barElements.splice(right, 1, leftElement);
      this.positionElement();
    }
  }
  
  /* Util Function */
  function validateInput(input) {
    const value = input.trim();
    
    return value[0] === '[' && value[value.length - 1] === ']' && !value.match(/[^0-9\,\[\]\s']/);
  }
  
  function stringToArray(str) {
    let string = str.replace(/\s/g, '');
    string = string.substring(1, string.length - 1);
    
    let array = string.split(',');
    return array.filter(element => (element !== undefined && element !== '')).map(element => Number(element));
  }

  function setInlineStyle(element, styles) {
    Object.keys(styles).forEach(styleName => {
      element.style[styleName]  = styles[styleName];
    });
  }

  function sleep(callback, ms) {
    return new Promise(resolve => {
      setTimeout(() => { resolve(callback && callback()) }, ms);
    });
  }

  function bubbleSorting(array) {
    const queue = [];
    let n = 0;

    while (n < array.length) {
      for (let i = 0; i < array.length - n - 1; i++) {
        queue.push({
          step: STEP_FOCUS,
          indexArray: [ i, i + 1 ],
          delay: COLOR_DELAY
        });

        let left = array[i];
        let right = array[i + 1];
        if (left > right) {
          array[i] = right;
          array[i + 1] = left;
          queue.push({
            step: STEP_SWAP,
            indexArray: [ i, i + 1 ],
            delay: SWAP_DELAY
          });
        }

        queue.push({
          step: STEP_BLUR,
          indexArray: [ i, i + 1 ],
          delay: COLOR_DELAY
        });
      }

      queue.push({
        step: STEP_FIX,
        indexArray: [ array.length - n - 1 ],
        delay: COLOR_DELAY
      });
      n++;
    }

    return queue;
  }

  async function animateAsync(queue) {
    while (queue.length > 0) {
      let spec = queue.shift();

      animationHandler(spec);
      await sleep(null, spec.delay + 10);
    }
  }

  async function animationHandler({step, indexArray}) {
    switch(step) {
      case STEP_FOCUS:
        visualizedArray.focus(indexArray);
        break;
      case STEP_BLUR:
        visualizedArray.blur(indexArray);
        break;
      case STEP_SWAP:
        visualizedArray.swap(indexArray[0], indexArray[1]);
        break;
      case STEP_FIX:
        visualizedArray.fix(indexArray[0]);
        break;
      default:
        console.error('invalid step');
    }
    return;
  }
}());
