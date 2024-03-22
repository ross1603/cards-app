import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { MigrationComponent } from './migration/migration.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { CardComponent } from './card/card.component';
import { CollectionsComponent } from './collections/collections.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: "Home" },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'migration', component: MigrationComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, title: "Login" },
  { path: 'logout', component: LogoutComponent, title: "Logout" },
  { path: 'register', component: RegisterComponent, title: "Register" },
  { path: 'collections', component: CollectionsComponent, title: "Collections" },
  { path: 'collections/:id', component: CollectionsComponent, data: { collectionId: ':id' }, title: "Collections" },
  { path: 'collections/:id/:id2', component: CollectionsComponent, data: { focus: 'focus' }, title: "Collections" },
  { path: 'card/:id', component: CardComponent, title: "Card" },
  { path: '**', component: NotFoundComponent, title: "404" }
];