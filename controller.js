/**
 * Created by roeia on 18/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  const view = window.Stokr.View;

  const model = window.Stokr.Model;

  // -------------Main-------------

  (() => {
    initStocksData();

    const state = model.getState();

    view.render(state.stocksData, state.ui);
  })();

  // ------ Public Functions --------

  function moveStock(stockSymbol, direction) {
    const state = model.getState();
    const stockData = getStockDataBySymbol(stockSymbol, state.stocksData);
    if (state.stocksData.indexOf(stockData) > -1) {
      const stockPosition = state.stocksData.indexOf(stockData);
      const newStockPosition = direction === 'up' ? stockPosition - 1 : stockPosition + 1;
      state.stocksData.splice(stockPosition, 1);
      state.stocksData.splice(newStockPosition, 0, stockData);
    }
    setStocksMovementData(state.stocksData);
    view.renderStocksList(state.stocksData, state.ui);
  }

  function toggleStockChangeDisplay() {
    const state = model.getState();
    if (state.ui.currentStockChangeDisplay < state.ui.stockChangeDisplay.length - 1)
      state.ui.currentStockChangeDisplay++;
    else
      state.ui.currentStockChangeDisplay = 0;
    setStocksChangeDisplayData(state.stocksData);
    view.renderStocksList(state.stocksData, state.ui)
  }

  function toolbarFilterClick() {
    const state = model.getState();
    state.ui.isFilterOpen = !state.ui.isFilterOpen;
    view.renderHeader(state.ui);
    view.renderStocksList(state.stocksData, state.ui)
  }

  // ------- Private Functions ----------

  function initStocksData() {
    const state = model.getState();
    setStocksMovementData(state.stocksData);
    setStocksChangeDirectionData(state.stocksData);
    setStocksChangeDisplayData(state.stocksData);
    setStocksLastTradePriceOnlyDisplayData(state.stocksData);
  }

  function setStocksMovementData(stocksData) {
    stocksData.forEach((stock, index) => {
      stock.canMoveUp = true;
      stock.canMoveDown = true;
      if (index === 0)
        stock.canMoveUp = false;
      if (index === stocksData.length - 1)
        stock.canMoveDown = false;
    });
  }

  function setStocksChangeDirectionData(stocksData) {
    stocksData.forEach(stock => {
      stock.positiveChange = isStockChangePositive(stock);
    });
  }

  function setStocksChangeDisplayData(stocksData) {
    stocksData.forEach(stock => {
      stock.changeDisplay = getStockChangeDisplayData(stock);
    });
  }

  function setStocksLastTradePriceOnlyDisplayData(stocksData) {
    stocksData.forEach(stock => {
      stock.lastTradePriceOnlyDisplay = parseFloat(stock.LastTradePriceOnly).toFixed(2);
    })
  }

  // -------- Utilities ----------

  function getStockChangeDisplayData(stockData) {
    const state = model.getState();
    const currentStockChangeDisplay = state.ui.stockChangeDisplay[state.ui.currentStockChangeDisplay];
    const stockChangeDisplayData = stockData[currentStockChangeDisplay];
    return stockChangeDisplayData.indexOf('%') > -1 ? stockChangeDisplayData : parseFloat(stockChangeDisplayData).toFixed(2);
  }

  function getStockDataBySymbol(stockSymbol, stocksData) {
    return stocksData.find(currStockData => currStockData.Symbol === stockSymbol);
  }

  function isStockChangePositive(stockData) {
    return stockData.Change > 0;
  }

  window.Stokr.Ctrl = {
    moveStock,
    toggleStockChangeDisplay,
    toolbarFilterClick
  }

})();




