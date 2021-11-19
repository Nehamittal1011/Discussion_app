var btnSubmit = document.getElementById("btn-submit");
var questionList = document.getElementsByClassName("lower-half")[0];
var rightContainer = document.querySelector(".container-right");
var questionForm = document.getElementById("question-form");
var btnNewQuestion = document.getElementById("btn-newQuestion");
var searchBar = document.getElementById("search-question");

var idnumber = 0;
var colors = ["cyan"];

const EMPTYTEXT = "";
const QUESTIONS = "questions";
const QUESTION = "Question:";
const RESPONSE = "Responses:";
const ADDRESPONSE = "Add Response";
const RESOLVE = "Resolve";
const ADDBTN = "Add";
const CONTAINER_QUESTION = "container-question";
const CONTAINER_RESPONSE = "container-response";
const CONTAINER_QUESRES = "container-quesres";
const PLACEHOLDER_NAME = "Name";
const PLACEHOLDER_STATEMENT = "Add your response";

function addInResponses(
  newquestion,
  responderName,
  responderStatement,
  containerResponse
) {
  var questions = localStorage.getItem(QUESTIONS);
  questions = JSON.parse(questions);
  questions.forEach(function (question) {
    if (question.id == newquestion.id) {
      var newResponse = {
        name: responderName,
        statement: responderStatement,
      };

      console.log(question);
      question.answers.push(newResponse);
    }
  });
  localStorage.setItem(QUESTIONS, JSON.stringify(questions));
  
  var responseDiv = document.createElement("div");
  var responder = document.createElement("span");
  var solution = document.createElement("p");

  responder.innerHTML = responderName + ":";
  solution.innerHTML = responderStatement;
  responseDiv.style.backgroundColor = "#F5F5F5";
  responder.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];

  responseDiv.appendChild(responder);
  responseDiv.appendChild(solution); 
  containerResponse.appendChild(responseDiv);
  
}

function displayInRightPane(newquestion) {
  console.log(newquestion);
  questionForm.style.display = "none";
  var containerQuesRes = document.createElement("div");
  containerQuesRes.setAttribute("class", CONTAINER_QUESRES);

  var containerQuestion = document.createElement("div");
  var containerResponse = document.createElement("div");
  var containerAddResponse = document.createElement("div");

  var questionHeading = document.createElement("h2");
  var subject = document.createElement("span");
  var question = document.createElement("p");
  var resolveButton = document.createElement("button");

  questionHeading.innerHTML = QUESTION;
  resolveButton.innerHTML = RESOLVE;
  subject.innerHTML = " " + newquestion.title;
  question.innerHTML = newquestion.description;

  containerQuestion.appendChild(questionHeading);
  containerQuestion.appendChild(subject);
  containerQuestion.appendChild(question);
  containerQuestion.appendChild(resolveButton);
  containerQuestion.setAttribute("class", CONTAINER_QUESTION);

  var responseHeading = document.createElement("h2");
  responseHeading.innerHTML = RESPONSE;
  containerResponse.appendChild(responseHeading);

  var responses = newquestion.answers;
  responses.forEach(function (response) {
    var responseDiv = document.createElement("div");
    var responder = document.createElement("span");
    var solution = document.createElement("p");

    responder.innerHTML = response.name + ":";
    solution.innerHTML = response.statement;
    responseDiv.style.backgroundColor = "#F5F5F5";
    responder.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    
    responseDiv.appendChild(responder);
    responseDiv.appendChild(solution);
    containerResponse.appendChild(responseDiv);
  });

  if (responses.length == 0) {
    var noResponse = document.createElement("p");
    noResponse.innerHTML = "No Responses Yet...";
    containerResponse.appendChild(noResponse);
  }
  containerResponse.setAttribute("class", CONTAINER_RESPONSE);

  var addResponseHeading = document.createElement("h4");
  var containerName = document.createElement("input");
  var containerStatement = document.createElement("textarea");
  var addResponseBtn = document.createElement("button");

  addResponseHeading.innerHTML = ADDRESPONSE;
  addResponseBtn.innerHTML = ADDRESPONSE;
  containerName.placeholder = PLACEHOLDER_NAME;
  containerStatement.placeholder = PLACEHOLDER_STATEMENT;

  containerAddResponse.appendChild(addResponseHeading);
  containerAddResponse.appendChild(containerName);
  containerAddResponse.appendChild(containerStatement);
  containerAddResponse.appendChild(addResponseBtn);
  containerAddResponse.setAttribute("class", "container-addresponse");

  containerQuesRes.appendChild(containerQuestion);
  containerQuesRes.appendChild(containerResponse);
  containerQuesRes.appendChild(containerAddResponse);
  rightContainer.appendChild(containerQuesRes);

  addResponseBtn.addEventListener("click", function () {
    var responderName = containerName.value;
    var responderStatement = containerStatement.value;
    if (
      responderName == "" ||
      responderStatement == "" ||
      responderStatement[0] == " " ||
      responderName[0] == " "
    ) {
      alert("Enter the fields Carefully !!");
      return;
    }
    containerName.value = "";
    containerStatement.value = "";
    if (containerResponse.contains(noResponse)) {
      containerResponse.removeChild(noResponse);
    }
    addInResponses(
      newquestion,
      responderName,
      responderStatement,
      containerResponse
    );
  });

  resolveButton.addEventListener("click", function () {
    console.log("clicked");
    function removeCurrentQues(question) {
      if (question.id == newquestion.id) {
        return false;
      }
      return true;
    }
    var questions = JSON.parse(localStorage.getItem(QUESTIONS));
    questions = questions.filter(removeCurrentQues);
    localStorage.setItem(QUESTIONS, JSON.stringify(questions));
    while (questionList.children.length > 0) {
      questionList.removeChild(questionList.children[0]);
    }
    displayInfo();
    displayQuesForm();
  });
}

