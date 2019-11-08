import {TL} from '../template-literals';

export function tta(template) {
  const length = arguments.length;
  const args = [TL(template)];
  let i = 1;
  while (i < length)
    args.push(arguments[i++]);
  return args;
}
