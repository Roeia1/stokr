/**
 * Created by roeia on 23/07/2017.
 */
(() => {
  'use strict';

  window.Stokr = window.Stokr || {};

  // ------- Render Functions --------

  function renderStocksPage(stocksData, uiState) {
    document.querySelector('[data-id=root]').innerHTML =
      `
      ${getHeader(uiState) + getMain(stocksData, uiState)}
    `;

    addAllEvents(uiState);
  }

  function renderStocksList(stocksData, uiState) {
    document.querySelector('.stocks-list').outerHTML = getStocksList(stocksData, uiState);
    addStocksListEvents();
  }

  function renderHeader(uiState) {
    document.querySelector('header').outerHTML = getHeader(uiState);
    addToolbarEvents();
    if (uiState.isFilterOpen)
      addFilterEvents(uiState);
  }

  function renderSearchPage() {
    document.querySelector('[data-id=root]').innerHTML = `
      <a href="#">click back</a>
    `;
  }

  // -------- Functions ---------

  function getHeader(uiState) {
    return `
      <header>
        <section class="top-header">
          <h1 class="logo">stokr</h1>
          <nav>
            <ul class="toolbar">
              <li><a href="#search" class="toolbar-button icon-search" data-type="search"></a></li>
              <li><button class="toolbar-button icon-refresh" data-type="refresh"></button></li>
              <li><button class="toolbar-button icon-filter" data-type="filter" style="color: ${uiState.isFilterOpen ? '#41bf15' : '#ababab'}"></button></li>
              <li><button class="toolbar-button icon-settings" data-type="settings" style="color: ${uiState.isSettingsOpen ? '#41bf15' : '#ababab'}"></button></li>
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
          <label id="name">by name<input type="text"></label>
          <label id="gain">by gain<input type="text"></label>
          <label id="rangeFrom">by range: from<input type="text"></label>
          <label id="rangeTo">by range: to<input type="text"></label>
        </span>
        <button>
          apply
        </button>
      </section>
    `;
  }

  function getMain(stocksData, uiState) {
    return `
      <main>
        ${getStocksList(stocksData, uiState)}
      </main> 
    `;
  }

  function getStocksList(stocksData, uiState) {
    return `
      <ul class="stocks-list">
        ${getStocks(stocksData, uiState)}
      </ul>
    `;
  }

  function getStocks(stocksData, uiState) {
    return stocksData.map((stockData, index) => getStock(stockData, uiState)).join('');
  }

  function getStock(stockData, uiState) {
    return `
      <li class="stock" data-symbol="${stockData.Symbol}">
        <span class="stock-delete-and-text">
          ${uiState.isSettingsOpen ? getStockDeleteButton() : ''}
          <span class="stock-text">
            ${stockData.Symbol} (${stockData.Name})
          </span>
        </span>
        <span class="stock-stats">
          <span class="stock-last-price">
            ${stockData.lastTradePriceOnlyDisplay}
          </span>
          <button class="stock-change-display ${stockData.positiveChange ? 'positive-change' : 'negative-change'}" data-type="stockChangeDisplay">
            ${stockData.changeDisplay}
          </button>
          ${!uiState.isFilterOpen ? getStockArrows(stockData) : ''}
        </span>
      </li>  
    `;
  }

  function getStockArrows(stockData) {
    return `
      <span class="stock-arrows">
        <button class="icon-arrow up" data-type="arrow" data-direction="up" ${stockData.canMoveUp ? '' : 'disabled'}></button>
        <button class="icon-arrow down" data-type="arrow" data-direction="down" ${stockData.canMoveDown ? '' : 'disabled'}></button>
      </span>
    `;
  }

  function getStockDeleteButton() {
    return `
        <button class="delete-stock"></button>
    `;
  }

  // ------------- Events -------------

  function addAllEvents(uiState) {
    addRouteEvents();
    addToolbarEvents();
    addStocksListEvents();
    if (uiState.isFilterOpen)
      addFilterEvents();
  }

  function addRouteEvents() {
    window.addEventListener('hashchange', hashchangeHandler)
  }

  function addToolbarEvents() {
    const toolbar = document.querySelector('.toolbar');
    toolbar.addEventListener('click', toolbarClickHandler);
  }

  function addStocksListEvents() {
    const stocksList = document.querySelector('.stocks-list');
    stocksList.addEventListener('click', stocksListClickHandler);
  }

  function addFilterEvents() {
    const filterApplyButton = document.querySelector('.filter > button');
    filterApplyButton.addEventListener('click', filterApplyClickHandler)
  }

  function hashchangeHandler() {
    window.Stokr.Ctrl.handleHashChange();
  }

  function getHash() {
    return window.location.hash;
  }

  function filterApplyClickHandler() {
    const filters = {};
    const filterLabels = document.querySelectorAll('.filter-parameters > label');
    filterLabels.forEach(filterLabel => {
      if (filterLabel.childNodes[1].value)
        filters[filterLabel.id] = filterLabel.childNodes[1].value;
    });
    window.Stokr.Ctrl.setFilters(filters);
  }

  function toolbarClickHandler(e) {
    switch (e.target.dataset.type) {
      case 'search': {
        break;
      }
      case 'refresh': {
        window.Stokr.Ctrl.toolbarRefreshClick();
        break;
      }
      case 'filter': {
        window.Stokr.Ctrl.toolbarFilterClick();
        break;
      }
      case 'settings': {
        window.Stokr.Ctrl.toolbarSettingsClick();
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
    renderStocksPage,
    renderHeader,
    renderStocksList,
    renderSearchPage,
    getHash
  }
})();
