import {Component, OnInit} from '@angular/core';
import {animate, group, keyframes, style, transition, trigger} from '@angular/animations';
import {interval, of, Subject} from 'rxjs';
import {concatMap, delayWhen} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('pollChange', [
      transition(':increment', group([
        style({ color: 'green', fontSize: '50px' }),
        animate('0.8s ease-out', style('*'))
      ]))
    ]),
    trigger('lastCheese', [
      transition(':enter', [
        animate('800ms', keyframes([
          style({opacity: 0, transform: 'scale(1.0) translate3d(0,0,0)'}),
          style({opacity: 0.9, transform: 'scale(1.5)'}),
          style({opacity: 1, transform: 'scale(1.25)'}),
          style({opacity: 1, transform: 'scale(1.0) translate3d(0,0,0)'}),
        ]))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  public votes = {
    asiago: 0,
    cheddar: 0,
    brie: 0
  };

  private updateSubject = new Subject<string>();

  private updateObservable = this.updateSubject.asObservable();

  public processingUpdate = false;

  public lastCheese: string;

  public vote(cheese: string) {
    this.updateSubject.next(cheese);
  }

  ngOnInit(): void {
    this.updateObservable
    .pipe(concatMap(x => of(x)
    .pipe(delayWhen(() => this.processingUpdate ? interval(2000) : of(undefined)))))
    .subscribe((cheese: string) => {
      this.processingUpdate = true;
      this.lastCheese = undefined;

      setTimeout(() => {
        this.lastCheese = cheese;
        setTimeout(() => {
          this.votes[cheese]++;
        }, 1000);
        setTimeout(() => {
          this.processingUpdate = false;
        }, 1500);
      });
    });
  }
}
