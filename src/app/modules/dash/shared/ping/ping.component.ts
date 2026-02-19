import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { ToastrsService } from '../../services/toater.service';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css'],
})
export class PingComponent {
  @Input() ip: string = '';
  pingResult: any = null;
  isPinging: boolean = false;
  packetStats: any = null;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private toastrsService: ToastrsService,
  ) {}

  ngOnInit() {
    if (this.ip) {
      this.ping();
    }
  }

  ping() {
    this.isPinging = true;
    this.pingResult = null;

    this.httpService
      .action(this.api.subscribers.ping(this.ip), {}, 'pingAction')
      .subscribe({
        next: (res: any) => {
          this.isPinging = false;
          if (res.success) {
            this.pingResult = res.data;
            this.extractPacketStats();
            // Show success only if status is Pingable/Reachable
            if (
              this.pingResult?.ping?.status === 'Pingable' ||
              this.pingResult?.ping?.status === 'Reachable'
            ) {
              this.toastrsService.Showsuccess('Ping completed successfully');
            }
          } else {
            this.toastrsService.Showerror(res.msg || res.msg || 'Ping failed');
            this.pingResult = res.data || {
              ping: { status: 'Error', error: res.msg || res.msg },
            };
            this.extractPacketStats();
          }
        },
        error: (err: any) => {
          this.isPinging = false;
          this.toastrsService.Showerror('Ping failed');
          this.pingResult = {
            ping: { status: 'Error', error: 'Connection error' },
          };
        },
      });
  }

  extractPacketStats() {
    // Use statistics from response if available
    if (this.pingResult?.ping?.statistics) {
      this.packetStats = {
        sent: this.pingResult.ping.statistics.sent,
        received: this.pingResult.ping.statistics.received,
        lost: this.pingResult.ping.statistics.lost,
        lossPercent: this.pingResult.ping.statistics.loss_percent,
      };
    } else if (this.pingResult?.ping?.raw_output) {
      // Fallback to regex parsing
      const output = this.pingResult.ping.raw_output;
      const packetMatch = output.match(
        /Packets: Sent = (\d+), Received = (\d+), Lost = (\d+) \((\d+)% loss\)/,
      );

      if (packetMatch) {
        this.packetStats = {
          sent: parseInt(packetMatch[1]),
          received: parseInt(packetMatch[2]),
          lost: parseInt(packetMatch[3]),
          lossPercent: parseInt(packetMatch[4]),
        };
      }
    }
  }
}
