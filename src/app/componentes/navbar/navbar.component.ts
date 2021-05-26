import { Component, OnInit } from '@angular/core';
import { SiblingService } from 'src/app/services/sibling.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private siblingService: SiblingService,
  ) { }

  ngOnInit(): void {
  }

  changeMessage() {
		console.log('Method changeMessage()');
		//this.siblingService.callFindEstudianteMeetings.next(true);
		this.siblingService.changeMessage(true);
	}

}
