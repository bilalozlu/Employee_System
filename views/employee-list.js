import { LitElement, html, css } from 'lit';
import { store, setPage, deleteEmployee } from '../store.js';
import { Router } from '@vaadin/router';
import { t } from '../utils/i18n.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host { display: block; padding: 16px; box-sizing: border-box; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    header h2 { margin: 0; color: #ff7f50; }
    .view-toggle { display: flex; gap: 8px; }
    .view-toggle button { padding: 4px; }

    table { width: 100%; border-collapse: collapse; table-layout: auto; }
    th { color: #ff7f50;}
    th, td { padding: 8px; border-bottom: 1px solid #eee; text-align: center; }

    @media (max-width: 980px) {
      th:nth-of-type(3),
      td:nth-of-type(3),
      th:nth-of-type(4),
      td:nth-of-type(4) {
        display: none;
      }
    }

    @media (max-width: 750px) {
      th:nth-of-type(3), td:nth-of-type(3),
      th:nth-of-type(4), td:nth-of-type(4),
      th:nth-of-type(6), td:nth-of-type(6),
      th:nth-of-type(7), td:nth-of-type(7),
      th:nth-of-type(8), td:nth-of-type(8) {
        display: none;
      }
    }

    @media (max-width: 600px) {
      th:nth-of-type(3), td:nth-of-type(3),
      th:nth-of-type(4), td:nth-of-type(4),
      th:nth-of-type(5), td:nth-of-type(5),
      th:nth-of-type(6), td:nth-of-type(6),
      th:nth-of-type(7), td:nth-of-type(7),
      th:nth-of-type(8), td:nth-of-type(8) {
        display: none;
      }
    }

    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

    @media (max-width: 750px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }

    .card { border: 1px solid #ccc; padding: 12px; border-radius: 4px; display: grid; grid-template-columns: 1fr 1fr; flex-direction: column; gap: 12px; align-items: start;}
    .card .actions { grid-column: 1 / -1; margin-top: 8px; display: flex; justify-content: flex-start; gap: 8px; font-size: 16px;}
    .card .actions .edit{ background-color: blue; font-size: 16px; color: white; padding: 6px; border-radius:3px}
    .card .actions .delete{ background-color: #ff7f50; font-size: 16px; color: white; padding:6px; border-radius:3px}
    button { padding: 4px; font-size: 24px; border:none; background: transparent; cursor: pointer; color: #ff7f50;}
    button:disabled { cursor: default; opacity: 0.5}

  `;

  static properties = {
    employees: { type: Array },
    page:      { type: Number },
    perPage:   { type: Number },
    viewMode:  { state: true }
  };

  constructor() {
    super();
    this.unsubscribe = store.subscribe(() => this._stateChanged());
    this.viewMode = 'table';
    this._stateChanged();
  }

  disconnectedCallback() {
    this.unsubscribe();
    super.disconnectedCallback();
  }

  _stateChanged() {
    const { list, page, perPage } = store.getState();
    this.employees = list;
    this.page      = page;
    this.perPage   = perPage;
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

  _toggleView(mode) {
    this.viewMode = mode;
  }

  firstUpdated() {
    window.addEventListener('lang-change', () => this.requestUpdate());
  }

  render() {
    const start     = (this.page - 1) * this.perPage;
    const pageItems = (this.employees || []).slice(start, start + this.perPage);
    const headers   = t('headers');

    return html`
      <header>
        <h2>${t('list')}</h2>
        <div class="view-toggle">
          <button
            ?disabled=${this.viewMode === 'table'}
            @click=${() => this._toggleView('table')}>
            ☰
          </button>
          <button
            ?disabled=${this.viewMode === 'grid'}
            @click=${() => this._toggleView('grid')}>
            ▦
          </button>
        </div>
      </header>

      ${this.viewMode === 'table'
        ? html`
            <table>
              <thead>
                <tr>${headers.map(h => html`<th>${h}</th>`)}</tr>
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
                      <button @click=${() => Router.go(`/edit/${emp.id}`)}>✎</button>
                      <button @click=${() => this._delete(emp.id)}>🗑</button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          `
        : html`
            <div class="grid">
              ${pageItems.map(emp => html`
              <div class="card">
                <div><strong>${t('form').firstName}:</strong> ${emp.firstName}</div>
                <div><strong>${t('form').lastName}:</strong> ${emp.lastName}</div>
                <div><strong>${t('form').employmentDate}:</strong> ${emp.employmentDate}</div>
                <div><strong>${t('form').birthDate}:</strong> ${emp.birthDate}</div>
                <div><strong>${t('form').phone}:</strong> ${emp.phone}</div>
                <div><strong>${t('form').email}:</strong> ${emp.email}</div>
                <div><strong>${t('form').department}:</strong> ${emp.department}</div>
                <div><strong>${t('form').position}:</strong> ${emp.position}</div>
                <div class="actions">
                  <button class="edit" @click=${() => Router.go(`/edit/${emp.id}`)}>✎ ${t('edit')}</button>
                  <button class="delete" @click=${() => this._delete(emp.id)}>🗑 ${t('delete')}</button>
                </div>
              </div>
              `)}
            </div>
          `}

      <div style="margin-top:16px; display:flex; justify-content:center; align-items:center; gap:8px;">
        <button @click=${this._prev} ?disabled=${this.page === 1}>${t('prev')}</button>
        <span>${this.page} / ${Math.ceil((this.employees || []).length / this.perPage)}</span>
        <button
          @click=${this._next}
          ?disabled=${this.page * this.perPage >= (this.employees || []).length}>
          ${t('next')}
        </button>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
