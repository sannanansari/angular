import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Pipe({ name: 'pureFilter', standalone: true, pure: true })
export class PureFilterPipe implements PipeTransform {
  transform(items: string[], filter: string): string[] {
    PipesComponent.pureRuns++;
    if (!filter) return items;
    return items.filter(i => i.toLowerCase().includes(filter.toLowerCase()));
  }
}

@Pipe({ name: 'impureFilter', standalone: true, pure: false })
export class ImpureFilterPipe implements PipeTransform {
  transform(items: string[], filter: string): string[] {
    PipesComponent.impureRuns++;
    if (!filter) return items;
    return items.filter(i => i.toLowerCase().includes(filter.toLowerCase()));
  }
}

@Component({
  selector: 'app-pipes',
  standalone: true,
  imports: [CommonModule, FormsModule, PureFilterPipe, ImpureFilterPipe, CodeSnippetComponent],
  templateUrl: './pipes.component.html',
  styleUrl: './pipes.component.scss',
})
export class PipesComponent {
  static pureRuns = 0;
  static impureRuns = 0;

  filterText = '';
  items: string[] = ['Angular', 'RxJS', 'TypeScript', 'Signals', 'Zone.js', 'NgRx'];

  get pureRuns() { return PipesComponent.pureRuns; }
  get impureRuns() { return PipesComponent.impureRuns; }

  addItem(): void {
    const words = ['Webpack', 'Vite', 'ESLint', 'Jest', 'Karma', 'Jasmine'];
    const word = words[Math.floor(Math.random() * words.length)] + ' ' + Date.now() % 1000;
    this.items = [...this.items, word];
  }

  mutateArray(): void {
    this.items.push('mutated-' + Date.now() % 1000);
  }

  replaceArray(): void {
    this.items = [...this.items, 'replaced-' + Date.now() % 1000];
  }

  builtinPipes = [
    { name: 'date',       example: "today | date:'dd MMM'",   output: '19 May' },
    { name: 'currency',   example: "9 | currency:'USD'",       output: '$9.00' },
    { name: 'uppercase',  example: "'hello' | uppercase",      output: 'HELLO' },
    { name: 'json',       example: 'obj | json',               output: '{ "key": "val" }' },
    { name: 'async',      example: 'obs$ | async',             output: 'auto-subscribes' },
    { name: 'slice',      example: "[1,2,3] | slice:0:2",      output: '[1, 2]' },
    { name: 'titlecase',  example: "'hello world' | titlecase", output: 'Hello World' },
    { name: 'percent',    example: '0.75 | percent',           output: '75%' },
  ];

  code = `// Pure pipe — only runs when input reference changes
// Angular can safely memoize the result
@Pipe({ name: 'filterPure', pure: true })  // pure: true is the default
export class FilterPurePipe implements PipeTransform {
  transform(items: string[], query: string): string[] {
    return items.filter(i => i.includes(query));
  }
}

// Impure pipe — runs on EVERY change detection cycle
// Needed when you want to detect array mutations (push/splice)
@Pipe({ name: 'filterImpure', pure: false })
export class FilterImpurePipe implements PipeTransform {
  transform(items: string[], query: string): string[] {
    return items.filter(i => i.includes(query));
  }
}

// In template — syntax is the same for both
// {{ items | filterPure : searchText }}
// {{ items | filterImpure : searchText }}

// Performance tip:
// Prefer pure pipes + immutable data (spread operator)
// items = [...items, newItem]; // triggers pure pipe
// items.push(newItem);         // does NOT trigger pure pipe`;
}
