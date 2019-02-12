import { Component, OnInit, Input } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
	selector: 'app-location',
	templateUrl: './location.component.html',
	styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

	public location: string;
	
	constructor(private stateService: StateService) { }

	ngOnInit() {
		this.location = this.stateService.currentLocation;
	}

}
