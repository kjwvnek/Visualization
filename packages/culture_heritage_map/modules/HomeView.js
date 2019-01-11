import homeTemplate from '../templates/home.ejs'

function HomeView() {
  this.mapHolderEl = null;
  this.btnDetailMapEl = null;
}

HomeView.prototype.render = function(targetEl) {
  targetEl.innerHTML = homeTemplate();
  
  this.mapHolderEl = targetEl.querySelector('#map-holder');
  this.btnDetailMapEl = targetEl.querySelector('#btn-detail-map');
};

export default HomeView
