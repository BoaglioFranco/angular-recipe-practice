import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  private isOpen: boolean = false;

  constructor(private elRef : ElementRef, private renderer: Renderer2) { }

  @HostListener('click') 
  click(){
    if(!this.isOpen){
      this.renderer.addClass(this.elRef.nativeElement, 'open');
    }
    else{
      this.renderer.removeClass(this.elRef.nativeElement, 'open');
    }
    this.isOpen = !this.isOpen;
  }

}
