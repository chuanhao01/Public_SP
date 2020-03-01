class MCQ{
    constructor(question, options, answers){
        this.question = question;
        this.options = options;
        this.answers = answers;
    }
}

class Quiz{
    constructor(list_of_mcqs, list_of_topics){
        this.input_var = require('readline-sync');
        this.list_of_topics = list_of_topics;
        this.list_of_mcqs = list_of_mcqs;
        this.selected_category = '';
        this.selected_questions = [];
        this.user_answers_arr = [];
        console.log('-= Welcome to Quiz Application =-');
        // getting name
        this.name = this.getInput('name');
        // getting topic
        let input_category = this.getInput('topic', this.name);
        // setting topic selected and list of question accordingly. - 1 cause arrays start at 0
        this.selected_category = this.list_of_topics[input_category - 1];
        this.selected_questions = this.list_of_mcqs[input_category - 1];
        // setting up default values for user_input
        for(let i=0; i<this.selected_questions.length; i++){this.user_answers_arr.push(null);}
        // starting main function for Quiz
        this.startQuiz(this.selected_questions);

    }
    //for topic, input_1 = name
    // for quiz, input_1 = mcq_obj, input_2 = i
    getInput(type, input_1 = '', input_2=''){
        let user_input = '';
        if(type == 'name'){
            user_input = this.input_var.question('What is your name: ');
            return user_input;
        }
        else if(type == 'topic'){
            console.log(`Hi ${input_1}, please choose the quiz category you would like to attempt: `);
            // here i = number assigned to topic, starting at 1. Hence the condition is length + 1
            for(let i=0; i<this.list_of_topics.length; i++){
                console.log(`(${i+1}) ${this.list_of_topics}`);
            }
            while(true){
                user_input = this.input_var.questionInt('>> ');
                if(user_input>0 && user_input<Object.keys(this.list_of_topics).length + 1){
                    break;
                }
            }
            return user_input;
        }
        else if(type == 'quiz' && input_2 == 0){
            console.log(`Question ${input_2+1}: ${input_1.question}`);
            for(let i=0; i<input_1.options.length; i++){
                console.log(`(${i+1}) ${input_1.options[i]}`);
            }
            console.log('<enter 1 to 4 for answer, N for the next question>');
            while(true){
                user_input = this.input_var.question('>> ');
                if(user_input === 'N'){
                    break;
                }
                else if(parseInt(user_input) > 0 && parseInt(user_input) < 5){
                    user_input = parseInt(user_input);
                    break;
                }
                console.log('Invalid Input, Please try again.');
            }
            return user_input;
        }
        else if(type == 'quiz'){
            console.log(`Question ${input_2+1}: ${input_1.question}`);
            for(let i=0; i<input_1.options.length; i++){
                console.log(`(${i+1}) ${input_1.options[i]}`);
            }
            console.log('<enter 1 to 4 for answer, P for previous question, N for the next question>');
            while(true){
                user_input = this.input_var.question('>> ');
                if(user_input === 'N' || user_input === 'P'){
                    break;
                }
                else if(parseInt(user_input) > 0 && parseInt(user_input) < 5){
                    user_input = parseInt(user_input);
                    break;
                }
                console.log('Invalid Input, Please try again.');
            }
            return user_input;
        }
        else if(type == 'last_question'){
            while(true){
                user_input = this.input_var.questionInt(`Enter 0 to submit your quiz or [1 to ${input_1.length}] to change your answer.`);
                if(user_input>-1 && user_input<input_1.length + 1){
                    break;
                }
            }
            return user_input;
        }
    }
    // takes in alist of mcq_objects
    startQuiz(list_of_obj_MCQs){
        let i = 0, check_done = true;
        while(check_done){
            let user_answer = '';
            // for first Q
            if(i==0){
                user_answer = this.getInput('quiz', list_of_obj_MCQs[i], i);
                if(user_answer == 'N'){
                    i += 1;
                }
                else{
                    this.user_answers_arr[i] = [user_answer, list_of_obj_MCQs[i].options[user_answer - 1]];
                }
            }
            // for other questions
            else{
                user_answer = this.getInput('quiz', list_of_obj_MCQs[i], i);
                if(user_answer == 'P'){
                    i -= 1;
                }
                else if(user_answer == 'N'){
                    i += 1;
                }
                else{
                    this.user_answers_arr[i] = [user_answer, list_of_obj_MCQs[i].options[user_answer - 1]];
                }
            }
            if(i >= list_of_obj_MCQs.length - 1){
                this.checkCompleted(list_of_obj_MCQs);
                let submit_status = this.getInput('last_question', list_of_obj_MCQs);
                if(submit_status == 0){
                    this.submitAnswers(list_of_obj_MCQs);
                    check_done = false;
                }
                else{
                    i = submit_status - 1;
                }
            }
        }
    }
    checkCompleted(list_of_questions){
        console.log('Here are your answers: ');
        let questions_done = 0, question_not_done = [];
        for(let i=0; i<list_of_questions.length; i++){
            console.log(`Question ${i+1}: ${list_of_questions[i].question}`);
            if(this.user_answers_arr[i] === null){
                question_not_done.push(i+1);
                console.log('Answer: You did not answer this question.');
            }
            else{
                questions_done++;
                console.log(`Answer: (${this.user_answers_arr[i][0]}) ${this.user_answers_arr[i][1]}`);
            }
        }
        console.log(`You did ${questions_done} of ${list_of_questions.length} questions.`);
        if(questions_done == list_of_questions.length){
            console.log('You did all of the questions!');
        }
        else{
            console.log(`You did not do questions ${question_not_done.join(',')}`);
        }
    }
    submitAnswers(list_of_questions){
        // correct = [index, option, option_string], wrong = [index, ur[option, option_string], corr[option, option_string]]
        let questions_correct = [], questions_wrong = [];
        for(let i=0; i<list_of_questions.length; i++){
            if(list_of_questions[i].answers == this.user_answers_arr[i][0]){
                questions_correct.push([i, this.user_answers_arr[i][0], this.user_answers_arr[i][1]]);
            }
            else{
               questions_wrong.push([i, [this.user_answers_arr[i][0], this.user_answers_arr[i][1]], [list_of_questions[i].answers, list_of_questions.options[list_of_questions[i].answers - 1]]]); 
            }
        }
        if(questions_correct.length !== 0){
            console.log(`You got ${questions_correct.length} questions correct out of ${list_of_questions.length}\nThese are the questions you got correct: `);
            for(let i=0; i<questions_correct.length; i++){
                console.log(`Question ${questions_correct[i][0]+1}: ${list_of_questions[questions_correct[i][0]].question}\nAnswer: (${questions_correct[i][1]}) ${questions_correct[i][2]}`);
            }
        }
        if(questions_wrong.length !== 0){
            console.log(`You got ${questions_wrong.length} questions wrong out of ${list_of_questions.length}\nThese are the questions you got wrong: `);
            for(let i=0; i<questions_wrong.length; i++){
                console.log(`Question ${questions_wrong[i][0]+1}: ${list_of_questions[questions_wrong[i][0]]}\nYour Answer: (${questions_wrong[i][1][0]}) ${questions_wrong[i][1][0]}\nCorrect Anwser: (${questions_wrong[i][2][0]}) ${questions_wrong[i][2][0]}`);
            }
        }

    }
    
}

let mcq_1 = new MCQ('Hello there', ['no'], 1);
let quiz_1 = new Quiz([[mcq_1]], ['topic_1']);
quiz_1.startQuiz();


