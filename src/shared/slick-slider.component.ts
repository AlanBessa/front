import { Component, Input, ElementRef, AfterViewInit, AfterContentInit} from '@angular/core';
declare var jQuery: any;
import 'slick-carousel';

@Component({
    selector: 'slick-slider',
    template: `
        <ng-content></ng-content>
    `
})
export class SlickSliderComponent implements AfterContentInit{
    @Input() options: any;

    $element: any;

    defaultOptions: any = {
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            variableWidth: true,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        dots: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: false
                    }
                },
                {
                    breakpoint: 370,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false
                    }
                }
            ]
        };

    constructor(private el: ElementRef) {
    }

    ngAfterContentInit() {
        for (var key in this.options) {
            this.defaultOptions[key] = this.options[key];
        }

        this.$element = jQuery(this.el.nativeElement).slick(this.defaultOptions);
    }
}