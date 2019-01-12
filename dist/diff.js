import { diff } from 'deep-diff';
import { set } from 'lodash';
export const getDiff = (prev, cur) => {
    if (prev && cur) {
        if (Array.isArray(cur) && Array.isArray(prev)) {
            return cur.map((c, i) => {
                return getObjectDiff(prev[i], c);
            });
        }
        return getObjectDiff(prev, cur);
    }
    return null;
};
const getObjectDiff = (prev, cur) => {
    if (prev && cur) {
        const diffs = diff(prev, cur);
        if (diffs) {
            const layoutChanges = {};
            diffs.forEach(d => {
                if (['E', 'A', 'N'].includes(d.kind)) {
                    const path = d.path.reduce((p, c) => {
                        if (p === '')
                            return c;
                        if (typeof c === 'string')
                            return p + '.' + c;
                        else
                            return p + '[' + String(c) + ']';
                    }, '');
                    layoutChanges[path] = d.rhs;
                }
                else if (d.kind === 'D') {
                    set(layoutChanges, d.path, undefined);
                }
            });
            return layoutChanges;
        }
    }
    return null;
};
//# sourceMappingURL=diff.js.map