import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {SpinnerService} from '../spinner.service';

@Component({
  selector: 'app-spinner',
  imports: [
    NgIf,
    MatProgressSpinner,
  ],
  templateUrl: './spinner.component.html',
  standalone: true,
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  isLoading = false;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerService.loading$.subscribe(loading => {
      this.isLoading = loading;
    })
  }
}
