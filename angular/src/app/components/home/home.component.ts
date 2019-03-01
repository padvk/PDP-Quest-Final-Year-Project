import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {

	@Output() play: EventEmitter<any> = new EventEmitter();

	public password = '';

	constructor(
		private mainService: MainService
	) { }

	public onPlayClick(part: number) {
		this.play.emit(part);
		this.mainService.auth(part, this.password).subscribe(
			(data: any) => {
				console.log(data.data);
				if (data.authed) {
					this.play.emit(part);
				} else {
					// alert('Your password is not recognised for part ' + part + '.');
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	public testEnd() {
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
