import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class SiblingService {

    public callToggle = new Subject();
    public callFindEstudianteMeetings = new Subject();

    public subjectDocentesList = new BehaviorSubject(null);
    public siblingDocentesList$ = this.subjectDocentesList.asObservable();

    public messageSource = new BehaviorSubject('default message');
    public messageSource$ = this.messageSource.asObservable();

    constructor() { }

    public setDocentesList(data: any) {
        this.subjectDocentesList.next(data);
    }

    public changeMessage(data: any) {
        this.messageSource.next(data)
    }
}
