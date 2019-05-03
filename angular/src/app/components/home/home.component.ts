import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { StateService } from 'src/app/services/state.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

	@Output() play: EventEmitter<any> = new EventEmitter();

	public password = '';

	constructor(
		private mainService: MainService,
		public stateService: StateService
	) { }

	ngOnInit() {
		if (this.stateService.dialogueIndex == 0) { // first load
			this.stateService.loadSounds();

		} else { // end of game
			this.end();
		}
	}

	public onPlayClick(part: number) {
		this.play.emit(part); // TODO/NOTE: this disables need for password
		// this.mainService.auth(part, this.password).subscribe(
		// 	(data: any) => {
		// 		console.log(data.data);
		// 		if (data.authed) {
		// 			this.play.emit(part);
		// 		} else {
		// 			alert('Your password is not recognised for part ' + part + '.');
		// 		}
		// 	},
		// 	error => {
		// 		console.log(error);
		// 	}
		// );
	}

	public end() {
		this.mainService.end().subscribe(
			(data: any) => {
				console.log(data.data);
			},
			error => {
				console.log(error);
			}
		);
	}

}
