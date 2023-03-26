import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiButtonModule,
} from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/Partials/sidebar/sidebar.component';
import { AuthComponent } from './Components/Pages/auth/auth.component';
import { TuiElasticContainerModule, TuiIslandModule, TuiToggleModule } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiCheckboxBlockModule } from '@taiga-ui/kit';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {AuthService} from "./Shared/auth.service";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, SidebarComponent, AuthComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiButtonModule,
    TuiIslandModule,
    TuiElasticContainerModule,
    TuiAlertModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiCheckboxBlockModule,
    TuiToggleModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    HttpClientModule
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
