import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';
@Directive({
    selector: '[node_position]'
})
export class PositionDirective {
    constructor(private el: ElementRef) { }

    @Input('node_position') node: any;

    @HostListener('mouseup') onMouseUp() {
        this.setPosition();
    }

    private setPosition() {
        this.node.metadata['xloc'] = this.el.nativeElement.offsetLeft;
        this.node.metadata['yloc'] = this.el.nativeElement.offsetTop;
    }
}
