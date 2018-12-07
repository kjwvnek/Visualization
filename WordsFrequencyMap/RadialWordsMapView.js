class RadialWordsMapView {
  constructor(targetElement) {
    this.wordsData = null;
    this.wordElementsData = null;
    this.canvas = [];
    this.targetElement = targetElement;

    this.setCanvasSize();
  }

  setCanvasSize() {
    const width = Math.floor(this.targetElement.clinetWidth);
    const height = Math.floor(this.targetElement.clientHeight);

    for (let y = 0; y < height; y++) {
      
    }
  }

  render() {
    this.targetElement.innerHTML = '';

    this.renderAndCalculateData();
    this.positioningWordElements();
  }

  renderAndCalculateData() {
    const wrapElement = document.createElement('div');
    wrapElement.classList.add('analized-words-wrap');
    this.targetElement.appendChild(wrapElement);
    
    this.wordElementsData = this.wordsData.map(item => {
      const wordElement = document.createElement('span');
      wordElement.classList.add('analized-word');
      wordElement.classList.add('analized-word-level-' + item.level);
      wordElement.innerText = item.word;
      
      wrapElement.appendChild(wordElement);

      return {
        element: wordElement,
        width: wordElement.clientWidth,
        height: wordElement.clientHeight
      };
    });
  }

  positioningWordElements() {
    this.wordElementsData.forEach(({ element, width, height }, index) => {
      
    });
  }
}