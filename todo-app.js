(function() {
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form'),
            input = document.createElement('input'),
            buttonWrapper = document.createElement('div'),
            button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary', 'disabled');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    }

    // создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // помещаем и обновляем список дел в localStorage
    let arrWithTodos = [];

    function updateLocalStorage(elements, ownerTodos) {
        arrWithTodos = [];
        for (let i of elements) {
            let obj = {
                name: i.childNodes[0].data,
                done: i.classList.contains('list-group-item-success')
            };
            arrWithTodos.push(obj);
        }
        localStorage.setItem(ownerTodos, JSON.stringify(arrWithTodos));
    }

    function createTodoItem(name, ownerTodos) {
        let item = document.createElement('li');

        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div'),
            doneButton = document.createElement('button'),
            deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        if (typeof name !== 'object') {
            item.textContent = name;
        } else {
            item.textContent = name.name;
            if (name.done) {
                item.classList.add('list-group-item-success');
            }
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');
            updateLocalStorage(item.parentNode.children, ownerTodos);
        });
        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove();
            }
            updateLocalStorage(item.ownerDocument.all[20].children, ownerTodos);
        });

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton
        };
    }

    function createTodoApp(container, title = 'Список дел', todosDefault = [], ownerTodos = '') {
        let todoAppTitile = createAppTitle(title),
            todoItemForm = createTodoItemForm(),
            todoList = createTodoList();

        container.append(todoAppTitile);
        container.append(todoItemForm.form);
        container.append(todoList);

        // 1 задание
        // if (todosDefault) {
        //     let todoDefault;
        //     for (let todo of todosDefault) {
        //         todoDefault = createTodoItem(todo, myTodos);
        //         todoList.append(todoDefault.item);
        //     }
        // }

        // парсим и отображаем дела из localStorage
        arrWithTodos = JSON.parse(localStorage.getItem(ownerTodos));
        if (arrWithTodos) {
            for (let obj of arrWithTodos) {
                todoList.append(createTodoItem(obj, ownerTodos).item);
            }
        }
        
        // добавляем обработчик событий, который при вводе делает кнопку активной,
        // а также проверяет наличие символов в поле для ввода
        todoItemForm.input.addEventListener('input', function() {
            todoItemForm.button.classList.remove('disabled');
            if (!todoItemForm.input.value) {
                todoItemForm.button.classList.add('disabled');
            }
        });

        // если поле для ввода пустое, выводим сообщение о том, чтобы пользователь ввел название дела
        todoItemForm.button.addEventListener('click', function() {
            if (!todoItemForm.input.value) {
                alert('Введите название дела в поле');
            }
        });

        // браузер создает событие submit на форме по нажатию Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value, ownerTodos);

            // создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            updateLocalStorage(todoList.children, ownerTodos);

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';

            // делаем кнопку неактивной после её нажатия
            todoItemForm.button.classList.add('disabled');
        });
    }

    window.createTodoApp = createTodoApp;
})();