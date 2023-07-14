import { TestBed } from '@angular/core/testing';

import { AppMessageService } from './app-message.service';

describe('AppMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppMessageService = TestBed.get(AppMessageService);
    expect(service).toBeTruthy();
  });
});
