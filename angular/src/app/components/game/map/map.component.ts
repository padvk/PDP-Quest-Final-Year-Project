import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

	public showCantAccessLocationDialogue = false;
	public cantAccessLocationDialogue = [
		['', 'Your companion has a message for you.'],
		['Companion', 'We can\'t go to that location yet! Try clicking on another location first.']
	];


	constructor() { }

	ngOnInit() {
	}

	/**
	 * Clicking on a location will either take the player to the location,
	 * or will trigger a companion dialogue.
	 */
	public handleLocationClick(location: String) {
		// temp code
		if (location == 'clickable1') {
			// take player to location 1
		} else {
			// player can't access location
			this.showCantAccessLocationDialogue = true;
		}
	}
}
