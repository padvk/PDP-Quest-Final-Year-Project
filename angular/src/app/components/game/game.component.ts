import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	constructor(public stateService: StateService) { }

	ngOnInit() {
	}

	public play(part: number) {
		const initialLocation = this.stateService.initialiseGame(part);
		this.goToLocation(initialLocation);
	}

	public goToMap() {
		this.stateService.state = 'map';
		console.log('Playing');
	}

	public goToLocation(location: string) {
		this.stateService.state = 'location';
		this.stateService.currentLocation = location;
	}
}
