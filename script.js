// Define the survey questions
const questions = [
  {
    id: 1,
    text: "How satisfied are you with our products?",
    type: "rating",
    min: 1,
    max: 5
  },
  {
    id: 2,
    text: "How fair are the prices compared to similar retailers?",
    type: "rating",
    min: 1,
    max: 5
  },
  {
    id: 3,
    text: "How satisfied are you with the value for money of your purchase?",
    type: "rating",
    min: 1,
    max: 5
  },
  {
    id: 4,
    text: "On a scale of 1-10, how likely are you to recommend us to your friends and family?",
    type: "rating",
    min: 1,
    max: 10
  },
  {
    id: 5,
    text: "What could we do to improve our service?",
    type: "text"
  }
];

// Initialize the survey variables
let currentQuestion = 0;
let answers = [];

// Retrieve or generate a unique session ID for the customer
const sessionId = localStorage.getItem("sessionID") || generateSessionId();
localStorage.setItem("sessionID", sessionId);

// Function to generate a unique session ID
function generateSessionId() {
  // Generate a random string using a combination of timestamp and random number
  const timestamp = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * 1000000);
  return `session_${timestamp}_${randomNumber}`;
}

// Function to display the current question
function displayQuestion() {
  const questionNumberElement = document.getElementById("questionNumber");
  const questionTextElement = document.getElementById("questionText");
  const answerContainer = document.getElementById("answerContainer");

  const question = questions[currentQuestion];

  questionNumberElement.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
  questionTextElement.textContent = question.text;

  answerContainer.innerHTML = "";

  if (question.type === "rating") {
    // Display a rating input for rating type questions
    const ratingInput = document.createElement("input");
    ratingInput.type = "number";
    ratingInput.min = question.min;
    ratingInput.max = question.max;
    ratingInput.required = true;
    answerContainer.appendChild(ratingInput);
  } else if (question.type === "text") {
    // Display a text input for text type questions
    const textInput = document.createElement("textarea");
    textInput.required = true;
    answerContainer.appendChild(textInput);
  }
}

// Function to handle the previous button click
function handlePrevButtonClick() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
}

// Function to handle the next button click
function handleNextButtonClick() {
  if (currentQuestion < questions.length - 1) {
    const answerInput = document.querySelector("#answerContainer input, #answerContainer textarea");
    if (answerInput.checkValidity()) {
      answers.push({
        sessionId: sessionId,
        questionId: questions[currentQuestion].id,
        answer: answerInput.value
      });
      currentQuestion++;
      displayQuestion();
    } else {
      answerInput.reportValidity();
    }
  } else {
    // Reached the last question, save the answer and show completion message
    const answerInput = document.querySelector("#answerContainer input, #answerContainer textarea");
    if (answerInput.checkValidity()) {
      answers.push({
        sessionId: sessionId,
        questionId: questions[currentQuestion].id,
        answer: answerInput.value
      });
      saveAnswersToDatabase();
      showCompletionMessage();
    } else {
      answerInput.reportValidity();
    }
  }
}

// Function to handle the skip button click
function handleSkipButtonClick() {
  currentQuestion++;
  displayQuestion();
}

// Function to save the answers to the database (or local storage)
function saveAnswersToDatabase() {
  // Save the answers to the database or local storage as per your implementation
  localStorage.setItem("answers", JSON.stringify(answers));
}

// Function to display the completion message
function showCompletionMessage() {
  const questionScreen = document.getElementById("questionScreen");
  questionScreen.style.display = "none";

  const completionMessage = document.createElement("div");
  completionMessage.innerHTML = "<h2>Completed the survey!</h2><p>Your feedback is valuable to us.</p>";
  document.body.appendChild(completionMessage);
}

// Add event listeners to buttons
document.getElementById("startButton").addEventListener("click", () => {
  const welcomeScreen = document.getElementById("welcomeScreen");
  welcomeScreen.style.display = "none";

  const questionScreen = document.getElementById("questionScreen");
  questionScreen.style.display = "block";

  displayQuestion();
});

document.getElementById("prevButton").addEventListener("click", handlePrevButtonClick);
document.getElementById("nextButton").addEventListener("click", handleNextButtonClick);
document.getElementById("skipButton").addEventListener("click", handleSkipButtonClick);
