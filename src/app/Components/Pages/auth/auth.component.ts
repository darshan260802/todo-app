import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tuiPure } from '@taiga-ui/cdk';
import { TuiDurationOptions, tuiFadeIn, tuiHeightCollapse } from '@taiga-ui/core';
import { AuthService } from 'src/app/Shared/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [tuiHeightCollapse, tuiFadeIn],
})
export class AuthComponent {
  isLoading:boolean = false;
  
  constructor(private fb:FormBuilder, private authProvider:AuthService) {}


  

  UserForm = this.fb.group({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl(false),
    isSignup: new FormControl(false),
  });


  // Animation Control
  @tuiPure
    getAnimation(duration: number): TuiDurationOptions {
        return {value: '', params: {duration}};
    }

  // handleSubmit
  async handleSubmit(){
    if(this.UserForm.get('isSignup')?.value){
      const user = {
        name: this.UserForm.get('name')?.value as string ,
        email: this.UserForm.get('email')?.value as string ,
        password: this.UserForm.get('password')?.value as string ,
      }

      if(Object.values(user).filter(data => !data?.length).length){
        
        return;
      }
      
      await this.authProvider.signup(user, this.UserForm.get('remember')?.value as boolean).then(res => {
        res.subscribe(loadingStatus => {
          this.isLoading = loadingStatus;
        })
      })
    }
  }
}
