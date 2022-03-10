import Wprr from "wprr";
import React from "react";

export default class DragAndDropList extends Wprr.BaseObject {
  constructor(aProps) {
    super(aProps);
    this.state = {
      items: [],
    }
  }

  componentDidMount() {
    this.setState({
      items: this.getFirstInput("items"),
    })
  }

  onDragStart(e, index) {
    this.draggedItem = this.state.items[index];
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragOver(e, index) {
    e.preventDefault();
    const draggedOverItem = this.state.items[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let items = this.state.items.filter(item => item !== this.draggedItem );

    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);

    this.setState({ items });
  };

  onDragEnd() {
    this.draggedItem = null;
  };


  _renderMainElement() {
    console.log(this.state);
    
    const disableChildElementsDrag = {
      draggable: true,
      onDragStart: (e) => e.preventDefault(),
    }
    
    return (
		React.createElement("wrapper", null, /*#__PURE__*/React.createElement("ul", {
		  className: "no-margins no-paddings list-style-none",
		  onDragOver: e => e.preventDefault
		}, (this).state.items.length ? (this).state.items.map((item, index) => /*#__PURE__*/React.createElement("li", {
		  className: "cursor-move",
		  key: item.id,
		  onDragOver: e => (this).onDragOver(e, index)
		}, /*#__PURE__*/React.createElement("div", {
		  draggable: true,
		  onDragStart: e => (this).onDragStart(e, index),
		  onDragEnd: (this).onDragEnd
		}, (this).props.children(item, disableChildElementsDrag)))) : null))
    );
  }
}