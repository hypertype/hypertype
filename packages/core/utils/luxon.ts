import {DateTime} from 'luxon';

DateTime.prototype.equals = function (other) {
  return (
    this.isValid &&
    other.isValid &&
    this.valueOf() === other.valueOf()
  );
}

export {DateTime};
export {Duration, Interval, Settings} from 'luxon';

