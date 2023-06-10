function fetchData() {
  fetch("https://port-0-todo-backend-dihik2mliq3l6b0.sel4.cloudtype.app/todo")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const todoContainer = document.getElementById("todolist");

      data.forEach((todo) => {
        const todoItem = createTodoItem(todo);
        todoContainer.appendChild(todoItem);
      });
    });
}

function createTodoItem(todo) {
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo");
  todoItem.id = `todo-${todo.id}`;

  const todoTitle = document.createElement("div");
  todoTitle.classList.add("todo-title");
  todoTitle.textContent = todo.title;

  const todoImages = document.createElement("div");

  const editIcon = document.createElement("img");
  editIcon.src =
    "https://cdn.discordapp.com/attachments/1029174181646041190/1117093006865072230/pencil.png";
  editIcon.alt = "Edit";
  editIcon.addEventListener("click", () => handleEditClick(todo.id));

  const deleteIcon = document.createElement("img");
  deleteIcon.src =
    "https://cdn.discordapp.com/attachments/1029174181646041190/1117092981829292062/bin.png";
  deleteIcon.alt = "Delete";
  deleteIcon.addEventListener("click", () => handleDeleteClick(todo.id));

  todoImages.appendChild(editIcon);
  todoImages.appendChild(document.createTextNode("\u00A0 \u00A0")); // 공백 문자 추가
  todoImages.appendChild(deleteIcon);

  todoItem.appendChild(todoTitle);
  todoItem.appendChild(todoImages);

  return todoItem;
}

function deleteTodoItem(id) {
  fetch(
    `https://port-0-todo-backend-dihik2mliq3l6b0.sel4.cloudtype.app/todo/${id}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => {
      if (response.ok) {
        console.log("Todo item has been deleted.");
        const todoItem = document.getElementById(`todo-${id}`);
        todoItem.remove(); // 해당 요소를 DOM에서 제거합니다.
      } else {
        console.log("Failed to delete todo item.");
      }
    })
    .catch((error) => {
      console.log("Error occurred while deleting todo item:", error);
    });
}

document.addEventListener("click", function (event) {
  const target = event.target;
  if (target.matches(".edit-icon")) {
    const todoItem = target.closest(".todo");
    const todoId = todoItem.dataset.id;
    editTodoItem(todoId);
  } else if (target.matches(".delete-icon")) {
    const todoItem = target.closest(".todo");
    const todoId = todoItem.dataset.id;
    deleteTodoItem(todoId);
  }
});

function editTodoItem(id) {
  console.log("Editing todo item with ID:", id);

  const todoItem = document.getElementById(`todo-${id}`);
  const todoTitle = todoItem.querySelector(".todo-title");
  const currentTitle = todoTitle.textContent;

  const updatedTitle = prompt("수정할 내용을 입력해 주세요", currentTitle);

  if (updatedTitle) {
    todoTitle.textContent = updatedTitle;

    const data = {
      title: updatedTitle,
      description: "",
    };

    // 서버에 해당 항목 수정 요청을 보내고 성공적으로 수정된 후에 아래 코드를 실행합니다.
    saveTodoItem(id, data);
  }
}

function handleDeleteClick(id) {
  // 삭제 요청을 보냅니다.
  deleteTodoItem(id);
}

function handleEditClick(id) {
  // 수정 요청을 합니다.
  editTodoItem(id);
}

function saveTodoItem(id, data) {
  console.log("Saving todo item with ID:", id);

  // 서버에 해당 항목 수정 요청을 보내고 성공적으로 수정된 후에 아래 코드를 실행합니다.
  fetch(
    `https://port-0-todo-backend-dihik2mliq3l6b0.sel4.cloudtype.app/todo/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  )
    .then((response) => {
      if (response.ok) {
        console.log("Todo item with ID", id, "has been updated.");
      } else {
        console.log("Failed to update todo item with ID:", id);
      }
    })
    .catch((error) => {
      console.log("Error occurred while updating todo item:", error);
    });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const inputField = document.getElementById("todo-input");
    const value = inputField.value;

    const data = {
      title: value,
      description: "",
    };

    saveTodoItem(data);

    console.log("Entered value:", value);

    // 여기에서 원하는 동작을 수행할 수 있습니다.

    inputField.value = ""; // 입력 필드를 비웁니다.
  }
});

function saveTodoItem(data) {
  console.log("Saving todo item:", data);

  // 서버에 새로운 항목을 추가하는 요청을 보냅니다.
  fetch("https://port-0-todo-backend-dihik2mliq3l6b0.sel4.cloudtype.app/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("New todo item has been saved.");
        fetchData(); // 변경된 항목 목록을 다시 가져옵니다.
      } else {
        console.log("Failed to save todo item.");
      }
    })
    .catch((error) => {
      console.log("Error occurred while saving todo item:", error);
    });
}

window.onload = function () {
  fetchData();
};

setInterval(function () {
  // 5초마다 실행할 동작을 여기에 작성합니다.
  console.log("5 seconds elapsed, refreshing the page");
  location.reload(); // 페이지 새로고침
}, 5000); // 5초를 밀리초로 표현한 값
