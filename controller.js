/**
 * Created by roeia on 18/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  const view = window.Stokr.View;

  const model = window.Stokr.Model;

  const uiState = model.getUIState();

  const stocksData = model.getStocksData();

  const stocksSymbols = model.getStocksSymbols();

  const serverURL = 'http://localhost:7000/';

  const getQuotesURL = serverURL + 'quotes?q=';

  // -------------Main-------------

  (() => {
    if (view.getHash() === '#search')
      view.renderSearchPage();
    else
      initStocksData(stocksSymbols)
        .then(() => {
          processStocksData(stocksData);

          view.renderStocksPage(stocksData, uiState);
        });
  })();

  // ------ Public Functions --------

  function handleHashChange() {
    if (view.getHash() === '#search')
      view.renderSearchPage();
    else
      view.renderStocksPage(stocksData, uiState);
  }

  function moveStock(stockSymbol, direction) {
    const stockData = getStockDataBySymbol(stockSymbol, stocksData);
    if (stocksData.indexOf(stockData) > -1) {
      const stockPosition = stocksData.indexOf(stockData);
      const newStockPosition = direction === 'up' ? stockPosition - 1 : stockPosition + 1;
      stocksData.splice(stockPosition, 1);
      stocksData.splice(newStockPosition, 0, stockData);
      stocksSymbols.splice(stockPosition, 1);
      stocksSymbols.splice(newStockPosition, 0, stockSymbol);
    }
    setStocksMovementData(stocksData);
    renderStocksList();
  }

  function toggleStockChangeDisplay() {
    if (uiState.currentStockChangeDisplay < uiState.stockChangeDisplay.length - 1)
      uiState.currentStockChangeDisplay++;
    else
      uiState.currentStockChangeDisplay = 0;
    setStocksChangeDisplayData(stocksData);
    renderStocksList();
  }

  function toolbarFilterClick() {
    uiState.isFilterOpen = !uiState.isFilterOpen;
    if (!uiState.isFilterOpen)
      uiState.filters = {};
    view.renderHeader(uiState);
    renderStocksList();
  }

  function setFilters(filterParameters) {
    uiState.filters = filterParameters;
    renderStocksList();
  }

  // ------- Private Functions ----------

  function renderStocksList() {
    view.renderStocksList(getStocksData(), uiState);
  }

  function initStocksData(stocksSymbols) {
    return Promise.all(stocksSymbols.map(symbol => fetchStockData(symbol)));
  }

  function fetchStockData(stockSymbol) {
    return fetch(getQuotesURL + stockSymbol)
      .then(res => res.ok ? res.json() : Promise.reject('res not ok'))
      .then(res => stocksData.push(res.query.results.quote));
  }

  function processStocksData(stocksData) {
    setStocksMovementData(stocksData);
    setStocksChangeDirectionData(stocksData);
    setStocksChangeDisplayData(stocksData);
    setStocksLastTradePriceOnlyDisplayData(stocksData);
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

  function getFilteredStocks() {
    const filterCheck = {
      name: (stockData, value) => {
        return !stockData.Name.toLowerCase().includes(value.toLowerCase());
      },
      gain: (stockData, value) => {
        return true;
      },
      rangeFrom: (stockData, value) => {
        return stockData.LastTradePriceOnly < value;
      },
      rangeTo: (stockData, value) => {
        return stockData.LastTradePriceOnly > value;
      }
    };
    return stocksData.filter(stockData => {
      for (const [key, value] of Object.entries(uiState.filters)) {
        if (filterCheck[key])
          if (!filterCheck[key](stockData, value));
        return false;
      }
      return true;
    });
  }

  // -------- Utilities ----------

  function getStockChangeDisplayData(stockData) {
    const currentStockChangeDisplay = model.getCurrentStockChangeDisplay();
    let stockChangeDisplayData = parseFloat(stockData[currentStockChangeDisplay]).toFixed(2);
    switch (currentStockChangeDisplay) {
      case 'realtime_chg_percent': {
        stockChangeDisplayData += '%';
        break;
      }
      case 'MarketCapitalization': {
        stockChangeDisplayData += 'B';
        break;
      }
    }
    return stockChangeDisplayData;
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

  window.Stokr.Ctrl = {
    moveStock,
    toggleStockChangeDisplay,
    toolbarFilterClick,
    setFilters,
    handleHashChange
  }

})();




