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
	public dialogueActive: boolean;
	public deploypath = environment.deploypath;
	
	constructor(public stateService: StateService) { }

	ngOnInit() {
		this.location = this.stateService.currentLocation;
		this.image = this.deploypath + '/assets/images/locations/' + this.location + '.png';
		this.dialogueActive = (this.location == this.stateService.nextLocation);

		this.stateService.playLocationSound(this.location);
	}

	ngOnDestroy() {
		this.stateService.stopLocationSound(this.location);
	}
	
	public handleBackgroundClick(item: string) {
		if (this.dialogueActive) {
			switch(this.location) {
				case 'forest':
					this.handleForestClick(item);
					break;
	
				case 'town':
					this.handleTownClick(item);
					break;
			}
		}
		
	}

	private handleForestClick(item: string) {

	}

	private handleTownClick(item: string) {
		switch(item) {
			case 'market':
				// clicked on the market in the town
				console.log('asdf');
				break;
		}

	}

}
