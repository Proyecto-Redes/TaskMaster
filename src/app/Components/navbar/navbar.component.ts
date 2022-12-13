import { Component, OnInit } from '@angular/core';
import { ClimaI } from 'src/app/Models/Clima';
import { FrasesService } from '../../Services/frases.service';
import { ClimaService } from '../../Services/clima.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl } from '@angular/forms';
import { ServerService } from '../../Services/server.service';
import { UserI, UbicationI } from '../../Models/User';
import { FraseDiaI } from 'src/app/Models/Frases';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  Frase: string = '';
  weather: ClimaI = {
    coord: { lon: 0, lat: 0 },
    weather: [{
      description: '',
      icon: '',
      id: 0,
      main: ''
    }],
    base: '',
    main: {
      feels_like: 0,
      pressure: 0,
      humidity: 0,
      temp: 0,
      temp_max: 0,
      temp_min: 0
    },
    visibility: 0,
    wind: {
      deg: 0,
      speed: 0
    },
    clouds: {
      all: 0
    },
    dt: 0,
    sys: {
      country: '',
      id: 0,
      sunrise: 0,
      sunset: 0,
      type: 0
    },
    timezone: 0,
    id: 0,
    name: '',
    cod: 0
  };

  fFrase = new FormGroup({
    Frase: new FormControl(''),
    Autor: new FormControl(''),
    Fecha: new FormControl(''),
    User: new FormControl(''),
    Motivo: new FormControl('')
  });

  userData: UserI = {
    Alias: '',
    Correo: '',
    Contrasena: ''
  }

  public FraseDelDia: FraseDiaI = {
    success: { total: 0 },
    contents: {
      quotes: [{
        author: '',
        background: '',
        category: '',
        date: '',
        id: '',
        language: '',
        length: '',
        permalink: '',
        quote: '',
        tags: [],
        title: ''
      }]
    },
    baseurl: '',
    copyright: { url: '', year: 0 }
  };

  ubicaction: UbicationI = {
    cityName: '',
    countryCode: '',
    User: ''
  };

  constructor(private router: Router, private fraseService: FrasesService, private climaService: ClimaService, private serverService: ServerService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('ACCESS_TOKEN') !== null) {
      this.getUserData();
      this.obtenerFraseCelebre();
    } else {
      this.logOut();
      this.router.navigate(['login']);
    }
  }

  getUserData() {
    let user: any = sessionStorage.getItem('USER');
    this.serverService.getUserData(user).subscribe(
      res => {
        console.log('userData: ', res);
        this.userData = res;
        console.log('this.userData: ', this.userData);
        console.log('this.userData.Alias: ', this.userData.Alias);
        this.getUbicationData();
      },
      err => {
        console.log('error userData: ', err);
      }
    )
  }

  logOut() {
    this.serverService.logOut();
  }

  obtenerFraseCelebre() {
    this.fraseService.getFraseCelebre().subscribe(
      res => {
        this.FraseDelDia = res;
        console.log('this.FraseDelDia: ', this.FraseDelDia);
      },
      err => {
        console.log('error frase celebre: ', err);
      }
    );
  }

  saveFrase(frase: string) {
    console.log('frase: ', frase);
    this.fFrase.value.Frase = frase;
    this.fFrase.value.Autor = this.FraseDelDia.contents.quotes[0].author;
    this.fFrase.value.Fecha = new Date().toLocaleDateString();
    this.fFrase.value.User = this.userData.Alias;
    if (this.fFrase.value.Motivo === null)
      this.fFrase.value.Motivo = '';
    console.log('fFrase: ', this.fFrase.value);

    this.serverService.saveQuotes(this.fFrase.value).subscribe(
      (res: any) => {
        console.log('save quote response: ', res);
        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: res.msg,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: res.msg,
            timer: 1500
          });
        }
      },
      err => {
        console.log('err to save quote: ', err);
      }
    )

    this.fFrase.reset();
  }

  obtenerFrase() {
    this.fraseService.getFrase().subscribe(
      res => {
        console.log('resultado: ', res);
        this.Frase = res.value;
      },
      err => {
        console.log('Error frase: ', err);
      }
    )
  }

  getUbicationData() {
    this.serverService.getUbication(this.userData.Alias).subscribe(
      res => {
        console.log('settings: ', res);
        this.ubicaction = res;
        this.obtenerClima(0);
      },
      err => {
        console.log('settings error: ', err);
      }
    )
  }

  obtenerClima(op: number) {
    this.climaService.getClima(this.ubicaction.cityName, this.ubicaction.countryCode).subscribe(
      res => {
        if (op === 0) {
          console.log('response weather: ', res);
          this.weather = res;
        } else if (op === 1) {
          this.weather = res;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Datos de clima actualizados',
            showConfirmButton: false,
            timer: 1200
          })
        }
      },
      err => {
        console.log('error clima: ', err);
      }
    )
  }

}
