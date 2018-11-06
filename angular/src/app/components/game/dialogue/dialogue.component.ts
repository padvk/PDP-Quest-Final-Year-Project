import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';

@Component({
	selector: 'app-dialogue',
	templateUrl: './dialogue.component.html',
	styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent implements OnInit {

	@Input() dialogue: string[];

	public currentIndex = 0;

	@HostListener('document:click', ['$event'])
	clickout(event) {
		this.handleClick(event);
	}

	constructor(private eRef: ElementRef) { }

	ngOnInit() {
	}

	private handleClick(event: any) {
		if(this.eRef.nativeElement.contains(event.target)) {
			this.currentIndex += 1;
		} else {
			console.log('Click inside the dialogue box.');
		}
	}

}
