let gorevListesi = [];

if (localStorage.getItem("gorevListesi") != null) {
  gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

const taskInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btn-clear");
const filters = document.querySelectorAll(".filters span");
let editId;
let isEditTask = false;

// Eleman Oluşturma
displayTask("all");
function displayTask(filter) {
  ul = document.querySelector("#task-list");
  ul.innerHTML = "";

  if (gorevListesi.length == 0) {
    ul.innerHTML = "<p class='p-3 m-0'>Gorev Listeniz Boş.</p>";
  } else {
    for (let gorev of gorevListesi) {
      let completed = gorev.durum == "completed" ? "checked" : "";

      if (filter == gorev.durum || filter == "all") {
        let li = `
    <li class="task list-group-item">
       <div class="form-check">
         <input type="checkbox" onclick = "updateStatus(this)" class="form-check-input" ${completed} id="${gorev.id}" />
         <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
       </div>
       <div class="dropdown">
         <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa-solid fa-ellipsis-vertical"></i>
         </button>
          <ul class="dropdown-menu">
            <li><a onclick= "deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Sil</a></li>
            <li><a onclick = 'editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
          </ul>
       </div>
   </li>
  `;

        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}

// Eleman Ekleme
document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document
  .querySelector("#btnAddNewTask")
  .addEventListener("keypress", function () {
    if (e.key == "Enter") {
      document.querySelector("#btnAddNewTask").click();
    }
  });

for (let span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTask(span.id);
  });
}
function newTask(e) {
  if (taskInput.value == "") {
    alert("Değer Girmelisiniz");
  } else {
    if (!isEditTask) {
      // ekleme
      gorevListesi.push({
        id: gorevListesi.length + 1,
        gorevAdi: taskInput.value,
        durum: "pending",
      });
    } else {
      // güncelleme
      for (let gorev of gorevListesi) {
        if (gorev.id == editId) {
          gorev.gorevAdi = taskInput.value;
        }
        isEditTask = false;
      }
    }

    taskInput.value = "";
    displayTask(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
  }

  e.preventDefault();
}

// eleman silme
function deleteTask(id) {
  let deletedId;

  // yöntem 1
  // for (let index in gorevListesi) {
  //   if (gorevListesi[index].id == id) {
  //     deletedId = index;
  //   }
  // }

  // yöntem 2
  // deletedId = gorevListesi.findIndex(function (gorev) {
  //   return gorev.id == id;
  // });

  // yöntem 3
  deletedId = gorevListesi.findIndex((gorev) => gorev.id == id);

  gorevListesi.splice(deletedId, 1);
  displayTask(document.querySelector("span.active").id);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}

// eleman düzenleme
function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

// elemanların hepsini silme
btnClear.addEventListener("click", function () {
  gorevListesi.splice(0, gorevListesi.length);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
  displayTask();
});

// elemanların üzerini çizme
function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let durum;

  if (selectedTask.checked) {
    label.classList.add("checked");
    durum = "completed";
  } else {
    label.classList.remove("checked");
    durum = "pending";
  }

  for (let gorev of gorevListesi) {
    if (gorev.id == selectedTask.id) {
      gorev.durum = durum;
    }
  }
  displayTask(document.querySelector("span.active").id);
  localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}
