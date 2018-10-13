import { diff } from 'deep-diff';
import { set } from 'lodash';

export const getDiff = (
  prev: object | Array<object> | undefined,
  cur: object | Array<object> | undefined
) => {
  if (prev && cur) {
    if (Array.isArray(cur) && Array.isArray(prev)) {
      return cur.map((c, i) => {
        return getObjectDiff(prev[i], c)
      });
    }
    return getObjectDiff(prev, cur);
  }
  return null;
};

const getObjectDiff = (prev: object | undefined, cur: object | undefined) => {
  if (prev && cur) {
    const diffs = diff(prev, cur);
    if (diffs) {
      const layoutChanges: { [path: string]: string | number } = {};
      diffs.forEach(d => {
        if (['E', 'A', 'N'].includes(d.kind)) {
          const path = d.path.reduce((p, c) => {
            if (p === '') return c;
            if (typeof c === 'string') return p + '.' + c;
            else return p + '[' + c + ']';
          }, '');
          layoutChanges[path] = d.rhs;
        } else if (d.kind === 'D') {
          set(layoutChanges, d.path, undefined);
        }
      });
      return layoutChanges;
    }
  }
  return null;
};
