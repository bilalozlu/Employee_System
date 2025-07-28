import './setup.js';
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../utils/i18n.js';
import '../views/employee-form.js';

suite('employee-form', () => {
  let el;

  setup(async () => {
    history.pushState({}, '', '/add');
    el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;
  });

  test('renders all inputs', () => {
    const inputs = el.shadowRoot.querySelectorAll('input, select');
    expect(inputs.length).to.equal(8);
  });

  test('shows required errors when empty', async () => {
    const saveBtn = el.shadowRoot.querySelector('button.save');
    saveBtn.click();
    await el.updateComplete;
    const errors = el.shadowRoot.querySelectorAll('.error');
    expect(errors.length).to.equal(6);
  });

  test('validates date order', async () => {
    el.employee.firstName = 'X';
    el.employee.lastName  = 'Y';
    el.employee.employmentDate = '1990-01-01';
    el.employee.birthDate      = '2000-01-01';
    el.employee.phone = '123';
    el.employee.email = 'x@y.com';
    el.employee.department = 'Tech';
    el.employee.position = 'Junior';
    await el.updateComplete;

    const saveBtn = el.shadowRoot.querySelector('button.save');
    saveBtn.click();
    await el.updateComplete;
    const empDateError = el._errors.employmentDate;
    expect(empDateError).to.contain('must be after');
  });

  test('cancel button navigates back', async () => {
    const navSpy = sinon.spy(history, 'pushState');
    const cancelBtn = el.shadowRoot.querySelector('button.cancel');
    cancelBtn.click();
    expect(location.pathname).to.equal('/');
    navSpy.restore();
  });
});
