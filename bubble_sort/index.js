(function() {
  const EXAMPLE = [
    [29, 10, 14, 37, 14],
    [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48],
    [43, 17, 62, 43, 102, 33],
    [1, 2, 3, 5, 4, 6, 8],
    [14, 7, 32, 34, 8, 9]
  ];
  
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
  });
  
  btnExampleElement.addEventListener('click', function() {
    const prevIndex = btnExampleElement.exampleIndex === undefined ? -1 : btnExampleElement.exampleIndex;
    let index = prevIndex;
    
    while (index === prevIndex) {
      index = Math.floor(Math.random() * EXAMPLE.length);
    }
    
    inputArrayElement.value = JSON.stringify(EXAMPLE[index]);
    btnStartElement.disabled = false;
    btnStartElement.click();
  });
  
  /* Visualized Array Class */
  class VisualizedArray {
    constructor(input) {
      this.input = input;
      this._element = null;
    }
    
    remove(targetElement) {
      targetElement.removeChild(this._element);
    }
    
    render(targetElement) {
      this.createElement();
      targetElement.appendChild(this._element);
    }
    
    createElement() {
      const wrapElement = document.createElement('div');
      wrapElement.classList.add('visualized-array');
      
      const width = (Math.floor(resultElement.clientWidth / this.input.length) - 8) + 'px';
      const maxMinValue = this.input.reduce((accumulator, value, index) => {
        if (index === 0) {
          return {
            max: value,
            min: value
          };
        } else {
          return {
            max: Math.max(accumulator.max, value),
            min: Math.min(accumulator.min, value)
          };
        }
      }, {});
      const heightUnit = (maxMinValue.max - maxMinValue.min);
      
      this.input.forEach(value => {
        const barElement = document.createElement('div');
        const valueElement = document.createElement('span');
        
        barElement.classList.add('array-bar');
        barElement.style.width = width;
        barElement.style.height = Math.floor(((value - maxMinValue.min) / heightUnit) * 70 + 25) + '%';
        valueElement.classList.add('array-value');
        valueElement.innerText = value;
        
        barElement.appendChild(valueElement);
        wrapElement.appendChild(barElement);
      });
      
      this._element = wrapElement
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
}());