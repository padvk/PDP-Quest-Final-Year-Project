import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

	public showCantAccessLocationDialogue = false;
	public cantAccessLocationDialogue = [
		['Companion', 'We can\'t go to that location yet! Try clicking on another location first.']
	];


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
		// temp code
		if (this.stateService.canAccessLocation(location)) {
			// take player to location 1
		} else {
			// player can't access location
			this.showCantAccessLocationDialogue = true;
		}
	}
}
