import "./reflect";
import {Container} from "./container";

export function Injectable(multiple: boolean = false): (target) => void {
  return ((target, deps) => {
    deps = Reflect.getMetadata("design:paramtypes", target);
    if (Container.StaticDepsMap.has(target)) {
      const {deps: oldDeps} = Container.StaticDepsMap.get(target);
      oldDeps.forEach((d, i) => {
        if (d) deps[i] = d;
      })
    }
    Container.StaticDepsMap.set(target, {deps, multiple});
  }) as (target) => void;
}


export const Inject: (token) => ParameterDecorator = (injectionToken) => {
  return (target, deps, index) => {
    if (!Container.StaticDepsMap.has(target)) {
      Container.StaticDepsMap.set(target, {deps: [], multiple: false});
    }
    Container.StaticDepsMap.get(target).deps[index] = injectionToken;
  };
}
