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

	public finished = false;
	private currentIndex = 0;

	private currentDialogue = '';
	public displayedDialogue = '';
	public finishedTyping = false;
	private dialogueChar = 0;
	private dialogueSpeed = 40;

	public currentCharacter = '';
	public deploypath = environment.deploypath;
	
	constructor(
		private eRef: ElementRef,
		public stateService: StateService) { }

	ngOnInit() {
		if (this.dialogue) {
			this.setNextDialogue(this.dialogue[0][0], this.dialogue[0][1]);
		} else {
			this.continueStory();
		}
	}

	/**
	 * Run when a click is detected
	 */
	private handleClick(event: any) {
		const target = event.target || event.srcElement || event.currentTarget;
		const idAttr = target.attributes.id;
	
		if(!(idAttr && idAttr.nodeValue == 'bw') && this.eRef.nativeElement.contains(event.target)) {

			if (!this.finishedTyping) {
				this.skipTyping();
			} else if (this.dialogue) {
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
			this.setNextDialogue(this.dialogue[this.currentIndex][0], this.dialogue[this.currentIndex][1]);
		}
	}

	private continueStory() {
		const nextDialogue = this.stateService.getNextDialogue();
		this.finishedTyping = false;
		
		if (!nextDialogue) {
			this.endDialogue();
		
		} else if (nextDialogue['name'] == 'endDialogue') {
			this.finishedDialogue.emit();

		} else {
			this.setNextDialogue(nextDialogue['name'], nextDialogue['dialogue']);
		}
	}

	private endDialogue() {
		this.finishedTyping = true;
		this.finished = true;
		this.finishedDialogue.emit();
	}

	private typingText() {
		if (this.dialogueChar < this.currentDialogue.length) {
			this.displayedDialogue += this.currentDialogue.charAt(this.dialogueChar);
			this.dialogueChar++;
			setTimeout(() => {
				if (!this.finishedTyping) {
					this.typingText()
				}
			}, this.dialogueSpeed);

		} else {
			this.finishedTyping = true;
			this.stopDialogueSound(this.currentCharacter);
		}

	}	

	private skipTyping() {
		this.finishedTyping = true;
		this.displayedDialogue = this.currentDialogue;
		this.dialogueChar = this.currentDialogue.length;
		this.stopDialogueSound(this.currentCharacter);
	}

	private setNextDialogue(character: string, dialogue: string) {
		this.currentDialogue = dialogue;
		this.currentCharacter = character;
		this.displayedDialogue = '';
		this.dialogueChar = 0;
		this.typingText();
		this.playDialogueSound(character);
	}

	private playDialogueSound(character: string) {
		if (character != 'info') {
			this.stateService.playSound('character', character);
		}
	}

	private stopDialogueSound(character: string) {
		if (character != 'info') {
			this.stateService.stopSound('character', character);
		}
	}

	public changeBW() {
		this.stateService.dialogueWhiteOnBlack = !this.stateService.dialogueWhiteOnBlack;
	}

}
