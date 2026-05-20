import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
})
export class CodeSnippetComponent {
  @Input() code = '';
  open = false;
}
