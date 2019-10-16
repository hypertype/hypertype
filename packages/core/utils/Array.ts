import {Fn} from "./Fn";

export {};

declare global {
    interface Array<T> {
        filter(callbackfn: (value: T, index: number) => boolean): Array<T>;

        max(fn?: (item: T) => any): T;

        min(fn?: (item: T) => any): T;

        maxVal(fn: (item: T, index: number) => any): any;

        minVal(fn: (item: T, index: number) => any): any;

        remove(item: T): boolean;

        removeAll(test: (item: T) => boolean): Array<T>;

        range(min, max, step?): Array<number>;

        sum(): T;

        average(): T;

        distinct(selector?: (t: T) => any): Array<T>;

        toMap(keySelector, valSelector): any;

        mapBy(selector: (t: T) => (string | number)): any;

        orderBy(selector: (t: T) => (string | number), descending?): Array<T>;

        groupBy<K>(selector: (t: T) => K, descending?): Map<K, Array<T>>;
    }
}

Array.prototype.groupBy = function <T, K>(selector: (t: T) => K, descending?) {
    return this.reduce((result: Map<K, Array<T>>, item: T) => {
        const key = selector(item);
        if (result.has(key))
            result.get(key).push(item);
        else
            result.set(key, [item]);
        return result;
    }, new Map());
};
Array.prototype.toMap = function (keySelector, valSelector) {
    return this.reduce((res, cur) => {
        res[keySelector(cur)] = valSelector(cur);
        return res;
    }, {});
};


Array.prototype.orderBy = function <T>(selector: (t: T) => (string | number) = Fn.I as any, descending = false) {
    return [...this].sort((a,b) => ((selector(a) > selector(b)) ? 1 : -1) * (descending ? -1 : 1));
};

Array.prototype.mapBy = function (selector) {
    return this.reduce((res, cur) => {
        var key: any = selector(cur);
        if (!res[key]) res[key] = [];
        res[key].push(cur);
        return res;
    }, {});
};


Array.prototype.distinct = function <T, U = any>(selector?: (t: T) => U) {
    if (selector) {
        const map = this.reduce((map, cur) => {
            map.set(selector(cur), cur);
            return map;
        }, new Map<U, T>());
        return Array.from(map.values());
    }
    return Array.from(new (<any>Set)(this)) as Array<T>;
};

Array.prototype.range = function (min, max, step) {
    if (!step) step = 1;
    for (var i = min; i < max; i += step) {
        this.push(i);
    }
    return this;
};
Array.prototype.sum = function () {
    if (this.length == 0) return 0;
    return this.reduce((a, b) => a + b, 0);
};
Array.prototype.average = function () {
    return this.sum() / this.length;
};
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index == -1) return false;
    this.splice(index, 1);
    return true;
};
Array.prototype.removeAll = function (test: (item: any) => boolean) {
    if (!test) {
        this.length = 0;
        return this;
    }
    var left = 0;
    var right = this.length - 1;
    while (left <= right) {
        if (test(this[left])) {
            var temp = this[right];
            this[right] = left;
            this[left] = temp;
            right--;
        } else {
            left++;
        }
    }
    this.length = right + 1;
    return this;
};
Array.prototype.maxVal = function (fn) {
    if (this.length == 0)
        return null;
    var current = this[0];
    var currentVal = fn ? fn(current, 0) : current;
    this.forEach((item, i) => {
        if (current == null) {
            current = item;
            currentVal = fn ? fn(item, i) : item;
            return;
        }
        var val = fn ? fn(item, i) : item;
        if (val > currentVal) {
            current = item;
            currentVal = val;
        }
    });
    return currentVal;
};
Array.prototype.max = function (fn) {
    if (this.length == 0)
        return null;
    var current = this[0];
    var currentVal = fn ? fn(current) : +current;
    this.forEach(item => {
        if (current == null) {
            current = item;
            return;
        }
        var val = fn ? fn(item) : +item;
        if (val > currentVal) {
            current = item;
            currentVal = val;
        }
    });
    return current;
};
Array.prototype.minVal = function (fn) {
    if (this.length == 0)
        return null;
    var current = this[0];
    var currentVal = fn ? fn(current, 0) : current;
    this.forEach((item, i) => {
        if (current == null) {
            current = item;
            currentVal = fn ? fn(item, i) : item;
            return;
        }
        var val = fn ? fn(item, i) : item;
        if (val < currentVal) {
            current = item;
            currentVal = val;
        }
    });
    return currentVal;
};
Array.prototype.min = function (fn) {
    if (this.length == 0)
        return null;
    var current = this[0];
    var currentVal = fn ? fn(current) : current;
    this.forEach(item => {
        if (current == null) {
            current = item;
            return;
        }
        var val = fn ? fn(item) : item;
        if (val < currentVal) {
            current = item;
            currentVal = val;
        }
    });
    return current;
};
