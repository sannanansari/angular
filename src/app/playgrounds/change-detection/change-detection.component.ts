import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'app-change-detection',
  standalone: true,
  imports: [CommonModule, CodeSnippetComponent],
  templateUrl: './change-detection.component.html',
  styleUrl: './change-detection.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChangeDetectionComponent {
  defaultCount = 0;
  defaultRenders = 0;
  onpushCount = 0;
  onpushRenders = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  incrementDefault(): void {
    this.defaultCount++;
    this.defaultRenders++;
  }

  incrementOnpush(): void {
    this.onpushCount++;
    this.onpushRenders++;
    this.cdr.markForCheck();
  }

  triggerGlobalEvent(): void {
    this.defaultRenders++;
    setTimeout(() => {}, 0);
  }

  code = `// Default — re-renders on every browser event
@Component({
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultComponent {
  @Input() count = 0;
}

// OnPush — only re-renders when:
// 1. @Input reference changes
// 2. An event fires from this component
// 3. An async pipe emits a new value
// 4. markForCheck() is called manually
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushComponent {
  @Input() count = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  forceUpdate(): void {
    this.cdr.markForCheck();
  }
}`;
}
