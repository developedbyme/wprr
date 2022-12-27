import React from "react";
import Wprr from "wprr/Wprr";

import WprrBaseObject from "wprr/WprrBaseObject";

export default class YoutubePlayer extends WprrBaseObject {
	
	_construct() {
		super._construct();
	}
	
	_renderMainElement() {
		
		let ratio = this.getFirstInputWithDefault("ratio", 9/16);
		let url = this.getFirstInput("url");
		
		return <div>
			<Wprr.ElementSize>
				<Wprr.Adjust adjust={[Wprr.adjusts.ratio(Wprr.sourceProp("width"), ratio, "height"), Wprr.adjusts.styleFromHeight()]} sourceUpdates={this._ratio}>
					<div className="full-width">
						<iframe src={url} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" className="full-size" />
					</div>
				</Wprr.Adjust>
			</Wprr.ElementSize>
		</div>;
	}
}