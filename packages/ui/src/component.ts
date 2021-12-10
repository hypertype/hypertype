import {html, render} from "uhtml";
import {Observable, ReplaySubject, Subject, takeUntil} from "@hypertype/core";
import {UI} from "./ui";
import {importStyle} from "./import-styles";

const definitions: Function[] = [];

export function defineComponents() {
  while (definitions.length) {
    definitions.pop()();
  }
}

export const propertySymbol = Symbol('property');

export const property: any = () => (target: any, key: string, properties) => {
  const attr = key.substring(0, key.length - 1).replace(/[A-Z]/g, ch => `-${ch}`).toLowerCase();
  const getSubject = instance => instance[key + 'Subject$'] || (instance[key + 'Subject$'] = new ReplaySubject(1));
  if (!target.constructor[propertySymbol]) {
    target.constructor[propertySymbol] = {};
  }
  target.constructor[propertySymbol][attr] = instance => {
    const subject = getSubject(instance);
    return {
      get(): any {
        return instance[attr];
      },
      set(value): any {
        instance[attr] = value;
        subject.next(value);
      },
      enumerable: true
    }
  };
  // if (delete this[key]) {
  Object.defineProperty(target, key, {
    get(): any {
      return getSubject(this).asObservable();
    }
  })
  // }
};

export function Component(info: {
  name: string,
  // observedAttributes?: string[],
  // booleanAttributes?: string[],
  // attributes?: string[],
  template: (html, state, events) => any,
  style?: string
}) {
  return (target) => {
    let Id = 0;
    if (info.style)
      importStyle(info.style, target.name);

    class ProxyHTML extends HTMLElement {

      constructor() {
        super();
        if (target[propertySymbol]) {
          for (let key in target[propertySymbol]) {
            this[key] = this.hasAttribute(key) ? this.getAttribute(key) : null;
          }
        }
        this.created();
      }


      static observedAttributes = Object.keys(target[propertySymbol] || {});
      // static booleanAttributes = info.booleanAttributes || [];
      handlerProxy: any;
      private component: ComponentExtended<any, any>;
      private _id = Id++;
      private eventHandlers = {};
      protected state;
      private html = (strings: TemplateStringsArray | string, ...args) => {
        if (typeof strings == "string") {
          // case of html('key')`<template>`
          return html.for(this, strings);
        }
        // case of html`<template>`
        if (Array.isArray(strings)) {
          return render(this, html(strings, ...args));
        }
        // case of html(object, 'key')`<template>`
        return html.for(strings, args.join(','));
      }

      renderState(state) {
        info.template.call(this, this.html, state, this.handlerProxy);
        this.component.Render$.next();
      }

      created() {
        // const dependencies = Reflector.paramTypes(target).map(type => Container.get(type));
        this.component = UI.container.get(target);//new target(...dependencies);
        if (target[propertySymbol]) {
          for (let key in target[propertySymbol]) {
            const desrc = target[propertySymbol][key](this.component);
            desrc.set(this[key] || this.getAttribute(key));
            delete this[key];
            Object.defineProperty(this, key, desrc);
          }
        }
        // const htmlDefault = this.html.bind(this);
        // this.html = (strings: string[] | string, ...args) => {
        //   if (typeof strings == "string") {
        //     return render(this, strings);
        //   }
        //   if (Array.isArray(strings)) {
        //     return htmlDefault(strings, ...args);
        //   }
        //   return render(strings, args.join(','));
        // }
        // this.component.element = this;
        // this.component.element = this;
        this.component['id'] = this._id;
        this.handlerProxy = new Proxy({}, {
          get: (target, key) => {
            return this.getEventHandler(key);
          }
        });
        // @ts-ignore

        const children = [].slice.call(this.children) as (HTMLElement | SVGElement)[];
        if (children.length)
          this.component._injectedContent$.next(children);
        this.component._injectedContent$.complete();
        // this.component.created();
      }

      connectedCallback() {
        this.component._elementSubject$.next(this);
        this.component.State$.pipe(
          takeUntil(this.component._disconnect$.asObservable())
        ).subscribe(state => {
          this.renderState(state);
        });
        this.component.Actions$.pipe(
          takeUntil(this.component._disconnect$.asObservable())
        ).subscribe();
      }

      unsubscriber = unsubscr => this.component._disconnect$.subscribe(unsubscr);

      getEventHandler = type => mapping => {
        const key = `${type}.${mapping}`;
        if (key in this.eventHandlers)
          return this.eventHandlers[key];
        const listener = event => {
          event.preventDefault();
          const directHandler = this.component.Events && this.component.Events[type];
          if (directHandler)
            directHandler(mapping(event));
          this.component._eventsSubject$.next({
            args: mapping(event),
            type: type
          });
          return false;
        };
        return (this.eventHandlers[key] = [listener, false, this.unsubscriber]);
      };

      attributeChangedCallback(name: string, prev: string, curr: string) {
        if (!this.component)
          return;
        if (this.component.constructor[propertySymbol] && this.component.constructor[propertySymbol][name]) {
          this.component.constructor[propertySymbol][name](this.component).set(curr)
        }
      }

      removeEventListeners() {
        for (let eventHandlersKey in this.eventHandlers) {
          this.eventHandlers[eventHandlersKey] = null;
        }
        try {
          this.renderState(this.state);
        } catch (e) {
          // hide events because state maybe empty
        }
      }

      disconnectedCallback() {
        this.component._disconnect$.next();
        // this.removeEventListeners();
      }
    };

    if (UI.container) {
      customElements.define(info.name, ProxyHTML);
    } else {
      definitions.push(() => customElements.define(info.name, ProxyHTML));
    }
  }
}

interface ComponentExtended<TState, TEvents> {
  _disconnect$: ReplaySubject<void>;
  element: HTMLElement;
  _eventsSubject$: Subject<{ args: any; type: string }>;
  _elementSubject$: Subject<HTMLElement>;
  _injectedContent$: Subject<(HTMLElement | SVGElement)[]>
  State$: Observable<TState>;
  Actions$: Observable<{ type: string; payload?: any }>;
  Events: TEvents;
  Render$: Subject<any>;

  Render(html, state: TState, events);

  created();

  // element: HTMLElement;

  select<E extends HTMLElement = HTMLElement>(selectors: string): Observable<E | null>;
}

export type IEventHandler<TEvents> = {
  [K in keyof TEvents]: (Event) => void
};

