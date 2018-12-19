import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
	selector: 'app-dialogue',
	templateUrl: './dialogue.component.html',
	styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent {

	@Input() dialogue: string[][];
	@Output() finishedDialogue: EventEmitter<any> = new EventEmitter();

	// Listen for clicks
	@HostListener('document:click', ['$event'])
	clickout(event) {
		this.handleClick(event);
	}

	public currentIndex = 0;
	public currentCharacter = '';
	
	constructor(private eRef: ElementRef) { }

	/**
	 * Run when a click is detected
	 */
	private handleClick(event: any) {
		if(this.eRef.nativeElement.contains(event.target)) {
			this.currentIndex += 1;

			if (this.currentIndex >= this.dialogue.length) {
				this.finishedDialogue.emit();
			}
		} else {
			console.log('Click inside the dialogue box.');
		}
	}

}
