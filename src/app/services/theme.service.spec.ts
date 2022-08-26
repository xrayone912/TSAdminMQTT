/* tslint:disable:no-unused-variable */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { ThemeService } from './theme.service';

describe('Service: Theme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService],
      imports: [AppModule]
    });
  });

  it('should ...', inject([ThemeService], (service: ThemeService) => {
    expect(service).toBeTruthy();
  }));
});
