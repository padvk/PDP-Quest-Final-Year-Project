import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class MainService {

	// public API_URL = 'http://pdp.test';
	public API_URL = 'http://127.0.0.1:8000';

	private testUrl = this.API_URL + '/getGameData';

	constructor(private http: HttpClient) { }

	public callEndpoint() {
		return this.http.get(this.testUrl);
	}
}
