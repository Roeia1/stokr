/**
 * Created by roeia on 18/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  const _state = {
    ui: {
      "stockChangeDisplay": "PercentChange"
    },
    stocksData: []
  };

  // -------------Main-------------

  (() => {
    window.Stokr.Model.initStocksData(_state.ui);

    _state.stocksData = window.Stokr.Model.getStocks();

    window.Stokr.View.render(_state);

    const stocksList = document.querySelector('.stocks-list');

    stocksList.addEventListener('click', handleStockListClick);
  })();

  function handleStockListClick(e) {
    toggleStockChangeFormat(e);
    changeStockPosition(e);
  }

  function changeStockPosition(e) {
    if (e.target.dataset.type === 'arrow') {
      const stock = e.target.closest('li');
      const stockSymbol = stock.dataset.id;
      const stockData = window.Stokr.Model.getStockBySymbol(stockSymbol);
      window.Stokr.Model.moveStock(stockData, e.target.dataset.direction);
      window.Stokr.View.renderStocksList(_state);
    }
  }

  function toggleStockChangeFormat(e) {
    if (e.target.className.includes('stock-change-button')) {
      _state.ui.stockChangeDisplay = _state.ui.stockChangeDisplay === 'PercentChange' ? 'Change' : 'PercentChange';
      window.Stokr.Model.addStockChangeDisplayData();
      window.Stokr.View.renderStocksList(_state);
    }
  }

  window.Stokr.Controller = {}

})();




