import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

const translations = {
  en: {
    list: ' 👨‍💼 Employees',
    add: ' + Add New',
    switchTo: '🇹🇷',
  },
  tr: {
    list: ' 👨‍💼 Çalışanlar',
    add: ' + Yeni Ekle',
    switchTo: '🇬🇧',
  }
};

export class NavigationMenu extends LitElement {
  static properties = {
    lang: { state: true }
  };

  static styles = css`
    :host { display: block; background: #f5f5f5; padding: 8px 16px; }
    nav { display: flex; gap: 24px; align-items: center; justify-content: flex-end; }
    span { margin-right: auto; display: flex; align-items: center;}
    img { width: 20px; margin-right: 20px}
    a { text-decoration: none; color: #ff7f50; font-weight: 500; }
    button.switch { padding: 4px; border:none; background:transparent; font-size:24px; cursor:pointer; }
  `;

  constructor() {
    super();
    this.lang = document.documentElement.lang || 'en';
  }

  firstUpdated() {
    window.addEventListener('vaadin-router-location-changed', () => this.requestUpdate());
  }

  _getLabel(key) {
    return translations[this.lang]?.[key] || translations.en[key];
  }

  _toggleLang() {
    this.lang = this.lang === 'en' ? 'tr' : 'en';
    document.documentElement.lang = this.lang;
    window.dispatchEvent(new CustomEvent('lang-change', { detail: { lang: this.lang } }));
  }

  _navigate(e) {
    e.preventDefault();
    Router.go(e.currentTarget.getAttribute('href'));
  }

  render() {
    const path = window.location.pathname;
    return html`
      <nav>
        <span>
          <img src="./logo.png"> ING
        </span>
        <a
          href="/"
          @click=${this._navigate}
          class=${path === '/' ? 'active' : ''}>
          ${this._getLabel('list')}
        </a>
        <a
          href="/add"
          @click=${this._navigate}
          class=${path === '/add' ? 'active' : ''}>
          ${this._getLabel('add')}
        </a>
        <button class="switch" @click=${this._toggleLang}>
          ${this._getLabel('switchTo')}
        </button>
      </nav>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
