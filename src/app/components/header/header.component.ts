import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network/network.service';
import { ObservableService } from 'src/app/services/observable/observable.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title: string = '';

  // number
  status: number;

  constructor(
    private observableService: ObservableService,
    private networkService: NetworkService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone

  ) {
  }

  async ngOnInit() {
    this.status = await this.networkService.getStatus();

    this.networkService._statusSelelected.subscribe(status => {
      this.status = status;

      this.ngZone.run(_ => {
        this.cdr.detectChanges();
      })

    });
  }

}
