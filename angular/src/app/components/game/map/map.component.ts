import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

	@Output() goToLocationEvent: EventEmitter<any> = new EventEmitter();

	public showCantAccessLocationDialogue = false;
	public cantAccessLocationDialogue = [
		['Kiku', 'We can\'t go to there yet! Try clicking on another location first.']
	];

	public showLocationUnlockDialogue = false;
	public locationUnlockDialogue = [['Kiku', 'dab']];

	public clickedLocation = '';

	constructor(
		private stateService: StateService
	) { }

	ngOnInit() {
	}

	/**
	 * Clicking on a location will either take the player to the location,
	 * or will trigger a companion dialogue.
	 */
	public handleLocationClick(location: string) {
		const cost = this.stateService.costOfLocation(location);
		this.clickedLocation = location;
		
		if (cost == 0) {
			// take player to location
			this.goToLocationEvent.emit(location);

		} else if (cost > 0) {
			// trade carrots to unlock
			if (this.stateService.unlockLocation(location)) {
				this.locationUnlockDialogue = [
					['Kiku', 'We fed our horse ' + cost + ' carrots to take us to this location!']
				];
				this.showLocationUnlockDialogue = true;
			} else {
				this.showCantAccessLocationDialogue = true;
			}
		} else {			
			// player can't access location
			this.showCantAccessLocationDialogue = true;
		}
	}

	public goToClickedLocation() {
		this.goToLocationEvent.emit(this.clickedLocation);
	}
}
