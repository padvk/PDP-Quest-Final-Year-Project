import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class MainService {

	// public API_URL = 'http://pdp.test';
	public API_URL = 'http://people.bath.ac.uk/ph471/FYP/';

	private authUrl = this.API_URL + 'auth/auth.php';
	private endUrl = this.API_URL + 'auth/end.php';

	private part: number;
	private password: string;

	constructor(private http: HttpClient) { }

	public auth(part: number, password: string) {
		this.part = part;
		this.password = password;

		const data = JSON.stringify({part: part, password: password});

		return this.http.post(this.authUrl, data);
	}

	public end() {
		const data = JSON.stringify({part: this.part, password: this.password});

		return this.http.post(this.endUrl, data);
	}
}
