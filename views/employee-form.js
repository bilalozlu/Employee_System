// src/views/employee-form.js

import { LitElement, html, css } from 'lit';
import { store, addEmployee, updateEmployee } from '../store.js';
import { Router } from '@vaadin/router';
import { t } from '../utils/i18n.js';

export class EmployeeForm extends LitElement {
  static styles = css`
    form { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
    label { display: flex; flex-direction: column; font-weight: 500; }
    input, select, button { padding: 8px; font-size: 1rem; }
    button { width: fit-content; align-self: start; }
  `;

  static properties = {
    employee: { type: Object }
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
  }

  firstUpdated() {
    // re-render on language change
    window.addEventListener('lang-changed', () => this.requestUpdate());

    // if editing, load existing employee
    const match = window.location.pathname.match(/\/edit\/([^/]+)$/);
    if (match) {
      const emp = store.getState().list.find(e => e.id === match[1]);
      if (emp) this.employee = { ...emp };
    }
  }

  _save() {
    const emp = { ...this.employee };
    if (emp.id) {
      store.dispatch(updateEmployee(emp));
    } else {
      emp.id = Date.now().toString();
      store.dispatch(addEmployee(emp));
    }
    Router.go('/');
  }

  render() {
    const F = t('form');
    return html`
      <form @submit=${e => { e.preventDefault(); this._save(); }}>
        <label>
          ${F.firstName}
          <input
            type="text"
            .value=${this.employee.firstName}
            @input=${e => this.employee.firstName = e.target.value}>
        </label>

        <label>
          ${F.lastName}
          <input
            type="text"
            .value=${this.employee.lastName}
            @input=${e => this.employee.lastName = e.target.value}>
        </label>

        <label>
          ${F.employmentDate}
          <input
            type="date"
            .value=${this.employee.employmentDate}
            @input=${e => this.employee.employmentDate = e.target.value}>
        </label>

        <label>
          ${F.birthDate}
          <input
            type="date"
            .value=${this.employee.birthDate}
            @input=${e => this.employee.birthDate = e.target.value}>
        </label>

        <label>
          ${F.phone}
          <input
            type="tel"
            .value=${this.employee.phone}
            @input=${e => this.employee.phone = e.target.value}>
        </label>

        <label>
          ${F.email}
          <input
            type="email"
            .value=${this.employee.email}
            @input=${e => this.employee.email = e.target.value}>
        </label>

        <label>
          ${F.department}
          <select
            .value=${this.employee.department}
            @change=${e => this.employee.department = e.target.value}>
            <option>Analytics</option>
            <option>Tech</option>
          </select>
        </label>

        <label>
          ${F.position}
          <select
            .value=${this.employee.position}
            @change=${e => this.employee.position = e.target.value}>
            <option>Junior</option>
            <option>Medior</option>
            <option>Senior</option>
          </select>
        </label>

        <button type="submit">${F.save}</button>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
