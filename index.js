const firstSpan = document.getElementById("first");
const secondSpan = document.getElementById("second");
const thirdSpan = document.getElementById("third");
const searchEngine = document.querySelector(".search-engine");
const noTasksMessage = document.getElementById("no-tasks-message");
const noTasksMessageText = noTasksMessage.firstElementChild;
const options = document.querySelector(".options");
const modal = document.querySelector(".modal");
const trash = document.querySelector("button.trash");
const ul = document.querySelector("ul");
const addTaskBtn = document.getElementById("add-task");

const taskList = [];
const taskData = {
  task: [],
};

searchEngine.style.display = "none";

const pickColorFunc = () => {
  const colors = "blue,red,green,yellow,orange,pink,aqua,purple".split(",");
  const randomNum = Math.floor(Math.random() * colors.length);
  return colors[randomNum];
};

const changeInputColor = () => {
  firstSpan.style.color = pickColorFunc();
  secondSpan.style.color = pickColorFunc();
  thirdSpan.style.color = pickColorFunc();
};

setInterval(changeInputColor, 500);

let intervalId;

const showApprovalMessage = () => {
  modal.style.display = "block";
  modal.nextElementSibling.style.display = "flex";
  const message = document.getElementById("message");
  const removeMessage = "Are you sure you wanna delete all tasks ? ?";
  let num = 0;
  intervalId = setInterval(() => {
    if (num === removeMessage.length - 1) {
      clearInterval(intervalId);
    }
    message.textContent += removeMessage[num];
    num++;
  }, 50);
};

trash.addEventListener("click", showApprovalMessage);

const removeTasksFunc = () => {
  modal.style.display = "none";
  modal.nextElementSibling.style.display = "none";
  clearInterval(intervalId);
  message.textContent = "";
};

const approveRemovalFunc = () => {
  if (ul.childElementCount) {
    removeTasksFunc();
    ul.textContent = "";
    taskList.length = 0;
    taskData.task.length = 0;
  } else {
    alert("There is no tasks to delete, the tab will close");
    removeTasksFunc();
  }
};

const cancelRemovalTasks = () => {
  removeTasksFunc();
};

options.firstElementChild.addEventListener("click", approveRemovalFunc);

options.children[1].addEventListener("click", cancelRemovalTasks);

const editTask = document.getElementById("edit-task");
const exitEditTaskBtn = editTask.querySelector("header button");
const approveEditTaskBtn = editTask.lastElementChild;
let dataIdx;
const changeTaskData = (currentElement) => {
  const { task: taskArr } = taskData;
  const showIndex = taskArr.findIndex(
    (item) => item.id === currentElement.dataset.key
  );
  dataIdx = showIndex;
};
const exitAddEditTask = (editTaskProp = "none", modalProp = "none") => {
  editTask.style.display = editTaskProp;
  modal.style.display = modalProp;
};

const editedMessageInput = editTask.querySelector("input");
let rightIdx;
const handleEditTask = (task, rightIndex) => {
  const taskCurrentText = editTask.querySelector("p");
  taskCurrentText.innerHTML = `<strong>Current text: </strong>${task.textContent}`;
  changeTaskData(task);
  rightIdx = rightIndex;
  editedMessageInput.value = "";
};

const changeTaskName = () => {
  const pickedLi = taskList[rightIdx].childNodes[0];
  pickedLi.textContent = editedMessageInput.value;
  taskData.task[dataIdx].isMotified = true;
  exitAddEditTask();
};
approveEditTaskBtn.addEventListener("click", changeTaskName);
const exitEditTaskFunc = () => {
  exitAddEditTask();
};

exitEditTaskBtn.addEventListener("click", exitEditTaskFunc);
const addTaskToData = (item) => {
  return (singleItem = {
    id: item.dataset.key,
    text: item.textContent.trim(),
    addTime: new Date().toISOString().slice(0, 19).replace(/T/, " "),
    isDeleted: false,
    isMotified: false,
  });
};

const handleToolsFunc = (e) => {
  const clickedLi = e.target.parentElement.parentElement;
  if (e.target.classList.contains("edit")) {
    exitAddEditTask("flex", "block");
    const rightIndex = taskList.findIndex(
      (itm) => itm.dataset.key === clickedLi.dataset.key
    );

    handleEditTask(clickedLi, rightIndex);
  } else {
    e.target.closest("li").remove();
    const rightIndx = taskList.findIndex(
      (li) => li.textContent === e.target.closest("li").textContent
    );
    changeTaskData(clickedLi);
    taskData.task[dataIdx].isDeleted = true;
    taskList.splice(rightIndx, 1);
  }
};

const input = document.getElementById("new-task");

const createNewTask = () => {
  const { task } = taskData;

  if (input.value.length >= 7) {
    const newLi = document.createElement("li");
    newLi.innerHTML = `${input.value}<div class="tools"><i class="fas fa-ban delete"></i><i class="fas fa-edit edit"></i></div>`;
    newLi.dataset.key = Math.floor(Math.random() * 1000);
    const addedTask = addTaskToData(newLi);
    task.push(addedTask);
    const tools = newLi.querySelector(".tools");
    toolsArr = [...tools.children];
    toolsArr.forEach((item) => {
      item.addEventListener("click", handleToolsFunc);
    });
    taskList.push(newLi);
    ul.appendChild(newLi);
  } else {
    alert(
      "The tasks message is required and the length should be at least 7 chars"
    );
  }
  input.value = "";
};

const addTaskByEnter = (e) => {
  if (e.key === "Enter") {
    createNewTask();
  } else {
    return;
  }
};
addTaskBtn.addEventListener("click", createNewTask);
input.addEventListener("keypress", addTaskByEnter);

