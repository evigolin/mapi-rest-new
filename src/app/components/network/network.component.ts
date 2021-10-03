import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';

// import services
import { NetworkService } from 'src/app/services/network/network.service';

// import plugins
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
  status: number;

  constructor(
    private networkService: NetworkService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private translateService: TranslateService) { }

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