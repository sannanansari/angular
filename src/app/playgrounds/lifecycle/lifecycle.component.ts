import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

interface LogEntry {
  id: number;
  time: string;
  hook: string;
  type: string;
  msg: string;
}

@Component({
  selector: 'app-lifecycle',
  standalone: true,
  imports: [CommonModule, CodeSnippetComponent],
  templateUrl: './lifecycle.component.html',
  styleUrl: './lifecycle.component.scss',
})
export class LifecycleComponent {
  alive = false;
  inputValue = 'hello';
  logs: LogEntry[] = [];
  private idCounter = 0;

  hookDefs = [
    { name: 'constructor()',        when: 'Class instantiated. DI runs here. No DOM yet.' },
    { name: 'ngOnChanges()',        when: 'Before ngOnInit and after every @Input change.' },
    { name: 'ngOnInit()',           when: 'Once after first ngOnChanges. Safe for HTTP calls.' },
    { name: 'ngDoCheck()',          when: 'Every change detection cycle. Use with care.' },
    { name: 'ngAfterContentInit()', when: 'After ng-content projection is complete.' },
    { name: 'ngAfterViewInit()',    when: 'After component and child views are rendered.' },
    { name: 'ngAfterViewChecked()', when: 'After every check of the component view.' },
    { name: 'ngOnDestroy()',        when: 'Just before Angular destroys the component.' },
  ];

  spawnComponent(): void {
    this.alive = true;
    this.addLog('init',    'constructor()',         'DI resolved, class instance created');
    this.addLog('changes', 'ngOnChanges()',         `SimpleChange: inputValue → "${this.inputValue}"`);
    this.addLog('init',    'ngOnInit()',            'Component initialized, safe to fetch data');
    this.addLog('view',    'ngAfterContentInit()',  'ng-content projected');
    this.addLog('view',    'ngAfterViewInit()',      'DOM ready, child views rendered');
  }

  destroyComponent(): void {
    this.alive = false;
    this.addLog('destroy', 'ngOnDestroy()', 'Subscriptions unsubscribed, timers cleared');
  }

  changeInput(): void {
    if (!this.alive) return;
    const values = ['hello', 'world', 'angular', 'sannan', 'rxjs'];
    const next = values[Math.floor(Math.random() * values.length)];
    const prev = this.inputValue;
    this.inputValue = next;
    this.addLog('changes', 'ngOnChanges()', `SimpleChange: "${prev}" → "${next}"`);
    this.addLog('view',    'ngAfterViewChecked()', 'View re-checked after input change');
  }

  clearLog(): void {
    this.logs = [];
  }

  private addLog(type: string, hook: string, msg: string): void {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logs.unshift({ id: this.idCounter++, time, hook, type, msg });
    if (this.logs.length > 20) this.logs.pop();
  }

  code = `export class MyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: string = '';
  private subscription!: Subscription;

  constructor(private service: DataService) {
    // DI only — no side effects here
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const prev = changes['data'].previousValue;
      const curr = changes['data'].currentValue;
      console.log(\`data changed: \${prev} → \${curr}\`);
    }
  }

  ngOnInit(): void {
    // Safe place for HTTP calls and subscriptions
    this.subscription = this.service.data$.subscribe(d => {
      this.data = d;
    });
  }

  ngAfterViewInit(): void {
    // DOM is ready — safe to query elements
  }

  ngOnDestroy(): void {
    // Always clean up — prevent memory leaks
    this.subscription.unsubscribe();
  }
}`;
}
