import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import { Employee } from '../src/modules/employees/employee.model.js';

const passwordHash = await bcrypt.hash('Fictional-test-password', 10);

function createEmployee(overrides = {}) {
  return new Employee({
    fullName: '  Alex Example  ',
    email: '  ALEX@EXAMPLE.TEST  ',
    passwordHash,
    phone: '+910000000000',
    dateOfBirth: '2000-02-29',
    gender: 'other',
    company: '200000000000000000000001',
    department: '300000000000000000000001',
    designation: '400000000000000000000001',
    ...overrides,
  });
}

test('employee normalizes identity and starts pending without invented join date', async () => {
  const employee = createEmployee();
  await employee.validate();
  assert.equal(employee.fullName, 'Alex Example');
  assert.equal(employee.email, 'alex@example.test');
  assert.equal(employee.role, 'employee');
  assert.equal(employee.status, 'pending');
  assert.equal(employee.joinDate, null);
  assert.equal(employee.company.toString(), '200000000000000000000001');
});

test('employee rejects missing required fields, invalid references, and invalid account states', async () => {
  for (const [field, value] of [
    ['dateOfBirth', null],
    ['company', 'invalid-id'],
    ['department', null],
    ['designation', null],
    ['email', null],
    ['fullName', '   '],
    ['role', 'superadmin'],
    ['role', null],
    ['status', 'approved'],
    ['status', null],
    ['passwordHash', null],
  ]) {
    await assert.rejects(createEmployee({ [field]: value }).validate(),
      (error) => Boolean(error.errors[field]), `${field} should be rejected`);
  }
});

test('normal employee queries exclude password hashes and private photo metadata', () => {
  assert.equal(Employee.schema.path('passwordHash').options.select, false);
  assert.equal(Employee.schema.path('profilePhoto').options.select, false);
});

test('employee declares unique email index and shared organization references', () => {
  assert.ok(Employee.schema.indexes().some(([keys, options]) => keys.email === 1 && options.unique));
  assert.equal(Employee.schema.path('company').options.ref, 'Company');
  assert.equal(Employee.schema.path('department').options.ref, 'Department');
  assert.equal(Employee.schema.path('designation').options.ref, 'Designation');
});
