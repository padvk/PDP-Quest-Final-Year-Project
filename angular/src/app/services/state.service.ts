import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

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
		forest: {name: 'Forest', cost: 0},
		town: {name: 'Town Centre', cost: 3},
		lighthouse: {name: 'Lighthouse', cost: 7}
	};

	public characters = [
		'Kiku', 'Olah', 'Julissa', 'Shopkeeper', 'Omonar'
	];

	public tasks = [
		{location: 'forest', description: 'Make your way through the forest towards the town of Arkala'},
		{location: 'town', description: 'Find out more about the mystery in the town centre'},
		{location: 'town', description: 'Fetch some carrots from the market for Julissa'},
		{location: 'lighthouse', description: 'Find the wizard in the lighthouse'},
		{location: 'forest', description: 'Get the spell book from Olah and bring it back to Omonar'}
	];

	private dialogueSounds = [];

	constructor() {}

	public goToMap() {
		this.state = 'map';
	}	

	public getCurrentTask() {
		return this.tasks[this.currentTask].description;
	}

	public nextTask() {
		this.currentTask += 1;
	}

	public modifyInventory(item: string, amount: number) {
		this.inventory[item] += amount;
	}

	public canUnlockLocation(location: string) {
		if (this.inventory.carrots >= this.locations[location].cost) {
			return true;
		}
		return false;
	}

	public unlockLocation(location: string) {
		if (this.inventory.carrots >= this.locations[location].cost) {
			this.inventory.carrots -= this.locations[location].cost;
			this.locations[location].cost = 0;
			return true;
		} else {
			return false;
		}
	}

	public costOfLocation(location: string) {
		return this.locations[location]['cost'];
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

		} else if (dialogue.name == 'task') {
			this.currentTask++;
			return this.getNextDialogue();

		} else if (dialogue.name == 'location') {
			this.changeLocation(dialogue.location);
			return null;

		} else {
			return dialogue;
		}
	}

	private changeLocation(location: string) {
		this.currentLocation = this.nextLocation = location;
		this.state = '';
		setTimeout(() => {	
			this.state = 'location';
		}, (100));
	}

	public loadSounds() {
		for (let i = 0; i < this.characters.length; i++) {
			const thisAudio = new Audio();
			const thisCharacter = this.characters[i];
			thisAudio.src = environment.deploypath + '/assets/audio/dialogue/' + thisCharacter + '.ogg';
			thisAudio.loop = true;
			thisAudio.load();
			this.dialogueSounds[thisCharacter] = thisAudio;
		}
	}

	public playDialogueSound(character: string) {
		this.dialogueSounds[character].play();
	}

	public stopDialogueSound(character: string) {
		this.dialogueSounds[character].pause();
	}

	/**
	 * Game events are structured as follows:
	 *  - Event with name 'task' indicates that the next task should be shown
	 *  - Event with name 'info' indicates dialogue from no particular character
	 *  - Event with name 'inventory' indicates adding/removing from inventory
	 *  - Event with name 'map' indicates being taken back to map. Also defines the next location in the story
	 *  - Event with name 'location' indicates changing location without going to the map
	 *  - Other events are simply dialogue from a character
	 */

	// Dialogue and events for part1
	public initialLocations = ['intro', 'market', 'forest', 'lighthouse'];
	/** ['Kiku', 'Hey...'],
		['Kiku', 'Oh hey, you’re finally awake!'],
		['Kiku', 'You’ve been asleep for nearly 13 hours… I guess knights really do love a good nap huh.'],
		['Kiku', 'Sorry, where are my manners... I’m Kiku, one of the king’s trusted faries.'],
		['Kiku', 'I’m sure you are aware that the residents of Arkala, the town not too far North from here, have gone silent. Nobody has heard a word from any of them in weeks.'],
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
		{name: 'Kiku', dialogue: 'We have travelled from the kingdom of Orilon. No one has heard from Arkala in weeks, so we\'re on a mission to investigate and help.'},
		{name: 'Kiku', dialogue: 'You wouldn’t happen to know anything about this mystery, would you?'},
		{name: 'Olah', dialogue: 'Hmmm... Now that I think about it, the last person I met in these woods mentioned a rumour of a curse placed over Arkala by some evil witch.'},
		{name: 'Olah', dialogue: 'Since then, no one has passed through this forest.'},
		{name: 'Olah', dialogue: 'I assume this curse is preventing anyone from leaving the town, which would explain the silence.'},
		{name: 'Kiku', dialogue: 'How terrible. That would explain why the news never made it to Orilon.'},
		{name: 'Kiku', dialogue: 'Do you know where we can find out more about this witch?'},
		{name: 'Olah', dialogue: 'Oh... no, sorry. Although she headed in the direction of the town center up ahead.'},
		{name: 'Olah', dialogue: 'I’m sure somebody will be able to give you some useful information.'},
		{name: 'Kiku', dialogue: 'Thanks. Let’s make our way over to the town centre then.'},
		{name: 'task'},
		{name: 'info', dialogue: 'Your horse seems uninterested in moving on.'},
		{name: 'Kiku', dialogue: 'Oh dear, don’t tell me we were assigned the most stubborn horse in the stables.'},
		{name: 'Kiku', dialogue: 'He will only take us to locations he is familiar with...'},
		{name: 'Kiku', dialogue: '... unless you feed him enough carrots. Cheeky mare!'},
		{name: 'Kiku', dialogue: 'But we have no carrots...'},
		{name: 'Olah', dialogue: 'Don’t you worry, I’ll give you the rest of mine if it means you lift this horrid curse.'},
		{name: 'inventory', item: 'carrots', modify: 5},
		{name: 'info', dialogue: 'You received 5 carrots'},
		{name: 'Kiku', dialogue: 'Thanks, hermit. We’ll be on our way.'},

		{name: 'map', nextLocation: 'town'},

		{name: 'Kiku', dialogue: 'Wow, it is pretty gloomy here. It’s like a ghost town. Where is everyone?'},
		{name: 'Kiku', dialogue: 'Everyone must be at home feeling sorry for themselves.'},
		{name: 'Kiku', dialogue: 'Hey, why don’t we knock on some houses? Maybe they could tell us more about what’s going on.'},
		{name: 'Kiku', dialogue: 'Let’s try this house. I hope someone’s home.'},
		{name: 'info', dialogue: '*Knock knock*'},
		{name: 'Julissa', dialogue: 'Oh, hey you two.'},
		{name: 'Julissa', dialogue: 'I’m not sure I’ve seen your faces around here before. Are you from here?'},
		{name: 'Kiku', dialogue: 'Sorry to bother you. We have travelled from Orilon to restore peace to this town.'},
		{name: 'Kiku', dialogue: 'We were wondering if you could enlighten us as to what’s causing this mysterious gloom that is holding your town captive.'},
		{name: 'Kiku', dialogue: 'On our way we met a hermit in the woods, he mentioned that a witch had taken over the town. Is this true?'},
		{name: 'Julissa', dialogue: 'You heard correct, although I wouldn’t believe everything that man says.'},
		{name: 'Julissa', dialogue: 'He has a strange ring to him... and smell...'},
		{name: 'Julissa', dialogue: 'Anyway, it is the witch who has caused the silence. She has taken control of the town and has cast a curse, bringing gloom and illness to all around.'},
		{name: 'Julissa', dialogue: 'Nobody has the motivation to leave the house anymore. This town has been reduced to nothing more than a prison.'},
		{name: 'Kiku', dialogue: 'So the rumour of a witch is true...'},
		{name: 'Kiku', dialogue: 'We will do everything in our power to find this witch and free your town from her curse.'},
		{name: 'Julissa', dialogue: 'I do hope so... I’m not sure how much longer we can live like this.'},
		{name: 'Julissa', dialogue: 'I’ve heard that the shops in the market only have enough stock to last us a few more days, as the witch has also contaminated our farms.'},
		{name: 'Kiku', dialogue: 'Do you think they might still have any carrots left?'},
		{name: 'Kiku', dialogue: 'Our horse here is stubborn and will only take us to where we want to go if we feed him, so we will need to stock up on some food.'},
		{name: 'Julissa', dialogue: 'Yes I do believe you should be in luck, although I wouldn’t wait around as everyone will be stocking up on the final supplies.'},
		{name: 'Kiku', dialogue: 'Great, let’s go stock up on some carrots before they run out then.'},
		{name: 'Kiku', dialogue: 'Hey, knight, you did bring some coins with you, didn\'t you?'},
		{name: 'Kiku', dialogue: '... No?!?'},
		{name: 'Kiku', dialogue: 'I thought I told you to prepare!'},
		{name: 'Julissa', dialogue: 'Tell you what, I am also in need of some carrots for tonight’s dinner.'},
		{name: 'Julissa', dialogue: 'If I give you some gold to go to the market and fetch me a bunch of carrots then I will let you keep half of them.'},
		{name: 'Julissa', dialogue: 'Anything to avoid leaving the house.'},
		{name: 'Kiku', dialogue: 'That would be a massive help, thank you.'},
		{name: 'task'},
		{name: 'inventory', item: 'gold', modify: 5},
		{name: 'info', dialogue: 'You received 5 gold.'},

		{name: 'location', location: 'market'},
		{name: 'Shopkeeper', dialogue: 'Hi there.'},
		{name: 'Kiku', dialogue: 'We would like to buy a bunch of carrots please. Have you got many left?'},
		{name: 'Shopkeeper', dialogue: 'I’m down to my last bunch. How about 10 carrots for 8 gold?'},
		{name: 'Kiku', dialogue: 'We only have 5 gold! Any chance of a discount?'},
		{name: 'Kiku', dialogue: 'It’s very important that we buy some food. We’re on a quest to banish the witch from this town and forgot to bring food for our horse.'},
		{name: 'Shopkeeper', dialogue: 'Hmmm...'},
		{name: 'Shopkeeper', dialogue: 'I’ll do you a deal. My news stand hasn’t had a new headline since just after the witch took over Arkala.'},
		{name: 'Shopkeeper', dialogue: 'I guess the witch put a stop to all and any interesting news-worthy happenings...'},
		{name: 'Shopkeeper', dialogue: 'How about you two present me with some ideas for an interesting headline for my news stand.'},
		{name: 'Shopkeeper', dialogue: 'My customers must be tired of reading the same headline on my news stand every day...'},
		{name: 'Shopkeeper', dialogue: '... and I’m sure both of you together could come up with something exciting!!'},
		{name: 'Shopkeeper', dialogue: 'In return I’ll give you a discount. 10 carrots for your 5 gold.'},
		{name: 'Shopkeeper', dialogue: 'Deal?'},
	];

}
