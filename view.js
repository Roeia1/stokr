/**
 * Created by roeia on 23/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  let _state;

  function render(state) {
    _state = state;
    const stocksListPage = document.querySelector('[data-id=root]');
    stocksListPage.innerHTML =
      `
      ${getHeader() + getMain()}
    `;
  }

  function renderStocksList(state) {
    document.querySelector('.stocks-list').innerHTML = getStocks(_state.stocksData);
  }

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
        ${getStocksList(_state.stocksData)}
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
            ${stockData.lastTradePriceOnlyDisplay}
          </span>
          <button class="stock-change-button ${stockData.positiveChange ? 'positive-change' : 'negative-change'}">
            ${stockData.changeDisplay}
          </button>
          <span class="stock-arrows">
            <button class="icon-arrow up" data-type="arrow" data-direction="up" ${stockData.canMoveUp ? '' : 'disabled'}></button>
            <button class="icon-arrow down" data-type="arrow" data-direction="down" ${stockData.canMoveDown ? '' : 'disabled'}></button>
          </span>
        </span>
      </li>  
    `;
  }

  window.Stokr.View = {
    render,
    renderStocksList
  }
})();
