/**
 * Created by roeia on 18/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  const view = window.Stokr.View;

  const model = window.Stokr.Model;

  const serverURL = 'http://localhost:7000/';

  const getQuotesURL = serverURL + 'quotes?q=';

  // -------------Main-------------

  (() => {
    if (view.getHash() === '#search')
      view.renderSearchPage();
    else
      loadStocksPage();
  })();

  // ------ Public Functions --------

  function refreshStocks() {
    updateStocksData(model.getStocksSymbols())
      .then(() => {
        processStocksData(getStocksData());
        view.renderStocksPage(getStocksData(), model.getUIState());
      });
  }

  function handleHashChange() {
    if (view.getHash() === '#search')
      view.renderSearchPage();
    else
      view.renderStocksPage(getStocksData(), model.getUIState());
  }

  function moveStock(stockSymbol, direction) {
    const stocksData = model.getStocksData();
    const stocksSymbols = model.getStocksSymbols();
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
    view.renderStocksList(getStocksData(), model.getUIState());
    saveToStorage(stocksSymbols, model.getUIState());
  }

  function toggleStockChangeDisplay() {
    const uiState = model.getUIState();
    if (uiState.currentStockChangeDisplay < uiState.stockChangeDisplay.length - 1)
      uiState.currentStockChangeDisplay++;
    else
      uiState.currentStockChangeDisplay = 0;
    setStocksChangeDisplayData(getStocksData());
    view.renderStocksList(getStocksData(), model.getUIState());
    saveToStorage(model.getStocksSymbols(), uiState);
  }

  function toolbarFilterClick() {
    const uiState = model.getUIState();
    uiState.isSettingsOpen = false;
    uiState.isFilterOpen = !uiState.isFilterOpen;
    if (!uiState.isFilterOpen)
      uiState.filters = {};
    view.renderHeader(uiState);
    view.renderStocksList(getStocksData(), model.getUIState());
    saveToStorage(model.getStocksSymbols(), uiState);
  }

  function toolbarSettingsClick() {
    const uiState = model.getUIState();
    uiState.isFilterOpen = false;
    uiState.isSettingsOpen = !uiState.isSettingsOpen;
    view.renderHeader(uiState);
    view.renderStocksList(getStocksData(), model.getUIState());
    saveToStorage(model.getStocksSymbols(), uiState);
  }

  function setFilters(filters) {
    model.setFilters(filters);
    view.renderStocksList(getFilteredStocks(), model.getUIState());
    saveToStorage(model.getStocksSymbols(), model.getUIState());
  }

  function deleteStock(stockSymbol) {
    const stocksSymbols = model.getStocksSymbols();
    const stocksData = getStocksData();
    const stockData = getStockDataBySymbol(stockSymbol, stocksData);
    stocksSymbols.splice(stocksSymbols.indexOf(stockSymbol), 1);
    stocksData.splice(stocksData.indexOf(stockData), 1);
    view.renderStocksList(getStocksData(), model.getUIState());
    saveToStorage(model.getStocksSymbols(), model.getUIState());
  }

  // ------- Private Functions ----------

  function loadStocksPage() {
    loadAppData();
    refreshStocks();
  }

  function saveToStorage(stocksSymbols, uiState) {
    localStorage.setItem('StokrData', JSON.stringify({
      uiState,
      stocksSymbols
    }));
  }

  function loadAppData() {
    let stokrData = localStorage.getItem('StokrData');
    if (stokrData) {
      stokrData = JSON.parse(stokrData);
      model.setStocksSymbols(stokrData.stocksSymbols);
      model.setUIState(stokrData.uiState);
    } else {
      saveToStorage(model.getStocksSymbols(), model.getUIState());
    }
  }

  function updateStocksData(stocksSymbols) {
    return fetchStocksData(stocksSymbols)
      .then(res => {
        let stockArray = res.query.results.quote;
        if (stocksSymbols.length === 1)
          stockArray = [stockArray];
        model.setStocksData(stockArray);
      });
  }

  function fetchStocksData(stocksSymbols) {
    return fetch(getQuotesURL + stocksSymbols.join(','))
      .then(res => res.ok ? res.json() : Promise.reject('res not ok'));
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
    const uiState = model.getUIState();
    const stocksData = model.getStocksData();
    return stocksData.filter(stockData => {
      for (const [key, value] of Object.entries(uiState.filters)) {
        switch (key) {
          case 'name': {
            if (!stockData.Name.toLowerCase().includes(value.toLowerCase()))
              return false;
            break;
          }
          case 'gain': {
            break;
          }
          case 'rangeFrom': {
            if (stockData.LastTradePriceOnly < value)
              return false;
            break;
          }
          case 'rangeTo': {
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
    return stockData.Change >= 0;
  }

  function getStocksData() {
    const uiState = model.getUIState();
    if (uiState.isFilterOpen)
      return getFilteredStocks();
    return model.getStocksData();
  }

  window.Stokr.Ctrl = {
    moveStock,
    toggleStockChangeDisplay,
    toolbarFilterClick,
    refreshStocks,
    toolbarSettingsClick,
    deleteStock,
    setFilters,
    handleHashChange
  }

})();




