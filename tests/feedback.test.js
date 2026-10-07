const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const crypto = require('node:crypto');

// All providers are test doubles. No credentials or network are used.
function harness() {
  const calls = [], mails = [];
  const key = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' });
  const sandbox = {
    exports: {}, Buffer, console, Date,
    process: { env: { GSHEETS_SPREADSHEET_ID: 'test-feedback', GSHEETS_CLIENT_EMAIL: 'test@example.invalid', GSHEETS_PRIVATE_KEY: key, SMTP_USER: 'test@example.invalid', SMTP_PASS: 'test-only' } },
    require: name => name === 'crypto' ? crypto : { createTransport: () => ({ sendMail: async mail => mails.push(mail) }) },
    fetch: async (url, options) => { calls.push({ url, options }); return { ok: true, status: 200, json: async () => ({ access_token: 'test-only' }) }; }
  };
  vm.runInNewContext(fs.readFileSync('netlify/functions/feedback.js', 'utf8'), sandbox);
  return { handler: sandbox.exports.handler, calls, mails };
}
const payload = (ratings = {}) => ({ formacion: 'ia-aplicada', empresa: 'TEST DOUBLE — NO SUBMISSION', calidad: 3.5, instructor: 4.5, materiales: 5, renderedAt: Date.now() - 10000, ...ratings });

test('half ratings persist unchanged as RAW numeric cells and contribute to the average', async () => {
  const h = harness();
  const response = await h.handler({ httpMethod: 'POST', body: JSON.stringify(payload()) });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), { ok: true });
  const append = h.calls.find(c => c.url.includes(':append'));
  assert.match(append.url, /valueInputOption=RAW/);
  const row = JSON.parse(append.options.body).values[0];
  assert.deepEqual(row.slice(2, 6), [3.5, 4.5, 5, 4.33]);
  assert.equal(h.mails.length, 1);
  assert.match(h.mails[0].text, /3,5\/5/);
  assert.match(h.mails[0].html, /4,5\/5/);
});

for (const value of [0, 0.5, 5.5, 3.25, "3.25", "3.5junk", "3,5", "NaN", null, true, {}, []]) {
  test(`rejects invalid rating ${JSON.stringify(value)} without provider calls`, async () => {
    const h = harness();
    const response = await h.handler({ httpMethod: 'POST', body: JSON.stringify(payload({ calidad: value })) });
    assert.equal(response.statusCode, 400);
    assert.ok(JSON.parse(response.body).fields.includes('calidad'));
    assert.equal(h.calls.length, 0);
    assert.equal(h.mails.length, 0);
  });
}
for (const value of [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]) {
  test(`accepts ${value} in all rating fields`, async () => {
    const h = harness();
    const response = await h.handler({ httpMethod: 'POST', body: JSON.stringify(payload({ calidad: value, instructor: value, materiales: value })) });
    assert.equal(response.statusCode, 200);
    const row = JSON.parse(h.calls.find(c => c.url.includes(':append')).options.body).values[0];
    assert.deepEqual(row.slice(2, 6), [value, value, value, value]);
  });
}
test('legacy integer strings remain accepted and stored as numbers', async () => {
  const h = harness();
  const response = await h.handler({ httpMethod: 'POST', body: JSON.stringify(payload({ calidad: '3', instructor: '4', materiales: '5' })) });
  assert.equal(response.statusCode, 200);
  const row = JSON.parse(h.calls.find(c => c.url.includes(':append')).options.body).values[0];
  assert.deepEqual(row.slice(2, 6), [3, 4, 5, 4]);
});
for (const field of ['instructor', 'materiales']) {
  test(`rejects quarter values in ${field}`, async () => {
    const h = harness();
    const response = await h.handler({ httpMethod: 'POST', body: JSON.stringify(payload({ [field]: 4.25 })) });
    assert.equal(response.statusCode, 400);
    assert.deepEqual(JSON.parse(response.body).fields, [field]);
    assert.equal(h.calls.length, 0);
  });
}
test('method and malformed JSON guards', async () => {
  const h = harness();
  assert.equal((await h.handler({ httpMethod: 'GET' })).statusCode, 405);
  assert.equal((await h.handler({ httpMethod: 'POST', body: '{' })).statusCode, 400);
  assert.equal(h.calls.length, 0);
});
