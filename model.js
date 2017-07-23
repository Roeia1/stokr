/**
 * Created by roeia on 23/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  let _stocksData;
  let _uiState;

  function initStocksData(uiState) {
    _uiState = uiState;
    _stocksData = [
      {
        "Symbol": "WIX",
        "Name": "Wix.com Ltd.",
        "Change": "0.750000",
        "PercentChange": "+1.51%",
        "LastTradePriceOnly": "76.099998"
      },
      {
        "Symbol": "MSFT",
        "Name": "Microsoft Corporation",
        "PercentChange": "-2.09%",
        "Change": "-0.850006",
        "LastTradePriceOnly": "69.620003"
      },
      {
        "Symbol": "YHOO",
        "Name": "Yahoo! Inc.",
        "Change": "0.279999",
        "PercentChange": "+1.11%",
        "LastTradePriceOnly": "50.599998"
      }
    ];

    addMovementData();
    addStockChangeDirectionData();
    addStockChangeDisplayData();
    addLastTradePriceOnlyDisplay();
  }

  function getStocks() {
    return _stocksData;
  }

  function getStockBySymbol(stockSymbol) {
    return _stocksData.find(currStockData => currStockData.Symbol === stockSymbol);
  }

  function moveStock(stock, direction) {
    if (_stocksData.indexOf(stock) > -1) {
      const stockPosition = _stocksData.indexOf(stock);
      const newStockPosition = direction === 'up' ? stockPosition - 1 : stockPosition + 1;
      _stocksData.splice(stockPosition, 1);
      _stocksData.splice(newStockPosition, 0, stock);
    }

    addMovementData();
  }

  function addMovementData() {
    _stocksData.forEach((stock, index) => {
      stock.canMoveUp = true;
      stock.canMoveDown = true;
      if (index === 0)
        stock.canMoveUp = false;
      if (index === _stocksData.length - 1)
        stock.canMoveDown = false;
    });
  }

  function addStockChangeDirectionData() {
    _stocksData.forEach(stock => {
      stock.positiveChange = isStockChangePositive(stock);
    });
  }

  function addStockChangeDisplayData() {
    _stocksData.forEach(stock => {
      stock.changeDisplay = getStockChangeDisplay(stock);
    });
  }

  function addLastTradePriceOnlyDisplay() {
    _stocksData.forEach(stock => {
      stock.lastTradePriceOnlyDisplay = parseFloat(stock.LastTradePriceOnly).toFixed(2);
    })
  }

  function isStockChangePositive(stockData) {
    return stockData.Change > 0;
  }

  function getStockChangeDisplay(stockData) {
    const stockChangeVal = stockData[_uiState.stockChangeDisplay];
    return stockChangeVal.indexOf('%') > -1 ? stockChangeVal : parseFloat(stockChangeVal).toFixed(2);
  }

  window.Stokr.Model = {
    initStocksData,
    getStocks,
    getStockBySymbol,
    moveStock,
    addStockChangeDisplayData
  }
})();
