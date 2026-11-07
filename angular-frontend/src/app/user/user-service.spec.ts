import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService, USERS_API_URL, CreateUserRequest, UserResponse } from './user-service';

describe('UH-37 UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and define the base API URL constant', () => {
    expect(service).toBeTruthy();
    expect(service.apiUrl).toBe('https://kocha-tracks.onrender.com/api/v1/users');
    expect(USERS_API_URL).toBe('https://kocha-tracks.onrender.com/api/v1/users');
  });

  it('should send a POST request with the user payload to the API URL', () => {
    const payload: CreateUserRequest = {
      username: 'eduardo_qa',
      email: 'eduardo@example.com',
      password: 'password123',
    };

    const mockResponse: UserResponse = {
      id: 1,
      username: 'eduardo_qa',
      role: 'USER',
    };

    let actualResponse: UserResponse | undefined;
    service.createUser(payload).subscribe((res) => {
      actualResponse = res;
    });

    const req = httpMock.expectOne(USERS_API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
    expect(actualResponse).toEqual(mockResponse);
  });
});