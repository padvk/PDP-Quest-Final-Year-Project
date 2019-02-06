import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StateService {

	public currentTask = 'Make your way through the forest towards the town of Arkala';
	public inventory = {
		carrots: 0,
		gold: 5,
		wand: 1
	};
	public locations = {
		forest: {name: 'Forest', cost: 0, unlocked: true},
		town: {name: 'Town Centre', cost: 3, unlocked: false},
		lighthouse: {name: 'Lighthouse', cost: 7, unlocked: false}
	};

	constructor() { }

	/**
		Tasks:
		Make way to the town of Arkala
		Fetch carrots from the market for Julissa
		Make way to the lighthouse to see what the wizard is up to
		Get the special wand from Olah and return it to Omonar
	*/

	public setTask(task: string) {
		this.currentTask = task;
	}

	public addToInventory(item: string, amount: number) {
		this.inventory[item] += amount;
	}

	public unlockLocation(location: string) {
		this.locations[location]['unlocked'] = true;
	}

	public canAccessLocation(location: string) {
		return this.locations[location]['unlocked'];
	}

}
