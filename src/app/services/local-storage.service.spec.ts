import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    localStorage.removeItem('testKey');
    localStorage.removeItem('testListKey');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getValue(): should return empty string for undeclared key', () => {
    const result = service.getValue('testKey');
    expect(result).toEqual('');
  });

  it('getAsTypedList(): should return empty array for undeclared key', () => {
    const result = service.getAsTypedList('testListKey');
    expect(result).toEqual([]);
  });

  it('setValue(): should set the value into localstorage', () => {
    service.setValue('testKey', 'abc');
    const result = service.getValue('testKey');
    expect(result).toEqual('abc');
  });

  it('getAsTypedList(): should return a list of 2 items', () => {
    const list: Array<string> = ['value1', 'value2'];
    service.setValue('testListKey', JSON.stringify(list));
    const result = service.getAsTypedList<string>('testListKey');
    expect(result.length).toEqual(2);
  });

  it('clearEntry(): should remove the entry from localstorage', () => {
    service.setValue('testKey', 'abc');
    service.clearEntry('testKey');
    const result = service.getValue('testKey');
    expect(result).toEqual('');
  });
});
