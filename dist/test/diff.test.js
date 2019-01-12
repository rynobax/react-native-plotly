import { getDiff } from '../diff';
test('no change', function() {
  var a = { title: 'old' };
  var b = { title: 'old' };
  var diff = getDiff(a, b);
  expect(diff).toEqual(null);
});
test('layout change', function() {
  var a = { title: 'old' };
  var b = { title: 'new' };
  var diff = getDiff(a, b);
  expect(diff).toEqual({ title: 'new' });
});
test('addition', function() {
  var a = { title: 'old' };
  var b = { title: 'old', another: 'change' };
  var diff = getDiff(a, b);
  expect(diff).toEqual({ another: 'change' });
});
test('deep change', function() {
  var a = { xaxis: { title: 'old', showgrid: false } };
  var b = { xaxis: { title: 'new', showgrid: false } };
  var diff = getDiff(a, b);
  expect(diff).toEqual({ 'xaxis.title': 'new' });
});
test('deep array change', function() {
  var a = { xaxis: { range: [0, 1] } };
  var b = { xaxis: { range: [2, 4] } };
  var diff = getDiff(a, b);
  expect(diff).toEqual({ 'xaxis.range[0]': 2, 'xaxis.range[1]': 4 });
});
test('data change', function() {
  var a = [{ x: [0, 1], y: [0, 1] }];
  var b = [{ x: [2, 4], y: [2, 4] }];
  var diff = getDiff(a, b);
  expect(diff).toEqual([{ 'x[0]': 2, 'x[1]': 4, 'y[0]': 2, 'y[1]': 4 }]);
});
test('Data title change', function() {
  var a = [{ x: [0, 1], y: [0, 1], title: 'old' }];
  var b = [{ x: [0, 1], y: [0, 1], title: 'new' }];
  var diff = getDiff(a, b);
  expect(diff).toEqual([{ title: 'new' }]);
});
test('Data multiple changes', function() {
  var a = [{ title: 'old' }, { title: 'new' }, { title: 'old' }];
  var b = [{ title: 'new' }, { title: 'new' }, { title: 'new' }];
  var diff = getDiff(a, b);
  expect(diff).toEqual([{ title: 'new' }, null, { title: 'new' }]);
});
//# sourceMappingURL=diff.test.js.map
