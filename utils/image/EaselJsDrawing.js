import Wprr from "wprr/Wprr";

// import EaselJsDrawing from "wprr/utils/image/EaselJsDrawing";
export default class EaselJsDrawing {
	
	constructor() {
		
		this.width = 200;
		this.height = 200;
		
		this._canvas = null;
		this._stage = null;
		
		this.commands = new Wprr.utils.CommandGroup();
		this.commands.setOwner(this);
	}
	
	getStage() {
		if(!this._stage) {
			this._stage = new createjs.Stage(this.getCanvas());
		}
		
		return this._stage;
	}
	
	getCanvas() {
		if(!this._canvas) {
			this._canvas = document.createElement("canvas");
			
		}
		
		return this._canvas;
	}
	
	draw() {
		//console.log("draw");
		
		let canvas = this.getCanvas();
		
		canvas.width = this.width;
		canvas.height = this.height;
		
		let stage = this.getStage();
		
		this.commands.perform("updateItems", {"stage": stage, "canvas": canvas, "width": this.width, "height": this.height});
		
		stage.update();
	}
}