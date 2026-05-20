import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

interface Scope { key: string; label: string; count: number; desc: string; provider: string; }

@Component({
  selector: 'app-di',
  standalone: true,
  imports: [CommonModule, CodeSnippetComponent],
  templateUrl: './di.component.html',
  styleUrl: './di.component.scss',
})
export class DiComponent {
  scopes: Scope[] = [
    {
      key:      'root',
      label:    'Root (singleton)',
      count:    0,
      desc:     'One instance. All components share the same counter.',
      provider: "providedIn: 'root'",
    },
    {
      key:      'module',
      label:    'Feature Module',
      count:    0,
      desc:     'Shared within the module only. Other modules get their own.',
      provider: 'providers: [CounterService] in NgModule',
    },
    {
      key:      'component',
      label:    'Component level',
      count:    0,
      desc:     'Fresh instance per component. Destroyed with the component.',
      provider: 'providers: [CounterService] in @Component',
    },
  ];

  increment(key: string): void {
    const scope = this.scopes.find(s => s.key === key);
    if (!scope) return;
    scope.count++;
    if (key === 'root') {
      this.scopes.filter(s => s.key === 'root').forEach(s => s.count = scope.count);
    }
  }

  reset(key: string): void {
    const scope = this.scopes.find(s => s.key === key);
    if (scope) scope.count = 0;
  }

  code = `// Root — singleton, one instance for the whole app
@Injectable({ providedIn: 'root' })
export class AuthService {}

// Module — shared within a feature module
@NgModule({
  providers: [CartService]  // new instance for this module
})
export class ShopModule {}

// Component — fresh instance per component
@Component({
  selector: 'app-counter',
  providers: [CounterService]  // destroyed when component is destroyed
})
export class CounterComponent {
  constructor(private counter: CounterService) {}
}

// How Angular resolves the injection:
// 1. Look in ElementInjector (component providers)
// 2. Walk up to parent component
// 3. Walk up to module
// 4. Walk up to root
// 5. NullInjector → throws error`;
}
