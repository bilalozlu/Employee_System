import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

const translations = {
  en: {
    list: 'List',
    add: 'Add Employee',
    switchTo: 'Türkçe',
  },
  tr: {
    list: 'Liste',
    add: 'Yeni Çalışan',
    switchTo: 'English',
  }
};

export class NavigationMenu extends LitElement {
  static properties = {
    lang: { state: true }
  };

  static styles = css`
    :host { display: block; background: #f5f5f5; padding: 8px 16px; }
    nav { display: flex; gap: 16px; align-items: center; }
    a { text-decoration: none; color: #333; font-weight: 500; }
    a.active { color: #007acc; }
    button.switch { margin-left: auto; padding: 4px 8px; }
  `;

  constructor() {
    super();
    // initialize from <html lang="…">
    this.lang = document.documentElement.lang || 'en';
  }

  firstUpdated() {
    // re-render active link on navigation
    window.addEventListener('vaadin-router-location-changed', () => this.requestUpdate());
  }

  _getLabel(key) {
    return translations[this.lang]?.[key] || translations.en[key];
  }

  _toggleLang() {
    // flip the lang attribute and re-render
    this.lang = this.lang === 'en' ? 'tr' : 'en';
    document.documentElement.lang = this.lang;
    window.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang: this.lang } }));
  }

  _navigate(e) {
    e.preventDefault();
    Router.go(e.currentTarget.getAttribute('href'));
  }

  render() {
    const path = window.location.pathname;
    return html`
      <nav>
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
