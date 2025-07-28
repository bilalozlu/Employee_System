import { LitElement, html, css } from 'lit';
import { store, setPage, deleteEmployee } from '../store.js';
import { Router } from '@vaadin/router';
import { t } from '../utils/i18n.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host { display: block; padding: 16px; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border-bottom: 1px solid #ccc; text-align: left; }
    button { padding: 4px 8px; margin: 0 4px; }
  `;

  static properties = { employees: {}, page: {}, perPage: {}, _selected: { state: true } };

  constructor() {
    super();
    this.unsubscribe = store.subscribe(() => this._stateChanged());
    this._stateChanged();
  }

  disconnectedCallback() {
    this.unsubscribe();
    super.disconnectedCallback();
  }

  _stateChanged() {
    const { list, page, perPage } = store.getState();
    Object.assign(this, { employees: list, page, perPage });
  }

  _delete(id) {
    if (confirm(t('delConfirm'))) {
      store.dispatch(deleteEmployee(id));
    }
  }

  _prev() {
    if (this.page > 1) store.dispatch(setPage(this.page - 1));
  }

  _next() {
    store.dispatch(setPage(this.page + 1));
  }

  _toggleSelect(id, checked) {
    if (checked) this._selected.add(id);
    else this._selected.delete(id);
    this.requestUpdate();
  }

  _toggleAll(checked, pageItems) {
    pageItems.forEach(emp => {
      if (checked) this._selected.add(emp.id);
      else this._selected.delete(emp.id);
    });
    this.requestUpdate();
  }

  _deleteSelected() {
    this._selected.forEach(id => store.dispatch(deleteEmployee(id)));
    this._selected.clear();
  }

  firstUpdated() {
    window.addEventListener('lang-changed', () => this.requestUpdate());
  }

  render() {
    const start = (this.page - 1) * this.perPage;
    const pageItems = this.employees.slice(start, start + this.perPage);
    const headers = t('headers');

    return html`
      <header>
        <h2>${t('list')}</h2>
      </header>
      <table>
        <thead>
          <tr>
            ${headers.map(h => html`<th>${h}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${pageItems.map(emp => html`
            <tr>
              <td>${emp.firstName}</td>
              <td>${emp.lastName}</td>
              <td>${emp.employmentDate}</td>
              <td>${emp.birthDate}</td>
              <td>${emp.phone}</td>
              <td>${emp.email}</td>
              <td>${emp.department}</td>
              <td>${emp.position}</td>
              <td>
                <div style="display: inline-flex;">
                  <button @click=${() => Router.go(`/edit/${emp.id}`)}>${t('edit')}</button>
                  <button @click=${() => this._delete(emp.id)}>×</button>
                </div>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
      <div style="margin-top:16px; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <button @click=${this._prev} ?disabled=${this.page === 1}>
          Prev
        </button>
        <span>
          ${this.page} / ${Math.ceil(this.employees.length / this.perPage)}
        </span>
        <button
          @click=${this._next}
          ?disabled=${this.page * this.perPage >= this.employees.length}
        >
          Next
        </button>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
