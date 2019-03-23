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
		this.stateService.dialogueActive = (this.location == this.stateService.nextLocation);

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

			case 'lighthouse':
				this.handleLighthouseClick(item);
				break;
		}
		
	}

	private handleForestClick(item: string) {
		switch(item) {
			case 'leaves':
			case 'tree':
				this.stateService.playSound('event', item);
				break;
		}
	}

	private handleTownClick(item: string) {
		switch(item) {
			case 'market':
				if (!this.stateService.dialogueActive) {
					this.stateService.changeLocation('market');
				}
				break;
			case 'door':
				if (!this.stateService.dialogueActive && this.stateService.nextLocation == 'town') {
					this.stateService.dialogueActive = true;
				}
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
				if (!this.stateService.dialogueActive) {
					this.stateService.changeLocation('town');
				}
				break;
			case 'newspaper-stand':
			case 'fruit-stand':
				this.stateService.playSound('event', item);
				break;
		}

	}

	private handleLighthouseClick(item: string) {
		switch(item) {
			case 'foghorn':
			case 'waves':
				this.stateService.playSound('event', item);
				break;
			case 'lighthouseDoor':
				if (!this.stateService.dialogueActive && this.stateService.nextLocation == 'lighthouse') {
					this.stateService.dialogueActive = true;
				}
				break;
		}
	}

}
