import { MatTableDataSource } from '@angular/material/table';
import { Proyecto } from './proyecto';


export class Grupo {    
    codigogrupo: number;
    nombre: string;
    descripcion: string;
    cantidadMaxima: number;
    cantidadEstudiantes: number;
    estado: string;
    proyectos?: Proyecto[] | MatTableDataSource<Proyecto>;
}