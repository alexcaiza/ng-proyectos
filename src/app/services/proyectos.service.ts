import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Grupo } from '../models/grupo';

@Injectable({
	providedIn: 'root'
})
export class ProyectosService {
	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	redirectUrl: string;

	//baseUrl: string = "http://localhost/ng-proyectos/backend";
    baseUrl: string = "http://201.159.223.24/ng-proyectos/backend";
    
	constructor(private httpClient: HttpClient) { }

	public findGrupos(params): Observable<any> {
        const url = `${this.baseUrl}/findGrupos.php`;
        return this.httpClient.post(url, params, this.httpOptions).pipe(
            tap(_ => console.log(`params=${params}`)),
            catchError(this.handleError<any>('findGrupos')));
    }

    public findEstudianteByCedula(params): Observable<any> {
        const url = `${this.baseUrl}/findEstudianteByCedula.php`;
        return this.httpClient.post(url, params, this.httpOptions).pipe(
            tap(_ => console.log(`params=${params}`)),
            catchError(this.handleError<any>('findEstudianteByCedula')));
    }

    public findProyectoById(params): Observable<any> {
        const url = `${this.baseUrl}/findProyectoById.php`;
        return this.httpClient.post(url, params, this.httpOptions).pipe(
            tap(_ => console.log(`params=${params}`)),
            catchError(this.handleError<any>('findProyectoById')));
    }

    public countProyectoEstudiante(params): Observable<any> {
        const url = `${this.baseUrl}/countProyectoEstudiante.php`;
        return this.httpClient.post(url, params, this.httpOptions).pipe(
            tap(_ => console.log(`params=${params}`)),
            catchError(this.handleError<any>('countProyectoEstudiante')));
    }

    public async countProyectoEstudiantePromise(params) : Promise<any> {
        
        const url = `${this.baseUrl}/countProyectoEstudiante.php`;
       
        let data = await this.httpClient.post(url, params, this.httpOptions).toPromise();

        console.log('I will not wait until promise is resolved..');
        console.log(`data response: ${data}`);
        console.log(data);
		return data;
      }

    public insertProyectoEstudiante(params): Observable<any> {
        const url = `${this.baseUrl}/insertProyectoEstudiante.php`;
        return this.httpClient.post(url, params, this.httpOptions).pipe(
            tap(_ => console.log(`params=${params}`)),
            catchError(this.handleError<any>('insertProyectoEstudiante')));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
