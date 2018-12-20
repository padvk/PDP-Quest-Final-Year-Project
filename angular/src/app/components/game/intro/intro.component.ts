import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-intro',
	templateUrl: './intro.component.html',
	styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

	@Output() nextPageEvent: EventEmitter<any> = new EventEmitter();
	
	public deploypath = environment.deploypath;
	public introDialogue = [
		['', 'Greetings! I am your companion. You can click on this dialogue box to continue.'],
		['', 'This is the bit where I explain to you how to play the game.']
	];

	constructor() { }

	ngOnInit() {
	}

	public nextPage() {
		this.nextPageEvent.emit();
	}

}
