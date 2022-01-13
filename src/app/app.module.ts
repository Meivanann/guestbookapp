import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwPaginationModule } from 'jw-angular-pagination';
import {
  MatProgressBarModule,
  MatCardModule,
  
  MatInputModule,
  MatNativeDateModule,
  MatButtonModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatSelectModule,
  MatIconModule,
  MatTooltipModule
} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './user/user.component';
import { FlimsComponent } from './flims/flims.component';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './user/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {RatingModule} from "ngx-rating";
import { RegisterComponent } from './user/register/register.component';
import { MovieRegisterComponent } from './flims/movie-register/movie-register.component';
import { FlimViewComponent } from './flims/flim-list/flim-view/flim-view.component';
import { FlimListComponent } from './flims/flim-list/flim-list.component';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    FlimsComponent,
    CommentsComponent,
    LoginComponent,
    RegisterComponent,
    MovieRegisterComponent,
    FlimViewComponent,
    FlimListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppRoutingModule,
    MatSelectModule,
    RatingModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    HttpClientModule,
    MatCheckboxModule,
    JwPaginationModule,
    MatTooltipModule,
    MatIconModule,
    MatFileUploadModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
