import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { NavigationMenu } from '../components/navigation-menu.js';

suite('navigation-menu', () => {
  let el;

  setup(async () => {
    document.documentElement.lang = 'en';
    el = await fixture(html`<navigation-menu></navigation-menu>`);
  });

  test('is defined', () => {
    expect(customElements.get('navigation-menu')).to.equal(NavigationMenu);
  });

  test('renders links and switch button', () => {
    const links = el.shadowRoot.querySelectorAll('a');
    expect(links.length).to.equal(2);
    expect(links[0].textContent.trim()).to.equal('List');
    expect(links[1].textContent.trim()).to.equal('Add Employee');
    const btn = el.shadowRoot.querySelector('button.switch');
    expect(btn).to.exist;
    expect(btn.textContent.trim()).to.equal('Türkçe');
  });

  test('toggles lang attribute and label on click', async () => {
    const btn = el.shadowRoot.querySelector('button.switch');
    btn.click();
    await el.updateComplete;
    expect(document.documentElement.lang).to.equal('tr');
    expect(btn.textContent.trim()).to.equal('English');

    const evPromise = oneEvent(window, 'lang-change');
    btn.click();
    const ev = await evPromise;
    expect(ev.detail.lang).to.equal('en');
  });

  test('active class reflects current path', async () => {
    history.pushState({}, '', '/add');
    window.dispatchEvent(new CustomEvent('vaadin-router-location-changed'));
    await el.updateComplete;
    const addLink = el.shadowRoot.querySelector('a[href="/add"]');
    expect(addLink.classList.contains('active')).to.be.true;
  });
});
