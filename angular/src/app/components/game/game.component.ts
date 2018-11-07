import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	public state = 'skill-picker'; // keep as 'home'

	constructor() { }

	ngOnInit() {
	}

	public goTo(page: string) {
		this.state = page;
		console.log('Playing');
	}
}
