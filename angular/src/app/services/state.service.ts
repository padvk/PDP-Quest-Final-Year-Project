import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class StateService {

	public state = 'home'; // keep as 'home'. Can also be 'map' or 'location
	public currentPartIndex;
	
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
		market: {name: 'Town Market', cost: 0},
		lighthouse: {name: 'Lighthouse', cost: 7},
	};

	public tasks = [
		{location: 'forest', description: 'Make your way through the forest towards the town of Arkala'},
		{location: 'town', description: 'Uncover more of the mystery in the town centre'},
		{location: 'town', description: 'Find the market and fetch some carrots from the market for Julissa'},
		{location: 'lighthouse', description: 'Visit the wizard in the lighthouse'},
		{location: 'forest', description: 'Get the spell book from Olah and bring it back to Omonar'}
	];

	public characters = [
		'Kiku', 'Olah', 'Julissa', 'Shopkeeper', 'Omonar'
	];

	public events = [
		'map', 'carrot', 'gold', 'book', 'lamp', 'clocktower'
	];

	private dialogueSounds = [];
	private locationSounds = [];
	private eventSounds = [];

	constructor() {}

	public initialiseGame(part: number) {
		this.currentPartIndex = part-1;
		const partData = this.parts[this.currentPartIndex];

		this.inventory.carrots = partData['carrots'];
		this.inventory.gold = partData['gold'];
		this.inventory.book = partData['book'];
		this.currentTask = partData['currentTask'];
		this.nextLocation = partData['initialLocation'];

		for (let i = 0; i < partData['unlockedLocations'].length; i++) {
			this.locations[partData['unlockedLocations'][i]].cost = 0;
		}

		// return partData['initialLocation'];
		this.SKIPSTORY(65);
		return 'town';
	}

	public SKIPSTORY(number: number) {
		for (let i = 0; i < number; i++) {
			this.getNextDialogue();
		}
	}

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
		const dialogue = this.parts[this.currentPartIndex].dialogue[this.dialogueIndex];
		this.dialogueIndex++;

		if (!dialogue) { // nothing left
			this.currentLocation = '';
			this.state = 'map';
			return null;

		} else if (dialogue.name == 'map') {
			this.nextLocation = dialogue['nextLocation'];
			this.currentLocation = '';
			this.state = 'map';
			return null;

		} else if (dialogue.name == 'task') {
			this.currentTask++;
			return this.getNextDialogue();

		} else if (dialogue.name == 'location') {
			this.changeLocation(dialogue['location']);
			return null;

		} else if (dialogue.name == 'inventory') {
			this.modifyInventory(dialogue['item'], dialogue['modify']);
			return this.getNextDialogue();

		} else {
			return dialogue;
		}
	}

	public changeLocation(location: string) {
		this.currentLocation = this.nextLocation = location;
		this.state = '';
		setTimeout(() => {	
			this.state = 'location';
		}, (100));
	}

	public loadSounds() {
		for (let character in this.characters) {
			const charSound = new Audio();
			const thisCharacter = this.characters[character];
			charSound.src = environment.deploypath + '/assets/audio/dialogue/' + thisCharacter + '.ogg';
			charSound.loop = true;
			charSound.load();
			this.dialogueSounds[thisCharacter] = charSound;
		}

		for (let location in this.locations) {
			const locationSound = new Audio();
			locationSound.src = environment.deploypath + '/assets/audio/backgrounds/' + location + '.ogg';
			locationSound.loop = true;
			locationSound.load();
			this.locationSounds[location] = locationSound;
		}

		for (let event in this.events) {
			const eventSound = new Audio();
			const thisEvent = this.events[event];
			eventSound.src = environment.deploypath + '/assets/audio/events/' + thisEvent + '.ogg';
			eventSound.loop = false;
			eventSound.load();
			this.eventSounds[thisEvent] = eventSound;
		}
	}

	public playSound(type: string, item: string) {
		const soundsArray = this.getSoundArray(type);

		if (soundsArray[item]) {
			soundsArray[item].play();
		}
	}

	public stopSound(type: string, item: string) {
		const soundsArray = this.getSoundArray(type);

		if (soundsArray[item]) {
			soundsArray[item].pause();
		}
	}

	private getSoundArray(type: string) {
		switch(type) {
			case 'location': return this.locationSounds;
			case 'character': return this.dialogueSounds;
			case 'event': return this.eventSounds;
		}
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

	//public initialLocations = ['intro', 'market', 'forest', 'lighthouse'];
	
	// Dialogue and events for each part
	private parts = [
		{
			initialLocation: 'intro',
			carrots: 0,
			gold: 0,
			book: 0,
			unlockedLocations: [],
			currentTask: 0,
			dialogue: [
				{name: 'Kiku', dialogue: 'Hey....'},
				{name: 'Kiku', dialogue: 'Oh hey, you’re finally awake!'},
				{name: 'Kiku', dialogue: 'You’ve been asleep for nearly 13 hours… I guess knights really do love a good nap huh.'},
				{name: 'Kiku', dialogue: 'Sorry, where are my manners… I’m Kiku, one of the king’s trusted faries.'},
				{name: 'Kiku', dialogue: 'I’m sure you are aware that the residents of Arkala, the town not too far North from here, has gone silent. Nobody has heard a word from any of its residents in weeks.'},
				{name: 'Kiku', dialogue: 'Word has it that a curse has been cast over the town, but we do not know much more than that.'},
				{name: 'Kiku', dialogue: 'So, the king has decided to step in to find a cause for this mysterious silence, and has assigned you to journey over to the town to see what’s going on...'},
				{name: 'Kiku', dialogue: '“... and assigned me as your companion! I will help guide you on your way.'},
				{name: 'Kiku', dialogue: 'I’ll give you some time to prepare, we will begin our journey on horseback as soon as possible!'},
				{name: 'Kiku', dialogue: 'And don’t you dare fall back asleep...'},
				{name: 'map', nextLocation: 'forest'},

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
				{name: 'endDialogue', location: 'market'},
		
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
				{name: 'endPart', part: '1'}
			]
		},

		{
			initialLocation: 'market',
			carrots: 0,
			gold: 5,
			book: 0,
			unlockedLocations: ['town'],
			currentTask: 0,
			dialogue: [
				{name: 'Shopkeeper', dialogue: 'Thanks, you two. You two came up with some really interesting ideas.'},
				{name: 'Shopkeeper', dialogue: 'I’ll be sure to put one of these on my news stand. Good work!'},
				{name: 'Shopkeeper', dialogue: 'As promised, here’s your carrots.'},
				{name: 'Kiku', dialogue: 'Great! Glad you like our ideas.'},
				{name: 'inventory', item: 'carrots', modify: 10},
				{name: 'info', dialogue: 'You received 10 carrots.'},
				{name: 'Shopkeeper', dialogue: 'And while you were giving your presentation, I remembered something that might help you in your quest.'},
				{name: 'Shopkeeper', dialogue: 'There is a wizard who lives in the lighthouse not too far North (tbc) from here. Rumour has it that he is preparing some kind of spell to banish the witch.'},
				{name: 'Shopkeeper', dialogue: 'I might be worth you paying him a visit.'},
				{name: 'Kiku', dialogue: 'Thanks for that, we’ll be sure to drop by to see what he’s up to.'},
				{name: 'Kiku', dialogue: 'We’ll be off now.'},
				{name: 'Shopkeeper', dialogue: 'Good luck!'},
				{name: 'location', location: 'town'},

				{name: 'Julissa', dialogue: 'Oh you’re back! What took you so long?'},
				{name: 'Kiku', dialogue: 'We got caught up in a conversation with the shopkeeper.'},
				{name: 'Julissa', dialogue: 'Of course. It can be easy to get lost in conversation with that man sometimes.'},
				{name: 'Julissa', dialogue: 'Anyway, here’s your half. You got me the perfect amount of carrots I need to prepare dinner. Thanks for helping me out.'},
				{name: 'Kiku', dialogue: 'No problem. We should have enough food now for us to continue in our quest.'},
				{name: 'Kiku', dialogue: 'Nice meeting you, Julissa.'},
				{name: 'Julissa', dialogue: 'See you around!'},
				{name: 'map', nextLocation: 'lighthouse'},

			]
		
		},

	];

}
