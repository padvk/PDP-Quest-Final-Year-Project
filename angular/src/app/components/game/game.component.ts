import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	public state = 'home';

	constructor() { }

	ngOnInit() {
	}

	public play() {
		this.state = 'play';
		console.log('Playing');
	}
}
