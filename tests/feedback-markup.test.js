const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
for (const path of ['feedback/index.html', 'ca/feedback/index.html']) {
  test(`${path}: all questions offer nine ordered accessible values over five stars`, () => {
    const html = fs.readFileSync(path, 'utf8');
    for (const name of ['calidad', 'instructor', 'materiales']) {
      const values = [...html.matchAll(new RegExp(`name="${name}" value="([^"]+)" aria-label="([^"]+)"`, 'g'))];
      assert.deepEqual(values.map(m => Number(m[1])), [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
      assert.ok(values.every(m => m[2].includes(m[1].replace('.', ','))));
      assert.match(html, new RegExp(`aria-labelledby="${name}-legend"`));
    }
    assert.equal((html.match(/class="fb-star-visual"/g) || []).length, 15);
    assert.equal((html.match(/class="fb-rating-value"/g) || []).length, 3);
  });
}
