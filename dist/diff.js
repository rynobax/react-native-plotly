import { diff } from 'deep-diff';
import { set } from 'lodash';
export var getDiff = function(prev, cur) {
  if (prev && cur) {
    if (Array.isArray(cur) && Array.isArray(prev)) {
      return cur.map(function(c, i) {
        return getObjectDiff(prev[i], c);
      });
    }
    return getObjectDiff(prev, cur);
  }
  return null;
};
var getObjectDiff = function(prev, cur) {
  if (prev && cur) {
    var diffs = diff(prev, cur);
    if (diffs) {
      var layoutChanges_1 = {};
      diffs.forEach(function(d) {
        if (['E', 'A', 'N'].includes(d.kind)) {
          var path = d.path.reduce(function(p, c) {
            if (p === '') return c;
            if (typeof c === 'string') return p + '.' + c;
            else return p + '[' + String(c) + ']';
          }, '');
          layoutChanges_1[path] = d.rhs;
        } else if (d.kind === 'D') {
          set(layoutChanges_1, d.path, undefined);
        }
      });
      return layoutChanges_1;
    }
  }
  return null;
};
//# sourceMappingURL=diff.js.map
