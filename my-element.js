import { LitElement, html, css } from 'lit';
import { initRouter } from './routes.js';
import './navigation-menu.js';

class MyElement extends LitElement {
  static styles = css`:host { display: block; padding: 16px; font-family: sans-serif; }`;
  render() {
    return html`
      <navigation-menu></navigation-menu>
      <div id="outlet"></div>
    `;
  }
  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    initRouter(outlet);
  }
}
customElements.define('my-element', MyElement);