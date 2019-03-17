import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	public deploypath = environment.deploypath;

	constructor(
		public stateService: StateService
	) { }

	ngOnInit() {
	}

	public goToMap() {
		this.stateService.goToMap();
	}

	public itemClick(item: string) {
		this.stateService.playSound('event', item);
	}

}
