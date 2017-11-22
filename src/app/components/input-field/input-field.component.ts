import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent {
    @Input() name: string;
    @Input() value: string;
    @Input() maxlength: number;

    @Output() changed = new EventEmitter<string>();

    constructor() {}

    onChange(event): void {
        this.value = event;
        this.changed.emit(this.value);
    }
}
