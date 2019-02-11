import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StateService } from 'src/app/services/state.service';

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

	private finished = false;
	private currentIndex = 0;
	public currentDialogue = '';
	public currentCharacter = '';
	public deploypath = environment.deploypath;
	
	constructor(
		private eRef: ElementRef,
		private stateService: StateService) { }

	ngOnInit() {
		if (this.dialogue) {
			this.currentCharacter = this.dialogue[0][0];
			this.currentDialogue = this.dialogue[0][1];
		} else {
			this.continueStory();
		}
	}

	/**
	 * Run when a click is detected
	 */
	private handleClick(event: any) {
		if(this.eRef.nativeElement.contains(event.target)) {

			if (this.dialogue) {
				this.showProvidedDialogue();
			} else {
				this.continueStory();
			}
			
		} else {
			console.log('Click inside the dialogue box.');
		}
	}

	private showProvidedDialogue() {
		this.currentIndex += 1;

		if (this.currentIndex >= this.dialogue.length) {
			this.endDialogue();
		} else {
			this.currentCharacter = this.dialogue[this.currentIndex][0];
			this.currentDialogue = this.dialogue[this.currentIndex][1];
		}
	}

	private continueStory() {
		const nextDialogue = this.stateService.getNextDialogue();
		
		if (!nextDialogue) {
			this.endDialogue();
		
		} else if (nextDialogue['name'] == 'inventory') {
			this.stateService.modifyInventory(nextDialogue['item'], nextDialogue['modify']);
			this.continueStory();

		} else {
			this.currentCharacter = nextDialogue['name'];
			this.currentDialogue = nextDialogue['dialogue'];
		}
	}

	private endDialogue() {
		this.finished = true;
		this.finishedDialogue.emit();
	}

}
