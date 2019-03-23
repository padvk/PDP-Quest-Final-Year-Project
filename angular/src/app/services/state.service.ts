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
	public nextLocation = '';

	public dialogueActive = false;
	public dialogueWhiteOnBlack = true;

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
		{location: 'town', description: 'Kock on the door to see if anyone\'s home'},
		{location: 'town', description: 'Explore your surroundings to find the market and fetch some carrots from the market for Julissa'},
		{location: 'town', description: 'Bring the carrots back to Julissa'},
		{location: 'lighthouse', description: 'Visit the wizard in the lighthouse'},
		{location: 'lighthouse', description: 'Knock on the lighthouse door to see if the Wizard is in'},
		{location: 'forest', description: 'Get the spell book from Olah and bring it back to Omonar'},
		{location: 'lighthouse', description: 'Assist the Wizard with his literature review'},
		{location: 'lighthouse', description: ''},
	];

	public characters = [
		'Kiku', 'Olah', 'Julissa', 'Shopkeeper', 'Omonar'
	];

	public events = [
		'info', 'snore', 'map', 'carrots', 'gold', 'book', 'tree', 'leaves',
		'lamp', 'clocktower', 'window', 'knock',
		'achievement', 'menu-select', 'spell', 'shock',
		'computer', 'newspaper-stand', 'fruit-stand', 'foghorn', 'waves'
	];

	private dialogueSounds = [];
	private locationSounds = [];
	private eventSounds = [];

	constructor() {}

	/**
	 * Set the state variables for the game depending on which part we're playing
	 * @param part 1, 2, 3 or 4
	 */
	public initialiseGame(part: number) {
		this.currentPartIndex = part-1;
		const partData = this.parts[this.currentPartIndex];

		this.inventory.carrots = partData['carrots'];
		this.inventory.gold = partData['gold'];
		this.inventory.book = partData['book'];
		this.currentTask = partData['currentTask'];
		this.nextLocation = partData['initialLocation'];
		this.dialogueIndex = 0;

		for (let i = 0; i < partData['unlockedLocations'].length; i++) {
			this.locations[partData['unlockedLocations'][i]].cost = 0;
		}

		return partData['initialLocation'];
		// this.SKIPSTORY(65);
		// return 'town';
	}

	/**
	 * Method for debugging. Skip ahead in the dialogue to avoid clicking a million times.
	 * @param number Number of dialogue skips
	 */
	public SKIPSTORY(number: number) {
		for (let i = 0; i < number; i++) {
			this.getNextDialogue();
		}
	}

	/**
	 * Load all sound files to be used
	 */
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

	/**
	 * Go to the map if there is no dialogue active
	 */
	public goToMap() {
		if (!this.dialogueActive) {
			this.playSound('event', 'map');
			this.state = 'map';
		}
	}	

	/**
	 * Return the current task
	 */
	public getCurrentTask() {
		return this.tasks[this.currentTask].description;
	}

	/**
	 * Set the current task to the next task in the list
	 */
	public nextTask() {
		this.currentTask++;
	}

	/**
	 * Update the player's inventory
	 * @param item The item to be updated
	 * @param amount The amount to update the item by (either positive or negative)
	 */
	public modifyInventory(item: string, amount: number) {
		this.inventory[item] += amount;
	}

	/**
	 * Determines whether the player has enough carrots to unlock the specified location
	 * @param location The location to be unlocked
	 */
	public canUnlockLocation(location: string) {
		if (this.inventory.carrots >= this.locations[location].cost) {
			return true;
		}
		return false;
	}

	/**
	 * Trade carrots in return for unlocking the specified location
	 * @param location The location to be unlocked
	 */
	public unlockLocation(location: string) {
		if (this.inventory.carrots >= this.locations[location].cost) {
			this.inventory.carrots -= this.locations[location].cost;
			this.locations[location].cost = 0;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Return the cost of the specified location
	 * @param location The location to check the cost of
	 */
	public costOfLocation(location: string) {
		return this.locations[location]['cost'];
	}

	/**
	 * Return the next piece of dialogue to display, or perform the next event
	 */
	public getNextDialogue() {
		const dialogue = this.parts[this.currentPartIndex].dialogue[this.dialogueIndex];
		this.dialogueIndex++;

		if (!dialogue) { // nothing left
			this.currentLocation = '';
			this.state = 'map';
			return null;

		} else if (dialogue.name == 'map') { // go to the map
			this.nextLocation = dialogue['nextLocation'];
			this.currentLocation = '';
			this.state = 'map';
			return null;

		} else if (dialogue.name == 'task') { // set the next task
			this.nextTask();
			return this.getNextDialogue();

		} else if (dialogue.name == 'location') { // go to the specified location
			this.changeLocation(dialogue['location'], true);
			return null;

		} else if (dialogue.name == 'inventory') { // update the player's inventory
			this.modifyInventory(dialogue['item'], dialogue['modify']);
			this.playSound('event', dialogue['item']);
			return this.getNextDialogue();

		} else if (dialogue.name == 'event') { // play event sound
			this.playSound('event', dialogue['item']);
			return this.getNextDialogue();

		} else if (dialogue.name == 'endDialogue') { // end of dialogue for that location
			this.nextLocation = dialogue['location'];

		} else if (dialogue.name == 'endPart') { // end of part
			this.state = 'home';

		} else if (dialogue.name == 'info') {
			if (dialogue['sound']) {
				this.playSound('event', dialogue['sound']);
			} else {
				this.playSound('event', 'info');
			}
			return dialogue;

		} else { // show actual dialogue
			return dialogue;
		}
	}

	/**
	 * Go to the specified location
	 * @param location The location to go to
	 * @param updateNextLocation Whether or not the specified location is the next location in the story
	 */
	public changeLocation(location: string, updateNextLocation: boolean = false) {
		this.currentLocation = location;
		if (updateNextLocation) {
			this.nextLocation = location;
		}

		this.state = '';
		setTimeout(() => {	
			this.state = 'location';
		}, (50));
	}

	/**
	 * Play a sound
	 * @param type Type of the sound, can hold the value 'character', 'location' or 'event'
	 * @param item The sound to be played
	 */
	public playSound(type: string, item: string) {
		const soundsArray = this.getSoundArray(type);

		if (soundsArray[item]) {
			soundsArray[item].play();
		}
	}

	/**
	 * Stop a sound
	 * @param type Type of the sound, can hold the value 'character', 'location' or 'event'
	 * @param item The sound to be stopped
	 */
	public stopSound(type: string, item: string) {
		const soundsArray = this.getSoundArray(type);

		if (soundsArray[item]) {
			soundsArray[item].pause();
		}
	}

	/**
	 * Return the relevant sound array
	 * @param type Denotes which array to return
	 */
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
				{name: 'event', item: 'snore'},
				{name: 'Kiku', dialogue: 'Hey....'},
				{name: 'Kiku', dialogue: 'Hey!! Wake up.'},
				{name: 'Kiku', dialogue: 'Ah, you’re finally awake!'},
				{name: 'Kiku', dialogue: 'You’ve been asleep for nearly 13 hours... I guess knights really do love a good nap huh.'},
				{name: 'Kiku', dialogue: 'Sorry, where are my manners... I’m Kiku, one of the king’s trusted faries.'},
				{name: 'Kiku', dialogue: 'I’m sure you are aware that the residents of Arkala, the town not too far North from here, has gone silent. Nobody has heard a word from any of its residents in weeks.'},
				{name: 'Kiku', dialogue: 'Word has it that a curse has been cast over the town, but we do not know much more than that.'},
				{name: 'Kiku', dialogue: 'So, the king has decided to step in to find a cause for this mysterious silence, and has assigned you to journey over to the town to see what’s going on...'},
				{name: 'Kiku', dialogue: '... and assigned me as your companion! I will help guide you on your way.'},
				{name: 'Kiku', dialogue: 'I’ll give you some time to prepare, we will begin our journey on horseback as soon as possible!'},
				{name: 'Kiku', dialogue: 'And don’t you dare fall back asleep...'},
				{name: 'map', nextLocation: 'forest'},

				{name: 'Kiku', dialogue: 'This forest is so eerie... I feel like we’re being watched.'},
				{name: 'Olah', dialogue: 'Hello!'},
				{name: 'Kiku', dialogue: 'Ah! Who said that. I told you we weren’t alone.'},
				{name: 'Olah', dialogue: 'Me! Over here!'},
				{name: 'Olah', dialogue: 'My name is Olah, I am the hermit of these woods.'},
				{name: 'Olah', dialogue: 'I’ve not seen anyone walk down this path for quite some time... days, possibly even weeks'},
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
				{name: 'task'},
				{name: 'info', dialogue: 'Knock on the door to see if anyone\'s home.'},
				{name: 'endDialogue', location: 'town'},

				{name: 'info', dialogue: '*Knock knock*', sound: 'knock'},
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
				{name: 'event', item: 'shock'},
				{name: 'Kiku', dialogue: '... No?!?'},
				{name: 'Kiku', dialogue: 'I thought I told you to prepare!'},
				{name: 'Julissa', dialogue: 'Tell you what, I am also in need of some carrots for tonight’s dinner.'},
				{name: 'Julissa', dialogue: 'If I give you some gold to go to the market and fetch me a bunch of carrots then I will let you keep half of them.'},
				{name: 'Julissa', dialogue: 'Anything to avoid leaving the house.'},
				{name: 'Kiku', dialogue: 'That would be a massive help, thank you.'},
				{name: 'task'},
				{name: 'inventory', item: 'gold', modify: 5},
				{name: 'info', dialogue: 'You received 5 gold.'},
				{name: 'info', dialogue: 'Explore your surroundings to reach the market.'},
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
				{name: 'info', dialogue: 'Complete the following task:'},
				{name: 'info', dialogue: 'Give a 3-slide presentation on the history of carrots, and recent news in the carrot industry.'},
				{name: 'info', dialogue: 'End of part 1.'},
				{name: 'endPart', part: '1'}
			]
		},

		{
			initialLocation: 'market',
			carrots: 2,
			gold: 5,
			book: 0,
			unlockedLocations: ['forest', 'town'],
			currentTask: 3,
			dialogue: [
				{name: 'event', item: 'achievement'},
				{name: 'Shopkeeper', dialogue: 'Thanks, you two. You two came up with some really interesting ideas.'},
				{name: 'Shopkeeper', dialogue: 'I’ll be sure to put one of these on my news stand. Good work!'},
				{name: 'Shopkeeper', dialogue: 'As promised, here’s your carrots.'},
				{name: 'Kiku', dialogue: 'Great! Glad you like our ideas.'},
				{name: 'inventory', item: 'carrots', modify: 10},
				{name: 'inventory', item: 'gold', modify: -5},
				{name: 'info', dialogue: 'You spent 5 gold and received 10 carrots.'},
				{name: 'Shopkeeper', dialogue: 'And while you were giving your presentation, I remembered something that might help you in your quest.'},
				{name: 'Shopkeeper', dialogue: 'There is a wizard who lives in the lighthouse not too far South from here. Rumour has it that he is preparing some kind of spell to banish the witch.'},
				{name: 'Shopkeeper', dialogue: 'It might be worth you paying him a visit.'},
				{name: 'Kiku', dialogue: 'Thanks for that, we’ll be sure to drop by to see what he’s up to.'},
				{name: 'task'},
				{name: 'Kiku', dialogue: 'We’ll be off now.'},
				{name: 'Shopkeeper', dialogue: 'Good luck!'},
				{name: 'info', dialogue: 'Head out of the market and back to Julissa.'},
				{name: 'endDialogue', location: 'town'},

				{name: 'Julissa', dialogue: 'Oh you’re back! What took you so long?'},
				{name: 'Kiku', dialogue: 'We got caught up in a conversation with the shopkeeper.'},
				{name: 'Julissa', dialogue: 'Of course. It can be easy to get lost in conversation with that man sometimes.'},
				{name: 'Julissa', dialogue: 'Anyway, here’s your half. You got me the perfect amount of carrots I need to prepare dinner. Thanks for helping me out.'},
				{name: 'inventory', item: 'carrots', modify: -5},
				{name: 'Kiku', dialogue: 'No problem. We should have enough food now for us to continue in our quest.'},
				{name: 'task'},
				{name: 'Kiku', dialogue: 'Nice meeting you, Julissa.'},
				{name: 'Julissa', dialogue: 'See you around!'},
				{name: 'map', nextLocation: 'lighthouse'},

				{name: 'Kiku', dialogue: 'Well, here we are.'},
				{name: 'Kiku', dialogue: 'Lets hope that the wizard has some idea of what to do.'},
				{name: 'task'},
				{name: 'info', dialogue: 'Knock on the wizard\'s door.'},
				{name: 'endDialogue', location: 'lighthouse'},

				{name: 'event', item: 'knock'},
				{name: 'info', dialogue: '*Knock knock*'},
				{name: 'Omonar', dialogue: 'Evening. Who goes there?'},
				{name: 'Kiku', dialogue: 'We have been sent by the king of Orilon on a quest to restore peace to the town of Arkala.'},
				{name: 'Kiku', dialogue: 'Word has it that you seem to have an idea of how to rid the witch of this land. Is this true?'},
				{name: 'Omonar', dialogue: 'It is. I have been working on a spell for the past two weeks, which is very nearly complete.'},
				{name: 'Omonar', dialogue: 'However I am missing a book from my collection with some key information on how to complete my spell.'},
				{name: 'Omonar', dialogue: 'I can not complete the spell without that book, how terribly annoying.'},
				{name: 'Omonar', dialogue: 'I believe the last time I remember seeing this book was with my old wizard partner, Olah...'},
				{name: 'Omonar', dialogue: 'Unfortunately I haven’t seen Olah in almost 20 years and have no clue where he might be.'},
				{name: 'Kiku', dialogue: 'Wait, we met an Olah in the forest not too long ago!'},
				{name: 'Kiku', dialogue: 'Sounds like he has been living in the forest for quite some time. He definitely looked like he could be an ex wizard.'},
				{name: 'Omonar', dialogue: 'Goodness me, I have been searching for Olah for far too long.'},
				{name: 'Omonar', dialogue: 'He always talked about his plans for becoming a hermit but I never thought he would actually become one.'},
				{name: 'Omonar', dialogue: 'Anyway, would you two be willing to do me a favour?'},
				{name: 'Omonar', dialogue: 'Go find Olah once again and see if he still possesses the book I need.'},
				{name: 'task'},
				{name: 'Omonar', dialogue: 'He will know which one I am after. We would read from it almost every day back in the day.'},
				{name: 'Kiku', dialogue: 'Alright, we’ll go see if he has your book.'},
				{name: 'map', nextLocation: 'forest'},

				{name: 'Kiku', dialogue: 'Olah, are you here?'},
				{name: 'event', item: 'computer'},
				{name: 'Olah', dialogue: 'Hello! You’ve caught me in the middle of writing up my expenses in a spreadsheet...'},
				{name: 'Olah', dialogue: 'Excel can be a real pain sometimes. I wish I had listened in my IT classes in school.'},
				{name: 'Olah', dialogue: 'You two were here not too long ago, no? Have you already saved Arkala? What great news!'},
				{name: 'Kiku', dialogue: 'Not quite yet, hermit. We met an old wizard called Omonar up at the lighthouse.'},
				{name: 'Kiku', dialogue: 'You were right about the witch. She has turned Arkala into a prison. But Omonar has a plan to cast a spell on her in order to banish her forever!'},
				{name: 'Olah', dialogue: 'Omonar? That name rings a bell...'},
				{name: 'Kiku', dialogue: 'He says you two were old buddies, and that you might have a book that could be of use to him.'},
				{name: 'Olah', dialogue: 'I remember now! We used to do all sorts of wizardry together...'},
				{name: 'Olah', dialogue: '... but I eventually grew tired of the wizard lifestyle and decided to get away from it all. So I came here, and took some of my favourite spell books with me just for the memories.'},
				{name: 'Olah', dialogue: 'I’m glad to hear he is alive and well though.'},
				{name: 'Olah', dialogue: 'He is probably searching for this fantastic book here. We used to read from it all the time together.'},
				{name: 'Olah', dialogue: 'Tell you what. You two look like you know your way around a computer. Would you mind giving me a helping hand to write up this excel spreadsheet?'},
				{name: 'Olah', dialogue: 'I’ve been struggling with it all day. In return I’ll give you the spell book that Omonar is after.'},
				{name: 'info', dialogue: 'Complete the following task:'},
				{name: 'info', dialogue: 'Complete the provided Excel Exercise worksheet as best you can.'},
				{name: 'info', dialogue: 'End of part 2.'},
				{name: 'endPart', part: '2'}
			]
		},

		{
			initialLocation: 'forest',
			carrots: 0,
			gold: 0,
			book: 0,
			unlockedLocations: ['forest', 'town', 'lighthouse'],
			currentTask: 7,
			dialogue: [
				{name: 'event', item: 'achievement'},
				{name: 'Olah', dialogue: 'My expenses! They have never looked so magnificent.'},
				{name: 'Olah', dialogue: 'Thanks for your help. Here’s the book you’re after.'},
				{name: 'inventory', item: 'book', modify: 1},
				{name: 'info', dialogue: 'You received the spell book.'},
				{name: 'Olah', dialogue: 'It’s all about the logic and semantics of spells and advanced wizardry complexity theory.'},
				{name: 'Olah', dialogue: 'You should give it a read on your travels, it’s a good read.'},
				{name: 'Kiku', dialogue: 'I think we’ll pass on that one, thanks.'},
				{name: 'Kiku', dialogue: 'Let’s bring this back to Omonar right away. You might just have saved this town!'},
				{name: 'Olah', dialogue: 'Say hi from me when you see him again.'},
				{name: 'map', nextLocation: 'lighthouse'},

				{name: 'Omonar', dialogue: 'You have returned! Did you find the book that I was after?'},
				{name: 'Kiku', dialogue: 'I think so. Olah seemed to know exactly which book you were talking about.'},
				{name: 'Kiku', dialogue: 'Here it is.'},
				{name: 'task'},
				{name: 'inventory', item: 'book', modify: -1},
				{name: 'info', dialogue: 'You gave Omonar the spell book.'},
				{name: 'Omonar', dialogue: 'That’s the one. I have some very fond memories of this book.'},
				{name: 'Omonar', dialogue: 'Now I think I have all the resources I need to complete my spell.'},
				{name: 'Omonar', dialogue: 'It will however take me some time to do so, as I must cross-reference this book with the rest of my library.'},
				{name: 'Omonar', dialogue: 'There is still quite a bit of work to be done to make sense of all this literature collectively.'},
				{name: 'Omonar', dialogue: 'Say, you could help me organise and make sense of all this literature! Then we’d be able to get down to business in no time.'},
				{name: 'Omonar', dialogue: 'Could you write me a literature review of this here pile of books?'},
				{name: 'Kiku', dialogue: 'I wish I had listened in my magic classes...'},
				{name: 'info', dialogue: 'Complete the following task:'},
				{name: 'info', dialogue: 'Write a 2-paragraph literature review on the provided Harry Potter extract.'},
				{name: 'info', dialogue: 'End of part 3.'},
				{name: 'endPart', part: '3'}
			]
		},

		{
			initialLocation: 'lighthouse',
			carrots: 0,
			gold: 0,
			book: 0,
			unlockedLocations: ['forest', 'town', 'lighthouse'],
			currentTask: 5,
			dialogue: [
				{name: 'event', item: 'achievement'},
				{name: 'Omonar', dialogue: 'Having read through your literature review, I have finally constructed my spell!'},
				{name: 'Omonar', dialogue: 'This could have taken days with only one pair of hands, so thank you for your help.'},
				{name: 'Kiku', dialogue: 'We do our best.'},
				{name: 'Omonar', dialogue: 'The time has finally come to restore peace to my beloved town. Here it goes...'},
				{name: 'Omonar', dialogue: 'Lumergio stupectus... Levasi Evicum... Illumia Demigeo...'},
				{name: 'event', item: 'spell'},
				{name: 'Omonar', dialogue: 'ABRA-CA-DABRA!!!'},
				{name: 'info', dialogue: 'You feel a shudder in the ground.'},
				{name: 'Kiku', dialogue: 'Wow, I never knew abracadabra was a real spell used in wizardry.'},
				{name: 'Omonar', dialogue: 'It isn’t, really. It’s mostly used for dramatic effect.'},
				{name: 'Omonar', dialogue: 'But, if my calculations were correct...'},
				{name: 'Omonar', dialogue: '... peace has been restored in Arkala at last! What a great day.'},
				
				{name: 'info', dialogue: 'End of part 4.'},
				{name: 'info', dialogue: 'Thanks for playing. Hopefully you learnt some useful skills.'},
				{name: 'endPart', part: '4'}
			]
		}
	];

}
