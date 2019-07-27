class ListModel extends EventEmitter {
  constructor(items) {
    super();
    this._items = items || [];
    this._selectedIndex = -1;
  }

  getItems() {
    return this._items.slice();
  }

  addItem(item) {
    this._items.push(item);
    this.emit('itemAdded', item);
  }

  checkItem(id) {
    const item = this._items.find(el => el.id === id);
    if (item.done) return;

    item.done = true;
    this.emit('itemChecked', item);
  }

  delItem(id) {
    const index = this._items.findIndex(el => el.id === id);
    const item = this._items.splice(index, 1)[0];
    this.emit('itemRemoved', item);
  }

  saveEditedItem(id, newText) {
    const item = this._items.find(el => el.id === id);
    item.text = newText;

    this.emit('editedItemSaved', item);
  }
}
