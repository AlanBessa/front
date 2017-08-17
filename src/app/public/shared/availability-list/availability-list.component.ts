import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { DayOfWeek } from "shared/AppEnums";

@Component({
  selector: 'availability-list-component',
  templateUrl: './availability-list.component.html',
  styleUrls: ['./availability-list.component.css']
})

export class AvailabilityListComponent extends AppComponentBase implements OnInit {

  public DayOfWeek: typeof DayOfWeek = DayOfWeek;

  public isOpen: boolean = false;

  _availability: any[];
  get availability(): any[] {
      return this._availability;
  }
  
  @Input('availability')
  set availability(value: any[]) {
      this._availability = value;
  }

  constructor(
    injector: Injector,
  )
  {
    super(injector);
  }

  ngOnInit() { }

  public openAvailability(): void {
    if(this.isOpen) {
      this.isOpen = false;
    }
    else {
      this.isOpen = true;
    }
  }
} 
