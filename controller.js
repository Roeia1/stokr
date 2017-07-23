/**
 * Created by roeia on 18/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  const state = {
    ui: {
      "stockChange": "PercentChange"
    },
    stocksData: [
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
    ]
  };

  // -------------Main-------------

  (() => {
    const stocksListPage = document.querySelector('[data-id=root]');
    stocksListPage.innerHTML =
      `
      ${getHeader() + getMain()}
    `;

    const stocksList = document.querySelector('.stocks-list');

    stocksList.addEventListener('click', handleStockListClick);
  })();

  // -----------Functions-----------

  function getHeader() {
    return `
    <header>
      <h1 class="logo">stokr</h1>
    <nav>
      <ul class="header-list">
        <li><a href="" class="header-button icon-search"></a></li>
        <li><button class="header-button icon-refresh"></button></li>
        <li><button class="header-button icon-filter"></button></li>
        <li><button class="header-button icon-settings"></button></li>
      </ul>
    </nav>
    </header>
  `;
  }

  function getMain() {
    return `
    <main>
      ${getStocksList(state.stocksData)}
    </main> 
  `;
  }

  function getStocksList(stocksData) {
    return `
    <ul class="stocks-list">
      ${getStocks(stocksData)}
    </ul>
  `;
  }

  function getStocks(stocksData) {
    return stocksData.map((stockData, index) => getStock(stockData, index)).join('');
  }

  function getStock(stockData, index) {
    return `
    <li class="stock" data-id="${stockData.Symbol}">
      <span class="stock-text">
        ${stockData.Symbol} (${stockData.Name})
      </span>
      <span class="stock-stats">
        <span class="stock-last-price">
          ${parseFloat(stockData.LastTradePriceOnly).toFixed(2)}
        </span>
        <button class="stock-change-button ${getStockChangeDirection(stockData)}">
          ${getStockChange(stockData)}
        </button>
        <span class="stock-arrows">
          <button class="icon-arrow up" data-type="arrow" data-direction="up" ${checkArrowDisabled(index, 'up')}></button>
          <button class="icon-arrow down" data-type="arrow" data-direction="down" ${checkArrowDisabled(index, 'down')}></button>
        </span>
      </span>
    </li>  
  `;
  }

  // -----------Events---------------

  function handleStockListClick(e) {
    toggleStockChangeFormat(e);
    changeStockPosition(e);
  }

  function changeStockPosition(e) {
    if (e.target.dataset.type === 'arrow') {
      // Deleting the Stock in Data and render only the stocks-list
      const stock = e.target.closest('li');
      const stockSymbol = stock.dataset.id;
      const stockData = getStockData(stockSymbol);
      const stockPosition = state.stocksData.indexOf(stockData);
      const newStockPosition = e.target.dataset.direction === 'up' ? stockPosition - 1 : stockPosition + 1;
      state.stocksData.splice(stockPosition, 1);
      state.stocksData.splice(newStockPosition, 0, stockData);
      e.currentTarget.innerHTML = getStocks(state.stocksData);
    }
  }

  function toggleStockChangeFormat(e) {
    if (e.target.className.includes('stock-change-button')) {
      state.ui.stockChange = state.ui.stockChange === 'PercentChange' ? 'Change' : 'PercentChange';

      document.querySelectorAll('.stock').forEach(stock => {
        const stockData = getStockData(stock.dataset.id);
        stock.querySelector('.stock-change-button').textContent = getStockChange(stockData);
      });
    }
  }

  // -------------Utilities------------

  function getStockChangeDirection(stockData) {
    return stockData.Change > 0 ? 'positive-change' : 'negative-change';
  }

  function getStockChange(stockData) {
    const stockChangeVal = stockData[state.ui.stockChange];
    return stockChangeVal.indexOf('%') > -1 ? stockChangeVal : parseFloat(stockChangeVal).toFixed(2);
  }

  function checkArrowDisabled(index, arrowDirection) {
    let disabled = false;
    switch (arrowDirection) {
      case 'up':
        if (index === 0)
          disabled = true;
        break;
      case 'down':
        if (index === state.stocksData.length - 1)
          disabled = true;
        break;
      default:
        break;
    }
    return disabled === true ? 'disabled' : '';
  }

})();




