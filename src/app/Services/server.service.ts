import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserI, JwtResponseInterface, UbicationI, CreateUserI } from '../Models/User';
import { QuotePeticion } from '../Models/Frases';
import { CompletedTaskI, TaskI } from '../Models/Tasks';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  IP2 = '192.168.0.211:8080';
  IP = '192.168.43.145:8080';

  DATABASE = `http://${this.IP}/proyecto-redes/create-db`;
  URL_REGISTRO = `http://${this.IP}/proyecto-redes/create-user`;
  URL_UBICACION = `http://${this.IP}/proyecto-redes/create-ubicacion`;
  URL_AUTHUSER = `http://${this.IP}/proyecto-redes/valid-user`;
  URL_USERDATA = `http://${this.IP}/proyecto-redes/get-user/`;
  URL_USERSETTINGS = `http://${this.IP}/proyecto-redes/get-ubicacion/`;
  URL_EDITSETTINGS = `http://${this.IP}/proyecto-redes/edit-ubicacion`;
  URL_QUOTE = `http://${this.IP}/proyecto-redes/save-quote`;
  URL_QUOTES = `http://${this.IP}/proyecto-redes/get-quotes/`;
  URL_DELETEQUOTE = `http://${this.IP}/proyecto-redes/delete-quote`;
  URL_TASKS = `http://${this.IP}/proyecto-redes/create-task`;
  URL_GETTASKS = `http://${this.IP}/proyecto-redes/get-pendingTasks/`;
  URL_GETCOMPLETEDTASKS = `http://${this.IP}/proyecto-redes/get-completedTasks/`;
  URL_CHAGESTATUS = `http://${this.IP}/proyecto-redes/edit-task`;

  user: UserI = {
    Alias: '',
    Correo: '',
    Contrasena: ''
  }

  constructor(private http: HttpClient) { }
  // create database
  createDataBase() {
    return this.http.get(this.DATABASE);
  }

  // USER ----------------------------
  // create user
  createUser(user: any): Observable<JwtResponseInterface> {
    return this.http.post<JwtResponseInterface>(this.URL_REGISTRO, user).pipe(tap(
      (res: JwtResponseInterface) => {
        if (res) {
          this.saveToken(res.accessToken, res.expiresIn, res.Alias);
          this.user.Alias = res.Alias;
          this.user.Correo = res.Correo;
        }
      }
    ));
  }

  // valid User
  authUser(user: any): Observable<JwtResponseInterface> {
    return this.http.post<JwtResponseInterface>(this.URL_AUTHUSER, user).pipe(tap(
      (res: JwtResponseInterface) => {
        if (res) {
          this.saveToken(res.accessToken, res.expiresIn, res.Alias);
          this.user.Alias = res.Alias;
          this.user.Correo = res.Correo;
        }
      }
    ));
  }

  // get user data
  getUserData(user: string): Observable<UserI> {
    return this.http.get<UserI>(this.URL_USERDATA + user);
  }

  logOut() {
    sessionStorage.removeItem('ACCESS_TOKEN');
    sessionStorage.removeItem('EXPIRES_IN');
    sessionStorage.removeItem('USER');
  }

  private saveToken(token: string, expiresIn: string, usuario: string): void {
    sessionStorage.setItem('ACCESS_TOKEN', token);
    sessionStorage.setItem('EXPIRES_IN', expiresIn);
    sessionStorage.setItem('USER', usuario);
  }

  // Quotes --------------------------
  saveQuotes(quote: any) {
    return this.http.post(this.URL_QUOTE, quote);
  }

  getSavedQuotes(user: string): Observable<QuotePeticion[]> {
    return this.http.get<QuotePeticion[]>(this.URL_QUOTES + user);
  }

  deleteQuote(quote: any) {
    return this.http.post(this.URL_DELETEQUOTE, quote);
  }

  // SETTINGS ---------------
  getUbication(user: string): Observable<UbicationI> {
    return this.http.get<UbicationI>(this.URL_USERSETTINGS + user);
  }

  editSettings(ubication: any) {
    return this.http.post(this.URL_EDITSETTINGS, ubication);
  }

  createUbication(ubication: any) {
    return this.http.post(this.URL_UBICACION, ubication);
  }

  // TASKS ------------------
  createTask(task: any) {
    return this.http.post(this.URL_TASKS, task);
  }

  getPendingTasks(user: string | null): Observable<TaskI[]> {
    return this.http.get<TaskI[]>(this.URL_GETTASKS + user);
  }

  getCompletedTasks(user: string | null): Observable<CompletedTaskI> {
    return this.http.get<CompletedTaskI>(this.URL_GETCOMPLETEDTASKS + user);
  }

  chageStatus(data: any){
    return this.http.post(this.URL_CHAGESTATUS, data);
  }

}
