import { Component, OnInit } from '@angular/core';
import { AuthService } from './Shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'note-plus';
  constructor(private authService:AuthService){
  
  }

  ngOnInit(): void {
      this.authService.tryAutoLogin();
  }
  
}
