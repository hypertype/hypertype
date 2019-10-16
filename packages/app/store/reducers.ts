import {Action, AnyAction, Reducer} from "redux";
import {combineReducers as combineReducersDefault} from "redux";
import {deepAssign, Fn} from "@hypertype/core";

export const downgradeAction = action => Object.assign({}, action, {type: action.type.split('.').slice(1).join('.')});

export function combineReducers<TState>(object): Reducer<TState> {
    const defReducer = combineReducersDefault<TState>(object);
    return (state = null, action) => {
        if (state == null) return null;
        return defReducer(state, action);
    };
}

function objectReducerInner<T>(reducer: Reducer<T>, initial: T = null): Reducer<T> {
    return (state = initial, action: any) => {
        switch (action.type) {
            case "init_if_null":
                return state || reducer(action.payload, action);
            case 'init':
                return reducer(action.payload, action);
            case 'diff':
                return deepAssign({}, reducer(state, downgradeAction(action)), action.payload);
            case 'assign':
                return Object.assign({}, reducer(state, downgradeAction(action)), action.payload);
            default:
                return reducer(state, action);
        }
    };
}

export function objectReducer<T>(reducer: any | Reducer<T>, initial: T = null, key = null): Reducer<T> {
    if (typeof reducer === "object")
        return objectReducer<T>(combineReducers<T>(reducer), initial, key);
    if (key)
        return filterReducer(objectReducer<T>(reducer, initial), key, initial);
    return objectReducerInner<T>(reducer, initial);
}

export const filterReducer = (reducer, key, initial = {}) =>
    (state = initial, action) => {
        let result = action.type.split('.')[0] == key
            ? reducer(state, downgradeAction(action))
            : state || null;
        return result;
    };


export function arrayReducer<T>(itemReducer: Reducer<T> = Fn.I,
                                arrayReducer: Reducer<T[]> = Fn.I,
                                filterKey?,
                                filter = typeof filterKey === "function" ? filterKey : filterKey ?
                                    (t, a, i) => t[filterKey] == (a[filterKey] || a.payload[filterKey]) :
                                    (t, a, i) => i == a.index): Reducer<T[]> {
    const check = (item, action, index) => {
        if (filter) return filter(item, action, index) && itemReducer(item, action);
        const result = itemReducer(item, action);
        if (result != item) return result;
    };
    const updateReducer = (items: T[] = [], action) => {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let result = check(item, action, i);
            if (result && result != item) {
                return [
                    ...items.slice(0, i),
                    result,
                    ...items.slice(i + 1)
                ];
            }
        }
    };
    const deleteReducer = (items: T[] = [], action) => {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (filter && filter(item, action, i)) {
                return [
                    ...items.slice(0, i),
                    ...items.slice(i + 1)
                ];
            }
            let result = check(item, action, i);
            if (result && result != item) {
                return [
                    ...items.slice(0, i),
                    ...items.slice(i + 1)
                ];
            }
        }
    };
    const innerReducer = (items: T[] = null, action) => {
        if (!items) items = [];
        if (!Array.isArray(items)) items = [];
        switch (action.type.split('.')[0].toUpperCase()) {
            case "init_if_null".toUpperCase():
                return items && items.length && items || action.payload;
            case "set".toUpperCase():
            case "init".toUpperCase():
                return action.payload;
            case "add".toUpperCase():
                return items.concat([itemReducer(action.payload, action)]);
            case "addRange".toUpperCase():
                return items.concat(action.payload);
            case "remove".toUpperCase():
                return [
                    ...items.slice(0, action.index),
                    ...items.slice(action.index + 1)
                ];
            case "delete".toUpperCase():
                return deleteReducer(items, downgradeAction(action))
                    || items;
            case "update".toUpperCase():
                return updateReducer(items, downgradeAction(action))
                    || items;
            case "addOrUpdate".toUpperCase():
                return updateReducer(items, downgradeAction(action))
                    || items.concat(action.payload);
            default:
                return updateReducer(items, action)
                    || items;
        }
    };
    return (items = <T[]>null, action) => arrayReducer(innerReducer(items, action), action);
}

export function arrayFilterReducer<T>(
    itemReducer: Reducer<T>,
    arrReducer: Reducer<T[]> = Fn.I,
    key?, filter?: ((item: T, action: AnyAction) => boolean) | string
): Reducer<T[]> {
    return filterReducer(arrayReducer(itemReducer, arrReducer, filter), key, []);
}
