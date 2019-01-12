import { getDiff } from '../diff';
test('no change', () => {
    const a = { title: 'old' };
    const b = { title: 'old' };
    const diff = getDiff(a, b);
    expect(diff).toEqual(null);
});
test('layout change', () => {
    const a = { title: 'old' };
    const b = { title: 'new' };
    const diff = getDiff(a, b);
    expect(diff).toEqual({ title: 'new' });
});
test('addition', () => {
    const a = { title: 'old' };
    const b = { title: 'old', another: 'change' };
    const diff = getDiff(a, b);
    expect(diff).toEqual({ another: 'change' });
});
test('deep change', () => {
    const a = { xaxis: { title: 'old', showgrid: false } };
    const b = { xaxis: { title: 'new', showgrid: false } };
    const diff = getDiff(a, b);
    expect(diff).toEqual({ 'xaxis.title': 'new' });
});
test('deep array change', () => {
    const a = { xaxis: { range: [0, 1] } };
    const b = { xaxis: { range: [2, 4] } };
    const diff = getDiff(a, b);
    expect(diff).toEqual({ 'xaxis.range[0]': 2, 'xaxis.range[1]': 4 });
});
test('data change', () => {
    const a = [{ x: [0, 1], y: [0, 1] }];
    const b = [{ x: [2, 4], y: [2, 4] }];
    const diff = getDiff(a, b);
    expect(diff).toEqual([{ 'x[0]': 2, 'x[1]': 4, 'y[0]': 2, 'y[1]': 4 }]);
});
test('Data title change', () => {
    const a = [{ x: [0, 1], y: [0, 1], title: 'old' }];
    const b = [{ x: [0, 1], y: [0, 1], title: 'new' }];
    const diff = getDiff(a, b);
    expect(diff).toEqual([{ title: 'new' }]);
});
test('Data multiple changes', () => {
    const a = [{ title: 'old' }, { title: 'new' }, { title: 'old' }];
    const b = [{ title: 'new' }, { title: 'new' }, { title: 'new' }];
    const diff = getDiff(a, b);
    expect(diff).toEqual([{ title: 'new' }, null, { title: 'new' }]);
});
//# sourceMappingURL=diff.test.js.map