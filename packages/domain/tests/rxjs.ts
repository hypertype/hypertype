import {first, Subject, ReplaySubject} from "@hypertype/core";

const subject = new Subject();

// subject.asObservable().pipe(
// ).subscribe(a => console.log(a,'a'));

function send(n) {

    subject.asObservable().pipe(
        first()
    ).subscribe(a => console.log(a));

    setTimeout(() => subject.next(n), 300);
}

setTimeout(() => send(1), 0);
setTimeout(() => send(2), 200);
setTimeout(() => send(3), 400);
