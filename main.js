const inputElement = document.getElementsByClassName('input-task')[0];
const addTaskButton = document.getElementsByClassName('add-task-btn')[0];
const listContainer = document.getElementsByClassName('list-container')[0];
const footerContainer = document.getElementsByClassName('footer')[0];

window.addEventListener('load', () => {
  const model = new ListModel([
    {text: 'task1', id: 1, done: true},
    {text: 'task2', id: 2}
  ]);
  const view = new ListView(model, {
    'list': listContainer,
    'addButton': addTaskButton,
  });

  const controller = new ListController(model, view);

  view.show();
});
