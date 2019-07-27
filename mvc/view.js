class ListView extends EventEmitter {
  constructor(model, elements) {
    super();
    this._model = model;
    this._elements = elements;
  
    model
      .on('itemAdded', () => this.rebuildList())
      .on('itemRemoved', () => this.rebuildList())
      .on('itemChecked', () => this.rebuildList())
      .on('itemEdited', () => this.rebuildList())
      .on('editedItemSaved', () => this.rebuildList());

    elements.list.addEventListener('change', event => this
      .emit('listModified', event.target.selectedIndex));
    elements.addButton.addEventListener('click', () => this
      .emit('addButtonClicked'));
  }

  show() {
    this.rebuildList();
  }

  rebuildList() {
    this._elements.list.innerHTML = '';

    this._model.getItems().forEach(task => {
      this.renderTask(task);
    }),

    this.rebuildTasksInfo();
  }

  rebuildTasksInfo() {
    const doneTasksArr = this._model.getItems().filter(el => el.done === true);
    const html = `
      <p>all: ${this._model.getItems().length}</p>
      <p>done: ${doneTasksArr.length}</p>
    `;
    footerContainer.innerHTML = html;
  }

  renderTask({ text, id, done }) {
    const html = `
      <p class="list-checkbox">+</p>
      <p class="list-element-text"></p>
      <p class="list-delete-btn">delete</p>
    `;

    const listDivElement = document.createElement('div');

    listDivElement.innerHTML = html;
    listDivElement.classList.add('list-element');
    this._elements.list.appendChild(listDivElement);

    const checkBox = listDivElement.getElementsByClassName('list-checkbox')[0];
    const taskTextElement = listDivElement.getElementsByClassName('list-element-text')[0];
    const deleteBtn = listDivElement.getElementsByClassName('list-delete-btn')[0];

    taskTextElement.innerText = text;

    if (done) {
      checkBox.style.backgroundColor = 'red';
    }

    checkBox.addEventListener('click', () => this.emit('checkButtonClicked', id));
    deleteBtn.addEventListener('click', () => this.emit('delButtonClicked', id));
    taskTextElement.addEventListener('dblclick', () => this.renderEditTaskTemplate(id, listDivElement));
  }

  renderEditTaskTemplate(id, listDivElement) {
    let textField = listDivElement.getElementsByClassName('list-element-text')[0];

    textField.innerHTML = `
      <input type="text" placeholder="edit text" class="input-task-edit" value="${textField.innerText}">
      <button class="save-btn">save</button>
    `;
    const saveBtn = textField.getElementsByClassName('save-btn')[0];

    saveBtn.addEventListener('click', () => this.emit('saveButtonClicked', { id, textField }));
  }
}

class ListController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('addButtonClicked', () => this.addItem());
    view.on('delButtonClicked', index => this.delItem(index));
    view.on('checkButtonClicked', index => this.checkItem(index));
    view.on('saveButtonClicked', item => this.saveEditedItem(item));
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
}
