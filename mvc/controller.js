class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    (this._events[event] || (this._events[event] = [])).push(listener);

    return this;
  }

  emit(event, arg) {
    (this._events[event] || []).slice().forEach(listener => listener(arg));
  }
}

class ListController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('addButtonClicked', () => this.addItem());
    view.on('delButtonClicked', (index) => this.delItem(index));
    view.on('checkButtonClicked', (index) => this.checkItem(index));
    view.on('saveButtonClicked', (item) => this.saveEditedItem(item));
    view.on('getToDoItems', () => this.getItems());
  }

  addItem() {
    const text = inputElement.value;
    if (!text) return;

    const id = +new Date().getTime();

    this._model.addItem({ text, id });
    inputElement.value = '';
  }

  checkItem(id) {
    this._model.checkItem(id);
  }

  delItem(id) {
    this._model.delItem(id);
  }

  saveEditedItem({ id, textField }) {
    const editedTaskText = textField.getElementsByClassName('input-task-edit')[0].value;
    this._model.saveEditedItem(id, editedTaskText);
  }

  getItems() {
    return this._model.getItems();
  }
}
