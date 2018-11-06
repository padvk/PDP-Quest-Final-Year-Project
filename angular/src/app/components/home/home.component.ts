import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	@Output() play: EventEmitter<any> = new EventEmitter();

	constructor(
		private mainService: MainService
	) { }

	ngOnInit() {
	}

	public onPlayClick() {
		this.play.emit();
		// this.mainService.callEndpoint().subscribe(
		// 	(data: any) => {
		// 		console.log(data);
		// 	},
		// 	error => {
		// 		console.log(error);
		// 	}
		// );
	}

}
