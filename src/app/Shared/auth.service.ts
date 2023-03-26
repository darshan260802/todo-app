import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

interface User {
  name?: string;
  email: string;
  password: string;
}

interface SavedUser {
  name: string;
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL: string = 'https://dark-gray-blackbuck-fez.cyclic.app/transform';
  JWT_SECRET: string = 'TODO_PLUS_DARSHAN';
  loading: BehaviorSubject<boolean>;
  currentUser: SavedUser = {
    uid: '',
    name: '',
    email: '',
  };

  constructor(
    private http: HttpClient,
    private auth: Auth,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService
  ) {
    this.loading = new BehaviorSubject<boolean>(false);
  }

  async signup(
    { email, name, password }: User,
    remember: boolean
  ): Promise<Observable<boolean>> {
    this.loading.next(true);
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        this.currentUser['uid'] = response.user.uid;
        this.currentUser['name'] = name ?? 'Guest';
        this.currentUser['email'] = email;
        const body = {
          payload: {
            ...this.currentUser,
          },
          secret: this.JWT_SECRET,
        };
        this.http
          .post(this.BASE_URL + '/encrypt', body)
          .subscribe((token) => {
            if(remember){
              localStorage.setItem('authToken', token as string);
            }else{
              sessionStorage.setItem('authToken', token as string);
            }
            this.loading.next(false);
          });
          this.alertService.open(`Welcome To The Family ${name}`,{
            label: "Hurray",
            status: TuiNotification.Success,
            autoClose: 4000,
            hasCloseButton: true,
            hasIcon: true
          }).subscribe()
      })
      .catch((error) => {
        const errorMessage = (error['code'] as string).includes(
          'email-already-in-use'
        )
          ? 'User With This Email Already Exists'
          : (error['code'] as string).split('/')[1].toUpperCase();

          this.alertService.open(errorMessage,{
            label: "Auth Error",
            status: TuiNotification.Error,
            autoClose: 4000,
            hasCloseButton: true,
            hasIcon: true
          }).subscribe()

        this.loading.next(false);
      });

    return this.loading.asObservable();
  }
}