function addInDisplay(newquestion) {
  idnumber = Math.max(parseInt(newquestion.id),idnumber);
  var container = document.createElement("div");
  var subject = document.createElement("p");
  var question = document.createElement("p");

  subject.innerHTML = newquestion.title;
  question.innerHTML = newquestion.description;

  container.appendChild(subject);
  container.appendChild(question);
  questionList.appendChild(container);

  container.addEventListener("click", function () {
    console.log("yes");
    if (rightContainer.children.length > 1) {
      rightContainer.removeChild(rightContainer.children[1]);
    }
    var questions = JSON.parse(localStorage.getItem(QUESTIONS));
    questions.forEach(function(question){
        if(question.id == newquestion.id){
          displayInRightPane(question);
        }
    });
  });
}

function displayInfo() {
  var questions = localStorage.getItem(QUESTIONS);
  if (questions) {
    questions = JSON.parse(questions);
    questions.forEach(addInDisplay);
  }
}

function addQuestion() {
  idnumber++;
  console.log(idnumber + " added");
  var inputSubject = document.getElementById("input-subject").value;
  var inputQuestion = document.getElementById("input-question").value;
  if (
    inputSubject == "" ||
    inputQuestion == "" ||
    inputQuestion[0] == " " ||
    inputSubject[0] == " "
  ) {
    alert("Enter the fields Carefully !!");
    return;
  }
  document.getElementById("input-subject").value = EMPTYTEXT;
  document.getElementById("input-question").value = EMPTYTEXT;

  var questions = localStorage.getItem(QUESTIONS);
  
  if (questions) {
    questions = JSON.parse(questions);
  } else {
    questions = [];
  }

  var newquestion = {
    id: idnumber,
    title: inputSubject,
    description: inputQuestion,
    answers: [],
  };

  questions.push(newquestion);
  localStorage.setItem(QUESTIONS, JSON.stringify(questions));
  addInDisplay(newquestion);
}

function displayQuesForm() {
  questionForm.style.display = "flex";

  while (rightContainer.children.length > 1) {
    rightContainer.removeChild(rightContainer.children[1]);
  }
}

function searchInList() {
  var searchBarValue = searchBar.value;
  var questions = JSON.parse(localStorage.getItem(QUESTIONS));
  questionList.innerHTML = "";

  questions.forEach(function (question) {
    if (question.title.includes(searchBarValue) == true) {
      addInDisplay(question);
    }
  });
}

displayInfo();
btnSubmit.addEventListener("click", addQuestion);
btnNewQuestion.addEventListener("click", displayQuesForm);
searchBar.addEventListener("keyup", searchInList);
