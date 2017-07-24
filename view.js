/**
 * Created by roeia on 23/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  // ------- Render Functions --------

  function render(stocksData, uiState) {
    const stocksListPage = document.querySelector('[data-id=root]');

    stocksListPage.innerHTML =
      `
      ${getHeader(uiState) + getMain(stocksData)}
    `;

    addAllEvents();
  }

  function renderStocksList(stocksData, uiState) {
    document.querySelector('.stocks-list').innerHTML = getStocks(stocksData);

    addStocksListEvents();
  }

  // -------- Functions ---------

  function getHeader(uiState) {
    return `
      <header>
        <section class="top-header">
          <h1 class="logo">stokr</h1>
          <nav>
            <ul class="toolbar">
              <li><a href="" class="toolbar-button icon-search" data-type="search"></a></li>
              <li><button class="toolbar-button icon-refresh" data-type="refresh"></button></li>
              <li><button class="toolbar-button icon-filter" data-type="filter" style="color: ${uiState.isFilterOpen ? '#41bf15' : '#ababab'}"></button></li>
              <li><button class="toolbar-button icon-settings" data-type="settings"></button></li>
            </ul>
          </nav>
        </section>
        ${uiState.isFilterOpen ? getFilter() : ''}
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

  function getMain(stocksData) {
    return `
      <main>
        ${getStocksList(stocksData)}
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
    return stocksData.map((stockData, index) => getStock(stockData)).join('');
  }

  function getStock(stockData) {
    return `
      <li class="stock" data-symbol="${stockData.Symbol}">
        <span class="stock-text">
          ${stockData.Symbol} (${stockData.Name})
        </span>
        <span class="stock-stats">
          <span class="stock-last-price">
            ${stockData.lastTradePriceOnlyDisplay}
          </span>
          <button class="stock-change-display ${stockData.positiveChange ? 'positive-change' : 'negative-change'}" data-type="stockChangeDisplay">
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

  // ------------- Events -------------

  function addAllEvents() {
    addToolbarEvents();
    addStocksListEvents();
  }

  function addToolbarEvents() {
    const toolbar = document.querySelector('.toolbar');
    toolbar.addEventListener('click', toolbarClickHandler);
  }

  function addStocksListEvents() {
    const stocksList = document.querySelector('.stocks-list');
    stocksList.addEventListener('click', stocksListClickHandler);
  }

  function toolbarClickHandler(e) {
    switch (e.target.dataset.type) {
      case 'search': {
        break;
      }
      case 'refresh': {
        break;
      }
      case 'filter': {

        break;
      }
      case 'settings': {
        break;
      }
    }
  }

  function stocksListClickHandler(e) {
    switch (e.target.dataset.type) {
      case 'arrow': {
        const stock = e.target.closest('li');
        const stockSymbol = stock.dataset.symbol;
        window.Stokr.Ctrl.moveStock(stockSymbol, e.target.dataset.direction);
        break;
      }
      case 'stockChangeDisplay': {
        window.Stokr.Ctrl.toggleStockChangeDisplay();
        break;
      }
    }
  }

  window.Stokr.View = {
    render,
    renderStocksList
  }
})();
