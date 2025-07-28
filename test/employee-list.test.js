import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../utils/i18n.js';
import '../views/employee-list.js';
import { store } from '../store.js';

suite('employee-list', () => {
  let el;

  const sample = [
    { id: '1', firstName: 'A', lastName: 'Alpha', employmentDate: '2020-01-01', birthDate: '1990-01-01', phone:'123', email:'a@a.com', department:'Tech', position:'Senior' },
    { id: '2', firstName: 'B', lastName: 'Beta',  employmentDate: '2021-02-02', birthDate: '1991-02-02', phone:'456', email:'b@b.com', department:'Analytics', position:'Junior' },
  ];

  setup(async () => {
    store.dispatch({ type: 'DELETE_EMPLOYEE', id: '1' });
    store.dispatch({ type: 'DELETE_EMPLOYEE', id: '2' });
    sample.forEach(emp => store.dispatch({ type: 'ADD_EMPLOYEE', employee: emp }));
    el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
  });

  teardown(() => {
    sample.forEach(emp => store.dispatch({ type: 'DELETE_EMPLOYEE', id: emp.id }));
  });

  test('renders table headers localized', () => {
    const headerCells = el.shadowRoot.querySelectorAll('th');
    const labels = Array.from(headerCells).map(th => th.textContent.trim());
    expect(labels).to.include.members(['First Name', 'Last Name', 'Department', 'Actions']);
  });

  test('pagination next/prev buttons disable correctly', async () => {
    const [prev, next] = el.shadowRoot.querySelectorAll('div + div button');
    expect(prev.disabled).to.be.true;
    expect(next.disabled).to.be.true;
  });

  test('delete button dispatches after confirm', async () => {
    const confirmStub = sinon.stub(window, 'confirm').returns(true);
    const spy = sinon.spy(store, 'dispatch');
    const deleteBtn = el.shadowRoot.querySelector('tbody button[aria-label="delete"]') 
      || el.shadowRoot.querySelectorAll('tbody button')[1]; 
    deleteBtn.click();
    expect(confirmStub.called).to.be.true;
    expect(spy.calledWithMatch({ type: 'DELETE_EMPLOYEE', id: '1' })).to.be.true;
    confirmStub.restore();
    spy.restore();
  });

  test('grid view toggle shows cards', async () => {
    const toggleBtns = el.shadowRoot.querySelectorAll('.view-toggle button');
    toggleBtns[1].click();
    await el.updateComplete;
    expect(el.viewMode).to.equal('grid');
    const cards = el.shadowRoot.querySelectorAll('.card');
    expect(cards.length).to.equal(2);
    expect(cards[0].textContent).to.contain('A');
  });
});
