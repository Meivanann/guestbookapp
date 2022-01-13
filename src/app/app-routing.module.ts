import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { MovieRegisterComponent } from './flims/movie-register/movie-register.component';
import { FlimListComponent } from './flims/flim-list/flim-list.component';
import { FlimViewComponent } from './flims/flim-list/flim-view/flim-view.component';
 
 
const routes: Routes = [
  // { path: 'information/:id', component: BikeInfoComponent },
  { path: '', component: LoginComponent },
  { path: 'userregister', component: RegisterComponent },
  { path: 'createmovie', component: MovieRegisterComponent },
  { path: 'movie_list', component: FlimListComponent },
  { path: 'movie_details/:slugname', component: FlimViewComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule { }
