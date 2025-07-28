import { LitElement, html, css } from 'lit';
import { store, addEmployee, updateEmployee } from '../store.js';
import { Router } from '@vaadin/router';
import { t } from '../utils/i18n.js';

export class EmployeeForm extends LitElement {
  static styles = css`
    form {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding: 16px;
      box-sizing: border-box;
    }
    @media (max-width: 980px) {
      form { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      form { grid-template-columns: 1fr; }
    }
    label {
      display: flex;
      flex-direction: column;
      font-weight: 500;
    }
    input, select {
      padding: 8px;
      font-size: 1rem;
      margin-top: 4px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .error {
      color: #b00020;
      font-size: 0.9rem;
      margin-top: 4px;
    }
    .actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 8px;
    }
    .save {
      background-color: #ff7f50;
      font-size: 16px;
      color: white;
      padding: 6px 24px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
    .cancel {
      background-color: white;
      font-size: 16px;
      color: blue;
      padding: 6px 24px;
      border-radius: 6px;
      border: 1px solid blue;
      cursor: pointer;
    }
  `;

  static properties = {
    employee: { type: Object },
    _errors:  { state: true }
  };

  constructor() {
    super();
    this.employee = {
      id: '',
      firstName: '',
      lastName: '',
      employmentDate: '',
      birthDate: '',
      phone: '',
      email: '',
      department: 'Analytics',
      position: 'Junior'
    };
    this._errors = {};
  }

  firstUpdated() {
    window.addEventListener('lang-change', () => this.requestUpdate());

    const match = window.location.pathname.match(/\/edit\/([^/]+)$/);
    if (match) {
      const emp = store.getState().list.find(e => e.id === match[1]);
      if (emp) this.employee = { ...emp };
    }
  }

  _validate() {
    const errors = {};
    const F = t('form');
  
    ['firstName','lastName','employmentDate','birthDate','phone','email','department','position']
      .forEach(field => {
        if (!this.employee[field] || this.employee[field].toString().trim() === '') {
          errors[field] = `${F[field]} ${F.required}`;
        }
      });
  
    const { employmentDate, birthDate } = this.employee;
    if (employmentDate && birthDate) {
      const empDt = new Date(employmentDate);
      const birthDt = new Date(birthDate);
      if (empDt <= birthDt) {
        errors.employmentDate = F.employmentDate + F.validDate + F.birthDate;
      }
    }
  
    this._errors = errors;
    return Object.keys(errors).length === 0;
  }

  _save(e) {
    if (!this._validate()) {
      const firstErr = Object.keys(this._errors)[0];
      this.shadowRoot.querySelector(`[name="${firstErr}"]`)?.focus();
      return;
    }

    const emp = { ...this.employee };
    if (emp.id) {
      store.dispatch(updateEmployee(emp));
    } else {
      emp.id = Date.now().toString();
      store.dispatch(addEmployee(emp));
    }
    Router.go('/');
  }

  _cancel() {
    Router.go('/');
  }

  render() {
    const F = t('form');
    return html`
      <form @submit=${e => { e.preventDefault(); this._save(); }}>
      ${['firstName','lastName','employmentDate','birthDate','phone','email','department','position'].map(field => html`
      <label>
        ${F[field]}
        ${field === 'department' || field === 'position'
          ? html`
            <select
              name=${field}
              .value=${this.employee[field]}
              @change=${e => this.employee[field] = e.target.value}>
              ${field === 'department'
                ? html`<option>Analytics</option><option>Tech</option>`
                : html`<option>Junior</option><option>Medior</option><option>Senior</option>`}
            </select>`
          : html`
            <input
              name=${field}
              type=${['employmentDate','birthDate'].includes(field) ? 'date'
                : field === 'phone' ? 'tel'
                : field === 'email' ? 'email'
                : 'text'}
              .value=${this.employee[field]}
              @input=${e => this.employee[field] = e.target.value}>`}
        ${this._errors[field]
          ? html`<div class="error">${this._errors[field]}</div>`
          : ''}
      </label>
    `)}

        <div class="actions">
          <button type="submit" class="save">${F.save}</button>
          <button type="button" class="cancel" @click=${this._cancel}>${F.cancel}</button>
        </div>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
