import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const INPUTFIELD_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputFieldComponent),
    multi: true
};

@Component({
    selector: 'app-input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.css'],
    providers: [ INPUTFIELD_CONTROL_VALUE_ACCESSOR ]
})
export class InputFieldComponent implements ControlValueAccessor {
    @Input() name: string;
    @Input() value: string;

    private changed = new Array<(value: string) => void>();

    constructor() {}

    writeValue(val: any) {
        debugger;
        this.value = val;
    }

    registerOnChange(fn: any) {
        debugger;
        this.changed.push(fn);
    }

    registerOnTouched(fn: any) {}

    onChange(event) {
        debugger;
        this.value = event;
        this.propagateChange(this.value);
    }

    propagateChange(value) {
        this.changed.forEach(f => f(value));
    }
}
