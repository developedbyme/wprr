// import SyncronizedClock from "wprr/utils/timing/SyncronizedClock";
/**
 * A clock that is syncronized with a remote clock
 */
export default class SyncronizedClock {
	
	/**
	 * Contructor
	 */
	constructor() {
		this._syncTime = 0;
		this._correctTime = 0;
		this._localTime = 0;
		
		this._fromDate = 0;
	}
	
	sync(aCorrectTime) {
		
		let currentTime = (new Date()).valueOf();
		
		this._correctTime = aCorrectTime;
		this._syncTime = currentTime;
		this._localTime = currentTime;
		
		console.log(">>>", this._correctTime, this._localTime);
	}
	
	setSyncDate(aDateString) {
		let tempArray = aDateString.split(" ");
		let date = tempArray[0];
		let time = tempArray[1];

		tempArray = date.split("-");
		let year = 1*tempArray[0];
		let month = (1*tempArray[1])-1;
		let day = 1*tempArray[2];

		tempArray = time.split(":");
		let hour = parseInt(tempArray[0], 10);
		let minute = parseInt(tempArray[1], 10);
		let second = parseInt(tempArray[2], 10);

		this._fromDate = new Date(year, month, day, hour, minute, second);
	}
	
	getDiff() {
		return this._correctTime-this._localTime;
	}
	
	getCurrentTime() {
		let currentTime = (new Date()).valueOf();
		let adjustedTime = new Date(currentTime+this.getDiff());
		
		return adjustedTime;
	}
	
	getCurrentDate() {
		
		let timePassed = (new Date()).valueOf()-this._syncTime;
		
		let returnDate = new Date(this._fromDate.valueOf()+this.getDiff()+timePassed);
		
		return returnDate;
	}
}