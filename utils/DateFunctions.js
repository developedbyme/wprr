import objectPath from "object-path";
import Wprr from "wprr/Wprr";

import moment from "moment";

//import DateFunctions from "wprr/utils/DateFunctions";
export default class DateFunctions {
	
	static isInRange(aDate, aStartTime, aEndTime) {
		
		if(!aDate) {
			return false;
		}
		
		let currentTime = moment(aDate);
		let canBeInverted = false;
		
		if(typeof(aStartTime) === "string" && typeof(aEndTime) === "string") {
			if(aStartTime.indexOf("---") === 0) {
				//Day interval
				aStartTime = currentTime.format("Y-MM") + "-" + aStartTime.substring(3, aStartTime.length);
				aEndTime = currentTime.format("Y-MM") + "-" + aEndTime.substring(3, aEndTime.length);
				canBeInverted = true;
			}
			else if(aStartTime.indexOf("--") === 0) {
				//Month interval
				let delimiter = "";
				if(aStartTime.length <= 5 || aStartTime[4] === "-") {
					delimiter = "-";
				}
				else if(aStartTime[2] === "W" && aStartTime[5] === "-") {
					delimiter = "-";
				}
				aStartTime = currentTime.format("Y") + delimiter + aStartTime.substring(2, aStartTime.length);
				aEndTime = currentTime.format("Y") + delimiter + aEndTime.substring(2, aEndTime.length);
				canBeInverted = true;
			}
			else if(aStartTime.indexOf("T--") === 0) {
				//Second interval
				aStartTime = currentTime.format("Y-MM-DDTHH:mm") + ":" + aStartTime.substring(3, aStartTime.length);
				aEndTime = currentTime.format("Y-MM-DDTHH:mm") + ":" + aEndTime.substring(3, aEndTime.length);
				canBeInverted = true;
			}
			else if(aStartTime.indexOf("T-") === 0) {
				let delimiter = "";
				if(aStartTime.length === 4 || aStartTime[4] === ":") {
					delimiter = ":";
				}
				aStartTime = currentTime.format("Y-MM-DDTHH") + delimiter + aStartTime.substring(2, aStartTime.length);
				aEndTime = currentTime.format("Y-MM-DDTHH") + delimiter + aEndTime.substring(2, aEndTime.length);
				canBeInverted = true;
			}
			else if(aStartTime.indexOf("T") === 0) {
				aStartTime = currentTime.format("Y-MM-DD") + aStartTime;
				aEndTime = currentTime.format("Y-MM-DD") + aEndTime;
				canBeInverted = true;
			}
		}
		
		let startTime = moment(aStartTime);
		let endTime = moment(aEndTime);
		let isInverted = false;
		
		if(endTime < startTime) {
			if(!canBeInverted) {
				console.error("Interval is ending before it is starting");
				return false;
			}
			let tempTime = startTime;
			startTime = endTime;
			endTime = tempTime;
			isInverted = true;
		}
		
		let isInRange = (currentTime >= startTime && currentTime < endTime);
		
		if(isInverted) {
			isInRange = !isInRange;
		}
		
		return isInRange;
	}
}