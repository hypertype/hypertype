import "reflect-metadata";
import {Container} from "./container";

export function Injectable(multiple: boolean = false): (target) => void {
    return ((target, deps) => {
        if ('getMetadata' in Reflect) {
            deps = Reflect['getMetadata']("design:paramtypes", target);
        }
        if (Container.StaticDepsMap.has(target)){
            const {deps: oldDeps} = Container.StaticDepsMap.get(target);
            oldDeps.forEach((d,i)=>{
                if (d) deps[i] = d;
            })
        }
        Container.StaticDepsMap.set(target, {deps, multiple});
    }) as (target) => void;
}


export const Inject: (token) => ParameterDecorator = (injectionToken) => {
    return (target, deps, index) => {
        if (!Container.StaticDepsMap.has(target)){
            Container.StaticDepsMap.set(target, {deps: [], multiple: false});
        }
        Container.StaticDepsMap.get(target).deps[index] = injectionToken;
    };
}

//
// Object.assign(Reflect, {
//     decorate: (decoratorsAndDeps: any[], target, key, desc) => {
//         if (key) {
//             decoratorsAndDeps[0](target, key, desc);
//         } else {
//             const deps = decoratorsAndDeps.pop();
//             decoratorsAndDeps.reverse().forEach(decorator => decorator(target, deps));
//             return target;
//         }
//     },
//     metadata: (kind, deps) => {
//         if (kind == "design:paramtypes") {
//             return deps;
//         }
//     }
// });
