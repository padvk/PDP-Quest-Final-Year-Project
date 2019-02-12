import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	constructor(
		private stateService: StateService
	) { }

	ngOnInit() {
	}

	public goToMap() {
		this.stateService.goToMap();
	}

}
