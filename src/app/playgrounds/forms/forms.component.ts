import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CodeSnippetComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent implements OnInit {
  reactiveForm!: FormGroup;
  submitted: unknown = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reactiveForm = this.fb.group({
      name:  ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role:  ['', Validators.required],
    });
  }

  get rf() {
    return this.reactiveForm.controls;
  }

  onTdSubmit(form: any): void {
    if (form.invalid) return;
    this.submitted = { source: 'template-driven', ...form.value };
    form.resetForm();
  }

  onReactiveSubmit(): void {
    if (this.reactiveForm.invalid) return;
    this.submitted = { source: 'reactive', ...this.reactiveForm.value };
    this.reactiveForm.reset();
  }

  code = `// Template Driven — logic in template
// Angular creates FormGroup implicitly
@Component({
  imports: [FormsModule]
})
export class TdFormComponent {
  onSubmit(form: NgForm): void {
    console.log(form.value); // { name, email, role }
  }
}
// Template:
// <form #form="ngForm" (ngSubmit)="onSubmit(form)">
//   <input name="email" ngModel required email />
// </form>

// Reactive — logic in component class
// You control FormGroup explicitly
@Component({
  imports: [ReactiveFormsModule]
})
export class ReactiveFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:  ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Subscribe to value changes programmatically
  ngOnInit(): void {
    this.form.get('email')!.valueChanges
      .pipe(debounceTime(300))
      .subscribe(val => this.checkEmail(val));
  }
}`;
}
