import { ComponentFactoryResolver, Directive, forwardRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputFieldComponent } from '../components/input-field/input-field.component';
import { OfficeService } from '../services/office.service';

@Directive({
    selector: '[appWmfield]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WmfieldDirective),
        multi: true
    }]
})
export class WmfieldDirective implements ControlValueAccessor, OnInit {
    @Input() label: string;
    @Input() control: FormControl;
    @Input() maxlength: number;

    private component;
    private value: string;

    private changed = new Array<(value: string) => void>();

    constructor(private resolver: ComponentFactoryResolver,
                private container: ViewContainerRef,
                private office: OfficeService) {

    }

    ngOnInit(): void {
        const factory = this.resolver.resolveComponentFactory<any>(InputFieldComponent);
        this.component = this.container.createComponent(factory);
        this.component.instance.name = this.label;
        this.component.instance.value = this.control.value;
        this.component.instance.maxlength = this.maxlength;
        this.component.instance.changed.subscribe(this.onChange.bind(this));
    }

    onChange(value: any): void {
        const data = [{ title: this.label, text: value }];
        this.office.updateContentControl(data).then(() => {
            this.propagateChange(value);
        });
    }

    writeValue(val: any): void {
        this.value = val;
    }

    registerOnChange(fn: any): void {
        this.changed.push(fn);
    }

    registerOnTouched(fn: any): void {}

    propagateChange(value: string): void {
        this.changed.forEach(f => {
            f(value);
        });
    }
}
