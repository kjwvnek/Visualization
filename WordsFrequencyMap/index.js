class AppView {
  constructor() {
    this.textFieldElement = document.getElementById('text-field');
    this.resultElement = document.getElementById('result');
  }
}

class AppController {
  constructor() {
    this.appView = new AppView();
    this.radialWordsMapView = new RadialWordsMapView(this.appView.resultElement);
  }

  bindEvents() {
    const self = this;

    this.appView.textFieldElement.addEventListener('change', function(e) {
      const text = e.target.value;
      const frequencyMap = textToFrequencyMap(text, customFilter);

      self.radialWordsMapView.wordsData = frequencyMapToSortedArray(frequencyMap);
      self.radialWordsMapView.render();
    });
  }
}

(function() {
  const appController = new AppController();
  appController.bindEvents();
}())
