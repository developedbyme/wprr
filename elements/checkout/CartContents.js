import React from 'react';
import Wprr from "wprr";


let cacheValue = (new Date()).valueOf();

//import CartContents from "./CartContents";
export default class CartContents extends Wprr.BaseObject {

	constructor(props) {
		super(props);
		
		this._addMainElementClassName("centered-content-text");
	}
	
	_removeItem(aKey) {
		let project = this.getReference("wprr/project");
		
		let loader = project.getActionLoader("woocommerce/remove-from-cart");
		
		loader.setJsonPostBody({
			"key": aKey
		});
		
		loader.addSuccessCommand(Wprr.commands.reload());
		
		loader.load();
	}
	
	_renderMainElement() {
		//console.log("./CartContents::_renderMainElement");
		
		let cartUrl = Wprr.utils.wprrUrl.getCartUrl();
		cartUrl = Wprr.utils.url.addQueryString(cartUrl, "cache", cacheValue);
		
		return <div>
			<Wprr.DataLoader loadData={{"originalCart": cartUrl}}>
				<Wprr.HasData check={Wprr.sourceProp("originalCart", "items")} checkType="notEmpty">
					<Wprr.layout.List items={Wprr.sourceProp("originalCart", "items")}>
						<Wprr.DataLoader loadData={{"product": Wprr.sourceCombine("wprr/v1/range-item/product/idSelection/preview,product?ids=", Wprr.sourceReference("loop/item", "product.id"))}}>
							<Wprr.AddReference data={Wprr.sourceProp("product")} as="product">
								<div className="standard-box standard-box-padding">
									<Wprr.FlexRow className="justify-between vertically-center-items" itemClasses="flex-resize,flex-no-resize">
										<Wprr.Link href={Wprr.sourceReference("loop/item", "product.permalink")} target="_blank">
											<Wprr.FlexRow className="small-item-spacing vertically-center-items" itemClasses="flex-no-resize,flex-resize">
												<div className="product__img-container small overflow-hidden">
													<Wprr.WprrLazyImage className="image background-contain full-size" data={Wprr.sourceReference("product", "image")} />
												</div>
												<div>
													{Wprr.text(Wprr.sourceReference("loop/item", "product.title"))}
													<div className="spacing small" />
													<div className="small-description result-line-height no-paragraph-margins-around">
														{Wprr.text(Wprr.sourceReference("product", "shortDescription"), "html")}
													</div>
												</div>
											</Wprr.FlexRow>
										</Wprr.Link>
										<Wprr.CommandButton commands={Wprr.commands.callFunction(this, this._removeItem, Wprr.sourceReference("loop/item", "key"))}>
											<Wprr.Image overrideMainElementType="img" src="icons/remove.svg" location="images" />
										</Wprr.CommandButton>
									</Wprr.FlexRow>
								</div>
							</Wprr.AddReference>
						</Wprr.DataLoader>
						<div className="spacing small" data-slot="spacing" />
					</Wprr.layout.List>
				</Wprr.HasData>
				<Wprr.HasData check={Wprr.sourceProp("cart", "items")} checkType="invert/notEmpty">
					<div>
						
					</div>
				</Wprr.HasData>
			</Wprr.DataLoader>
		</div>;
	}
	
	static getWpAdminEditor() {
		console.log("getWpAdminEditor");
		
		let dataSettings = {
			
		};
		
		return <Wprr.layout.admin.WpBlockEditor dataSettings={dataSettings}>
			<div></div>
		</Wprr.layout.admin.WpBlockEditor>;
	}
}
