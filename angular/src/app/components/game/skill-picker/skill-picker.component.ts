import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-skill-picker',
	templateUrl: './skill-picker.component.html',
	styleUrls: ['./skill-picker.component.css']
})
export class SkillPickerComponent implements OnInit {

	public suggestedSkills = [
		['Presentation Skills', 'Leadership'],
		['Problem Solving', 'Teamwork'],
		['Critical Thinking', 'Spelling'],
	];

	public chosenSkills = [];

	constructor() { }

	ngOnInit() {
	}

	public addSkill(skill: any) {
		this.chosenSkills.push(skill);
	}

	public onNextClick() {
		// use main.service to send the chosen skills to the backend, and store in database
	}
}
