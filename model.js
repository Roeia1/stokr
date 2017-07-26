/**
 * Created by roeia on 23/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  const _state = {
      ui: {
        currentStockChangeDisplay: 0,
        stockChangeDisplay: ['Change', 'realtime_chg_percent', 'MarketCapitalization'],
        isFilterOpen: false,
        isSettingsOpen: false,
        filters: {}
      },
      stocksSymbols: [
        "WIX",
        "MSFT",
        "AAPL"
      ],
      stocksData: [],
      stocksSymbolData: []
    }
  ;

  function getStocksData() {
    return _state.stocksData;
  }

  function getStocksSymbols() {
    return _state.stocksSymbols;
  }

  function getUIState() {
    return _state.ui;
  }

  function getCurrentStockChangeDisplay() {
    return _state.ui.stockChangeDisplay[_state.ui.currentStockChangeDisplay];
  }

  function setStocksData(stocksData) {
    _state.stocksData = stocksData;
  }

  function setStocksSymbols(stocksSymbols) {
    _state.stocksSymbols = stocksSymbols;
  }

  function setUIState(UIState) {
    _state.ui = UIState;
  }

  function setFilters(filters) {
    _state.ui.filters = filters
  }

  window.Stokr.Model = {
    getStocksData,
    getStocksSymbols,
    getUIState,
    getCurrentStockChangeDisplay,
    setStocksData,
    setStocksSymbols,
    setUIState,
    setFilters
  }
})();
