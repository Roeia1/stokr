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

    view.render(getStocksData(), getStateUI());
  })();

  // ------ Public Functions --------

  function moveStock(stockSymbol, direction) {
    const stockData = getStockDataBySymbol(stockSymbol, getStocksData());
    if (getStocksData().indexOf(stockData) > -1) {
      const stockPosition = getStocksData().indexOf(stockData);
      const newStockPosition = direction === 'up' ? stockPosition - 1 : stockPosition + 1;
      getStocksData().splice(stockPosition, 1);
      getStocksData().splice(newStockPosition, 0, stockData);
    }
    setStocksMovementData(getStocksData());
    view.renderStocksList(getStocksData(), getStateUI());
  }

  function toggleStockChangeDisplay() {
    if (getStateUI().currentStockChangeDisplay < getStateUI().stockChangeDisplay.length - 1)
      getStateUI().currentStockChangeDisplay++;
    else
      getStateUI().currentStockChangeDisplay = 0;
    setStocksChangeDisplayData(getStocksData());
    view.renderStocksList(getStocksData(), getStateUI())
  }

  function toolbarFilterClick() {
    getStateUI().isFilterOpen = !getStateUI().isFilterOpen;
    if (!getStateUI().isFilterOpen)
      getStateUI().filters = {};
    view.renderHeader(getStateUI());
    view.renderStocksList(getStocksData(), getStateUI())
  }

  function setFilters(filterParameters) {
    getStateUI().filters = filterParameters;
    view.renderStocksList(getStocksData(), getStateUI());
  }

  // ------- Private Functions ----------

  function initStocksData() {
    setStocksMovementData(getStocksData());
    setStocksChangeDirectionData(getStocksData());
    setStocksChangeDisplayData(getStocksData());
    setStocksLastTradePriceOnlyDisplayData(getStocksData());
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

  function getFilteredStocks(stocksData, filterParameters) {
    return stocksData.filter(stockData => {
      for (const [key, value] of Object.entries(filterParameters)) {
        switch (key) {
          case 'name': {
            if (!stockData.Name.toLowerCase().includes(value.toLowerCase()))
              return false;
            break;
          }
          case 'gain': {
            break;
          }
          case 'range-from': {
            if (stockData.LastTradePriceOnly < value)
              return false;
            break;
          }
          case 'range-to': {
            if (stockData.LastTradePriceOnly > value)
              return false;
            break;
          }
        }
      }
      return true;
    });
  }

  // -------- Utilities ----------

  function getStockChangeDisplayData(stockData) {
    const currentStockChangeDisplay = getStateUI().stockChangeDisplay[getStateUI().currentStockChangeDisplay];
    const stockChangeDisplayData = stockData[currentStockChangeDisplay];
    return stockChangeDisplayData.indexOf('%') > -1 ? stockChangeDisplayData : parseFloat(stockChangeDisplayData).toFixed(2);
  }

  function getStockDataBySymbol(stockSymbol, stocksData) {
    return stocksData.find(currStockData => currStockData.Symbol === stockSymbol);
  }

  function isStockChangePositive(stockData) {
    return stockData.Change > 0;
  }

  function getStocksData() {
    const state = model.getState();
    if (state.ui.isFilterOpen) {
      return getFilteredStocks(state.stocksData, state.ui.filters);
    } else {
      return state.stocksData;
    }
  }

  function getStateUI() {
    return model.getState().ui;
  }

  window.Stokr.Ctrl = {
    moveStock,
    toggleStockChangeDisplay,
    toolbarFilterClick,
    setFilters
  }

})();




