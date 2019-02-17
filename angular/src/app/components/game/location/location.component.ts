import { Component, OnInit, Input } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-location',
	templateUrl: './location.component.html',
	styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

	public location: string;
	public image: string;
	public deploypath = environment.deploypath;
	
	constructor(public stateService: StateService) { }

	ngOnInit() {
		this.location = this.stateService.currentLocation;
		this.image = this.deploypath + '/assets/images/locations/' + this.location + '.png';
	}

}
