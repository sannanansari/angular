import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, concatMap, exhaustMap, delay } from 'rxjs/operators';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

interface LogEntry { id: number; time: string; msg: string; type: string; }

@Component({
  selector: 'app-rxjs',
  standalone: true,
  imports: [CommonModule, CodeSnippetComponent],
  templateUrl: './rxjs.component.html',
  styleUrl: './rxjs.component.scss',
})
export class RxjsComponent {
  activeOp: string | null = null;
  private logMap: Record<string, LogEntry[]> = {};
  private idCounter = 0;

  private subjects: Record<string, Subject<number>> = {
    switchMap:   new Subject(),
    mergeMap:    new Subject(),
    concatMap:   new Subject(),
    exhaustMap:  new Subject(),
  };

  operators = [
    {
      key:     'switchMap',
      name:    'switchMap',
      desc:    'Cancels previous, starts new',
      useCase: 'Search autocomplete, route param changes',
    },
    {
      key:     'mergeMap',
      name:    'mergeMap',
      desc:    'Runs all in parallel',
      useCase: 'Parallel file uploads, independent requests',
    },
    {
      key:     'concatMap',
      name:    'concatMap',
      desc:    'Queues and runs one by one',
      useCase: 'Sequential operations, ordered writes',
    },
    {
      key:     'exhaustMap',
      name:    'exhaustMap',
      desc:    'Ignores new until current finishes',
      useCase: 'Login button, form submit (prevent double submit)',
    },
  ];

  constructor() {
    this.setupSwitchMap();
    this.setupMergeMap();
    this.setupConcatMap();
    this.setupExhaustMap();
  }

  getLogs(key: string): LogEntry[] {
    return this.logMap[key] ?? [];
  }

  search(key: string): void {
    this.activeOp = key;
    this.subjects[key].next(Date.now());
  }

  private setupSwitchMap(): void {
    this.subjects['switchMap'].pipe(
      switchMap(id => {
        this.log('switchMap', 'start',  `request #${id % 1000} started`);
        const prev = this.getLogs('switchMap').find(l => l.type === 'start');
        if (prev) this.log('switchMap', 'cancel', `previous request cancelled`);
        return of(id).pipe(delay(800));
      })
    ).subscribe(id => {
      this.log('switchMap', 'result', `result #${id % 1000} received`);
    });
  }

  private setupMergeMap(): void {
    this.subjects['mergeMap'].pipe(
      mergeMap(id => {
        this.log('mergeMap', 'start', `request #${id % 1000} started (parallel)`);
        return of(id).pipe(delay(800));
      })
    ).subscribe(id => {
      this.log('mergeMap', 'result', `result #${id % 1000} received`);
    });
  }

  private setupConcatMap(): void {
    this.subjects['concatMap'].pipe(
      concatMap(id => {
        this.log('concatMap', 'start', `request #${id % 1000} queued`);
        return of(id).pipe(delay(800));
      })
    ).subscribe(id => {
      this.log('concatMap', 'result', `result #${id % 1000} done`);
    });
  }

  private setupExhaustMap(): void {
    this.subjects['exhaustMap'].pipe(
      exhaustMap(id => {
        this.log('exhaustMap', 'start', `request #${id % 1000} started`);
        return of(id).pipe(delay(800));
      })
    ).subscribe(id => {
      this.log('exhaustMap', 'result', `result #${id % 1000} done`);
    });
  }

  private log(key: string, type: string, msg: string): void {
    if (!this.logMap[key]) this.logMap[key] = [];
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logMap[key].unshift({ id: this.idCounter++, time, msg, type });
    if (this.logMap[key].length > 8) this.logMap[key].pop();
  }

  code = `// Search field — use switchMap
// Cancels previous HTTP request when user types again
searchControl.valueChanges.pipe(
  debounceTime(300),
  switchMap(query => this.api.search(query))
).subscribe(results => this.results = results);

// File upload — use mergeMap
// All uploads run in parallel
filesToUpload$.pipe(
  mergeMap(file => this.api.upload(file))
).subscribe(result => this.results.push(result));

// Sequential writes — use concatMap
// Each write waits for the previous to complete
actionsQueue$.pipe(
  concatMap(action => this.api.save(action))
).subscribe();

// Form submit — use exhaustMap
// Ignores button clicks while request is in flight
submitClick$.pipe(
  exhaustMap(() => this.api.submit(this.form.value))
).subscribe(res => this.onSuccess(res));`;
}
