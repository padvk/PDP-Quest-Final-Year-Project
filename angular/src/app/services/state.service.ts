import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StateService {

	public state = 'map'; // keep as 'home'. Can also be 'map', 'intro' or 'location
	
	public currentTask = 0;
	public currentLocation = '';
	
	public dialogueIndex = 0;
	public nextLocation = 'forest';

	public inventory = {
		carrots: 0,
		gold: 0,
		book: 0
	};

	public locations = {
		forest: {name: 'Forest', cost: 0, unlocked: true},
		town: {name: 'Town Centre', cost: 3, unlocked: false},
		lighthouse: {name: 'Lighthouse', cost: 7, unlocked: false}
	};

	public tasks = [
		{location: 'forest', description: 'Make your way through the forest towards the town of Arkala'},
		{location: 'town', description: 'Find out more about the tragedies happening in Arkala'},
		{location: 'town', description: 'Fetch some carrots from the market for Julissa'},
		{location: 'lighthouse', description: 'Find the wizard in the lighthouse'},
		{location: 'forest', description: 'Get the special wand from Olah and bring it back to Omonar'}
	];


	constructor() { }

	/**
		Tasks:
		Make way to the town of Arkala
		Fetch carrots from the market for Julissa
		Make way to the lighthouse to see what the wizard is up to
		Get the special wand from Olah and return it to Omonar
	*/

	public getCurrentTask() {
		return this.tasks[this.currentTask].description;
	}

	public nextTask() {
		this.currentTask += 1;
	}

	public modifyInventory(item: string, amount: number) {
		this.inventory[item] += amount;
	}

	public unlockLocation(location: string) {
		this.locations[location]['unlocked'] = true;
	}

	public canAccessLocation(location: string) {
		return this.locations[location]['unlocked'];
	}

	/**
	 * Return the next piece of dialogue to display
	 */
	public getNextDialogue() {
		const dialogue = this.part1[this.dialogueIndex];
		this.dialogueIndex++;

		if (!dialogue) { // nothing left
			this.currentLocation = '';
			this.state = 'map';
			return null;

		} else if (dialogue.name == 'map') {
			this.nextLocation = dialogue.nextLocation;
			this.currentLocation = '';
			this.state = 'map';
			return null;
		}
		else {
			return dialogue;
		}
	}

	// Dialogue and events for part1
	public part1initialLocation = 'intro';
	/** ['Kiku', 'Hey...'],
		['Kiku', 'Oh hey, you’re finally awake!'],
		['Kiku', 'You’ve been asleep for nearly 13 hours… I guess knights really do love a good nap huh.'],
		['Kiku', 'Sorry, where are my manners... I’m Kiku, one of the king’s trusted faries.'],
		['Kiku', 'I’m sure you are aware that the residents of Arkala, the town not too far North from here, has gone silent. Nobody has heard a word from any of its residents in weeks.'],
		['Kiku', 'Word has it that a curse has been cast over the town, but we do not know much more than that.'],
		['Kiku', 'So, the king has decided to step in to find a cause for this mysterious silence, and has assigned you to journey over to the town to see what’s going on...'],
		['Kiku', '... and assigned me as your companion! I will help guide you on your way.'],
		['Kiku', 'I’ll give you some time to prepare, we will begin our journey on horseback as soon as possible!'],
		['Kiku', 'And don’t you dare fall back asleep...'],
		['map', 'forest'],*/
	public part1 = [
		
		{name: 'Kiku', dialogue: 'This forest is so eerie… I feel like we’re being watched.'},
		{name: 'Olah', dialogue: 'Hello!'},
		{name: 'Kiku', dialogue: 'Ah! Who said that. I told you we weren’t alone.'},
		{name: 'Olah', dialogue: 'Me! Over here!'},
		{name: 'Olah', dialogue: 'My name is Olah, I am the hermit of these woods.'},
		{name: 'Olah', dialogue: 'I’ve not seen anyone walk down this path for quite some time… days, possibly even weeks'},
		{name: 'Olah', dialogue: 'So I’m glad to finally see a new face for once.'},
		{name: 'Kiku', dialogue: 'You must be so lonely out here by yourself...'},
		{name: 'Kiku', dialogue: 'We have travelled from the kingdom of Orilon. No one has heard from Arkala in weeks, so we’ve been assigned to discover the cause for this silence.'},
		{name: 'Kiku', dialogue: 'You wouldn’t happen to know anything about this mystery?'},
		{name: 'Olah', dialogue: 'The last person I saw in these woods mentioned rumour of a curse placed over Arkala by some evil witch.'},
		{name: 'Olah', dialogue: 'Since then, no one has passed through this forest.'},
		{name: 'Olah', dialogue: 'I assume this curse is preventing anyone from leaving the town, which would explain the silence.'},
		{name: 'Kiku', dialogue: 'How terrible. That would explain why the news never made it to Orilon.'},
		{name: 'Kiku', dialogue: 'Do you know where we can find out more about this witch?'},
		{name: 'Olah', dialogue: 'I can not give you any more information, I’m afraid.'},
		{name: 'Olah', dialogue: 'However if you make your way to the town centre, I’m sure somebody will be able to give you some useful information.'},
		{name: 'Kiku', dialogue: 'Thanks. Let’s make our way over to the town centre then.'},
		{name: 'info', dialogue: 'Your horse seems uninterested in moving on.'},
		{name: 'Kiku', dialogue: 'Oh dear, don’t tell me we were assigned the most stubborn horse in the stables.'},
		{name: 'Kiku', dialogue: 'He will only take us to locations he is familiar with...'},
		{name: 'Kiku', dialogue: '... unless you feed him enough carrots. Cheeky mare.'},
		{name: 'Kiku', dialogue: 'But we have no carrots...'},
		{name: 'Olah', dialogue: 'Don’t you worry, I’ll give you the rest of mine if it means you lift this horrid curse.'},
		{name: 'inventory', item: 'carrots', modify: 5},
		{name: 'info', dialogue: 'You received 5 carrots'},
		{name: 'Kiku', dialogue: 'Thanks, hermit. We’ll be on our way.'},

		{name: 'map', nextLocation: 'town'},



	];

}
