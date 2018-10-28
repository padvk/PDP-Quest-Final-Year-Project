import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	@Output() play: EventEmitter<any> = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	public onPlayClick() {
		this.play.emit();
	}

}
