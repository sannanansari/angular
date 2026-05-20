import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionComponent } from './playgrounds/change-detection/change-detection.component';
import { LifecycleComponent } from './playgrounds/lifecycle/lifecycle.component';
import { RxjsComponent } from './playgrounds/rxjs/rxjs.component';
import { DiComponent } from './playgrounds/di/di.component';
import { FormsComponent } from './playgrounds/forms/forms.component';
import { PipesComponent } from './playgrounds/pipes/pipes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChangeDetectionComponent,
    LifecycleComponent,
    RxjsComponent,
    DiComponent,
    FormsComponent,
    PipesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  activeTab = 'cd';

  tabs = [
    { key: 'cd',        num: '01', label: 'Change Detection' },
    { key: 'lifecycle', num: '02', label: 'Lifecycle Hooks' },
    { key: 'rxjs',      num: '03', label: 'RxJS Operators' },
    { key: 'di',        num: '04', label: 'DI Tree' },
    { key: 'forms',     num: '05', label: 'Forms' },
    { key: 'pipes',     num: '06', label: 'Pipes' },
  ];
}
