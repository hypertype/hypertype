
export class ValueEvent extends Event {
    private value: any;

    constructor(type, value) {
        super(type, {bubbles: false, cancelable: false});
        this.value = value;
    }

}