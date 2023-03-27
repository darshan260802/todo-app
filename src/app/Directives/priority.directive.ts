import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[usePriority]',
})
export class PriorityDirective implements OnChanges {
  @Input() priority: 'low' | 'medium' | 'high' = 'low';
  colors = {
    low: 'green',
    medium: 'gold',
    high: 'red',
  };

  constructor(private elmRef: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.setHover();
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.setBasic();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.elmRef.nativeElement.style.transition = 'all 500ms ease';
    this.setBasic();
  }

  setBasic() {
    this.elmRef.nativeElement.style.border = '2px dashed silver';
    this.elmRef.nativeElement.style.borderTop = '5px solid';
    this.elmRef.nativeElement.style.borderTopColor = this.colors[this.priority];
  }
  setHover() {
    this.elmRef.nativeElement.style.border =
      '2px solid ' + this.colors[this.priority];
    this.elmRef.nativeElement.style.borderTop = '5px solid';
    this.elmRef.nativeElement.style.borderTopColor = this.colors[this.priority];
  }
}
