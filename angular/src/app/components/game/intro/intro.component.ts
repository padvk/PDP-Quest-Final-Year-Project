import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
	selector: 'app-intro',
	templateUrl: './intro.component.html',
	styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

	@Output() nextPageEvent: EventEmitter<any> = new EventEmitter();

	public introDialogue = [
		'Companion: Greetings! I am your companion.',
		'Companion: This is the bit where I explain how to play the game.'
	];

	constructor() { }

	ngOnInit() {
	}

	public nextPage() {
		this.nextPageEvent.emit();
	}

}