const changeLogBtn = trash.nextElementSibling;
const changeLogPage = document.getElementById("changelog-page");
const loadingCircle = document.querySelector(".loading-message circle");
const circleStrokDashArray = loadingCircle.getAttribute("stroke-dasharray");
let strokeNumber = parseInt(circleStrokDashArray);
let loadingMessage = document.querySelector(".loading-message p");
const tasksChanges = document.querySelector(".task-changes");
const loadingUl = document.createElement("ul");
const loadingMessageDiv = loadingMessage.parentElement;

const clearLoadingMessage = (...intervalArr) => {
  setTimeout(() => {
    loadingMessageDiv.style.display = "none";
    tasksChanges.appendChild(loadingUl);
    intervalArr.forEach((itm) => clearInterval(itm));
  }, 6000);
};

const exitTasksChangeLogFunc = () => {
  modal.style.display = "none";
  changeLogPage.style.display = "none";
  loadingMessageDiv.style.display = "flex";
  loadingUl.textContent = "";
};

const loadingPageShowData = () => {
  loadingUl.classList.add("loading-data-list");
  const allTasksFromTaskDataArr = taskData.task;
  allTasksFromTaskDataArr.forEach((itm) => {
    const changelogLi = document.createElement("li");
    const { text, addTime, isDeleted, isMotified } = itm;
    const answerToIsModified = isMotified ? "Yes" : "No";
    const answerToIsDeleted = isDeleted ? "Yes" : "No";
    changelogLi.innerHTML = `<strong>text content: </strong><span id='first-task'>"${text}", </span><strong>date and time:</strong><span id='second-task'> ${addTime}, </span><strong> wasEdited: </strong><span class='third-task'> ${answerToIsModified}, </span></span><strong>wasDeleted: </strong><span class='third-task'> ${answerToIsDeleted}</span> `;
    setTimeout(() => {
      loadingUl.appendChild(changelogLi);
    }, 6000);
  });
};

const showChangelogFunc = () => {
  if (taskData.task.length >= 1) {
    modal.style.display = "block";
    changeLogPage.style.display = "flex";
    const intervalIdCircle = setInterval(() => {
      if (strokeNumber < 55) {
        strokeNumber++;
        loadingCircle.setAttribute("stroke-dasharray", parseInt(strokeNumber));
      } else {
        strokeNumber = 0.5;
      }
    }, 50);

    let rotateNum = 1;
    const IntervalIdRotateCircle = setInterval(() => {
      loadingCircle.style.transform = `rotate(${rotateNum}deg)`;
      rotateNum += 10;
    }, 100);

    const intervalIdLoadingMessage = setInterval(() => {
      if (loadingMessage.textContent.length >= 37) {
        loadingMessage.textContent = loadingMessage.textContent.slice(
          0,
          loadingMessage.textContent.length - 3
        );
      }
      loadingMessage.textContent += ".";
    }, 1000);
    loadingPageShowData();
    clearLoadingMessage(
      intervalIdCircle,
      IntervalIdRotateCircle,
      intervalIdLoadingMessage
    );
    const exitTasksChangelogBtn = changeLogPage.firstElementChild;
    exitTasksChangelogBtn.addEventListener("click", exitTasksChangeLogFunc);
  } else {
    alert(
      "You can't enter the changelog, because you didn't add any tasks yet"
    );
  }
};

changeLogBtn.addEventListener("click", showChangelogFunc);

const changeEngineBtn = document.getElementById("change-engine");
const changeEngineFunc = () => {
  const toDoList = document.querySelector(".add-task-engine");
  const search = document.querySelector(".search-engine");
  noTasksMessage.style.display = "none";
  noTasksMessageText.style.transform = "translateX(calc(-100% - 10px))";
  if (search.style.display === "none") {
    toDoList.style.display = "none";
    search.style.display = "flex";
  } else {
    toDoList.style.display = "flex";
    search.style.display = "none";
  }
};
changeEngineBtn.addEventListener("click", changeEngineFunc);

const searchTaskInput = searchEngine.querySelector("#search-task");

const searchTasksFunc = (e) => {
  if (ul.childElementCount) {
    const text = e.target.value.toLowerCase();
    let tasks = [...taskList];
    tasks = tasks.filter((task) =>
      task.textContent.toLowerCase().includes(text)
    );
    ul.textContent = "";
    tasks.forEach((item) => ul.appendChild(item));
  } else {
    const currentStylesNoTasksMessageText = getComputedStyle(noTasksMessage);
    const transformStyleCurrentValue = currentStylesNoTasksMessageText.display;
    if (e.data) {
      if (transformStyleCurrentValue === "none") {
        noTasksMessage.style.display = "block";
        setTimeout(() => {
          noTasksMessageText.style.transform = "translateX(0)";
        }, 1000);
        setTimeout(() => {
          noTasksMessage.style.display = "none";
          noTasksMessageText.style.transform = "translateX(calc(-100% - 10px))";
        }, 10000);
      } else {
        return;
      }
    }
  }
};
searchTaskInput.addEventListener("input", searchTasksFunc);

const statsInfo = document.querySelector(".stats-info");
const spansInStatsInfo = [...statsInfo.querySelectorAll("p span")];
const properties = { year: "numeric", month: "long", day: "numeric" };
const currentDate = new Date().toLocaleDateString("en-EN", properties);

spansInStatsInfo.forEach((stat) => {
  switch (stat.className) {
    case "tasks-total":
      setInterval(() => {
        stat.textContent = taskList.length;
      }, 100);
      break;
    case "current-date":
      stat.textContent = currentDate;
      break;
    case "current-time":
      const timeEverySecond = setInterval(() => {
        stat.textContent = new Date().toLocaleTimeString();
      }, 1000);
      break;
    default:
      alert("an Error has occured !");
  }
});
