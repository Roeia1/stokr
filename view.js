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
        <section class="top-header">
          <h1 class="logo">stokr</h1>
          <nav>
            <ul class="toolbar">
              <li><a href="" class="toolbar-button icon-search" data-type="search"></a></li>
              <li><button class="toolbar-button icon-refresh" data-type="refresh"></button></li>
              <li><button class="toolbar-button icon-filter" data-type="filter" style="color: ${_state.ui.isFilterOpen ? '#41bf15' : '#ababab'}"></button></li>
              <li><button class="toolbar-button icon-settings" data-type="settings"></button></li>
            </ul>
          </nav>
        </section>
        ${_state.ui.isFilterOpen ? getFilter() : ''}
      </header> 
    `;
  }

  function getFilter() {
    return `
      <section class="filter">
        <span class="filter-parameters">
          <label>by name<input type="text"></label>
          <label>by gain<input type="text"></label>
          <label>by range: from<input type="text"></label>
          <label>by range: to<input type="text"></label>
        </span>
        <span>
          apply
        </span>
      </section>
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
