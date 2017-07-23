/**
 * Created by roeia on 23/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  const stocksData = [
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

  function getStocks() {
    return stocksData;
  }

  function getStockBySymbol(stockSymbol) {
    return stocksData.find(currStockData => currStockData.Symbol === stockSymbol);
  }

  function moveStock(stock, direction) {
    if (stocksData.contains(stock)) {
      const stockPosition = stocksData.indexOf(stock);
      const newStockPosition = direction === 'up' ? stockPosition - 1 : stockPosition + 1;
      stocksData.splice(stockPosition, 1);
      stocksData.splice(newStockPosition, 0, stock);
    }
  }

  window.Stokr.Model = {
    getStocks,
    getStockBySymbol,
    moveStock
  }
})();
