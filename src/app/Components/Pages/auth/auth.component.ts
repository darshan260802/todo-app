import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { tuiPure } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiDurationOptions,
  tuiFadeIn,
  tuiHeightCollapse,
  TuiNotification,
} from '@taiga-ui/core';
import { AuthService } from 'src/app/Shared/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [tuiHeightCollapse, tuiFadeIn],
})
export class AuthComponent {
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authProvider: AuthService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService
  ) {}

  UserForm = this.fb.group({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl(true),
    isSignup: new FormControl(false),
  });

  // Animation Control
  @tuiPure
  getAnimation(duration: number): TuiDurationOptions {
    return { value: '', params: { duration } };
  }

  // handleSubmit
  async handleSubmit() {
    if (this.UserForm.get('isSignup')?.value) {
      const user = {
        name: this.UserForm.get('name')?.value as string,
        email: this.UserForm.get('email')?.value as string,
        password: this.UserForm.get('password')?.value as string,
      };

      if (Object.values(user).filter((data) => !data?.length).length) {
        Object.keys(user).forEach((key: string) => {
          // @ts-ignore
          if (!user[key]) {
            this.alertService
              .open(`${key} is required`, {
                label: 'Missing',
                status: TuiNotification.Warning,
                autoClose: 3500,
                hasCloseButton: true,
                hasIcon: true,
              })
              .subscribe();
          }
        });
        return;
      }

      await this.authProvider
        .signup(user, this.UserForm.get('remember')?.value as boolean)
        .then((res) => {
          res.subscribe((loadingStatus) => {
            this.isLoading = loadingStatus;
            if(loadingStatus === false){
              this.router.navigate(['/workspaces']);
            }
          });
        });

      this.router.navigate(['/workspaces']);
    } else {
      const user = {
        email: this.UserForm.get('email')?.value as string,
        password: this.UserForm.get('password')?.value as string,
      };

      if (Object.values(user).filter((data) => !data?.length).length) {
        Object.keys(user).forEach((key: string) => {
          // @ts-ignore
          if (!user[key]) {
            this.alertService
              .open(`${key} is required`, {
                label: 'Missing',
                status: TuiNotification.Warning,
                autoClose: 3500,
                hasCloseButton: true,
                hasIcon: true,
              })
              .subscribe();
          }
        });
        return;
      }

      await this.authProvider
        .login(user, this.UserForm.get('remember')?.value as boolean)
        .then((res) => {
          res.subscribe((loadingStatus) => {
            this.isLoading = loadingStatus;
            if(loadingStatus === false){
              this.router.navigate(['/workspaces']);
            }
          });
        });
        
    }
  }
}
