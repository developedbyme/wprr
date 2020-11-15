import React from "react";
import Wprr from "wprr/Wprr";

import Layout from "wprr/elements/layout/Layout";

export default class Operations extends Layout {
	
	constructor(aProps) {
		super(aProps);
	}
	
	_getOptions(aOptions, aSections) {
		if(!aOptions) {
			let mappedSections = Wprr.utils.array.getPathsInObject(aSections);
			let sectionNames = Wprr.utils.array.mapField(mappedSections, "key");
			aOptions = Wprr.utils.KeyValueGenerator.tranlatedList(sectionNames, this.getReference("wprr/textManager"), "site.operations");
		}
		
		return aOptions;
	}
	
	_getLayout(aSlots) {
		
		let sections = aSlots.prop("sections", {});
		let options = aSlots.prop("options", null);
		
		let externalStorageSource = Wprr.sourceReference("externalStorage");
		let selectionSource = externalStorageSource.deeper("selection");
		let operationSource = externalStorageSource.deeper("operation");
		
		let switchableArea = Wprr.creators.SwitchableAreaCreator.getReactElementsForDynamicClasses(operationSource, sections, "none");
		
		return <div className="batch-operations">
			<Wprr.FlexRow className="micro-item-spacing">
				<Wprr.EditableProps editableProps="operation" externalStorage={externalStorageSource}>
					<Wprr.CustomSelection valueName="operation"
						buttonMarkup={
							aSlots.slot("button", React.createElement(Wprr.layout.form.DropdownButton,
								{
									"className": "cursor-pointer batch-operations-text batch-operations-select-title",
									"text": Wprr.sourceTranslation("Select operation", "site.admin.selectOperation")
								},
								aSlots.slot("buttonContent", React.createElement(Wprr.InsertElement,
									{
										element: React.createElement(Wprr.TranslationOrId, {"id": operationSource, "prefix": "site.operations"})
									}))
								)
							)
						}
						optionSpacingMarkup={aSlots.slot("optionSpacing", <div className="spacing small" />)}
						options={Wprr.sourceFunction(this, this._getOptions, [options, sections])}
					/>
				</Wprr.EditableProps>
				{
					React.createElement(Wprr.HasData, {"check": selectionSource, "checkType": "notEmpty"},
						React.createElement("div", {"className": "batch-operations-text"},
							Wprr.idText("for", "site.for"),
							React.createElement("span", {}, " "),
							React.createElement(Wprr.layout.items.ItemNames, {ids: selectionSource, sourceUpdates: selectionSource, "namePath": "fieldByName.name.field.value.firstName"})
						)
					)
				}
			</Wprr.FlexRow>
			{switchableArea}
		</div>;
	}
}