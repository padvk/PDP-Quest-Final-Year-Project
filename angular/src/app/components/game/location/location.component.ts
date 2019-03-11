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

		this.stateService.playSound('location', this.location);
	}

	ngOnDestroy() {
		this.stateService.stopSound('location', this.location);
	}
	
	public handleBackgroundClick(item: string) {
		switch(this.location) {
			case 'forest':
				this.handleForestClick(item);
				break;

			case 'town':
				this.handleTownClick(item);
				break;
			
			case 'market':
				this.handleMarketClick(item);
				break;
		}
		
	}

	private handleForestClick(item: string) {

	}

	private handleTownClick(item: string) {
		switch(item) {
			case 'market':
				if (this.stateService.nextLocation == 'market') {
					this.stateService.changeLocation('market');
				}
				break;
			case 'door':
				this.dialogueActive = true;
				break;
			case 'lamp':
			case 'clocktower':
			case 'window':
				this.stateService.playSound('event', item);
				break;
		}

	}

	private handleMarketClick(item: string) {
		switch(item) {
			case 'town':
				this.stateService.changeLocation('town');
				break;
			case 'newspaper-stand':
			case 'fruit-stand':
				this.stateService.playSound('event', item);
				break;
		}

	}

}
