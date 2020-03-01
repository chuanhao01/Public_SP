// function to shuffle an array
function shuffle(ori_array){
    for(let i=ori_array.length-1; i>0; i--){
        let random_i = Math.floor(Math.random() * (i+1));
        [ori_array[i], ori_array[random_i]] = [ori_array[random_i], ori_array[i]];
    }
    return ori_array;
}
// takes in an array of [question, options, answer] to make a MCQ object with methods
// methods description are at the respective methods
class MCQ{
    // takes in an array of [question_str, options_arr, answer__int]
    constructor(mcq_arr){
        // assign data from arr to respective attributes
        this.question = mcq_arr[0];
        this.ori_options = mcq_arr[1];
        this.answer = mcq_arr[2];
        // setting up defaults
        this.user_answer = null;
        this.options = [];
        this.isCorrect = null;
        this.setUpOptions();
    }
    //using the original arr of options, creates an arr of objs, with attribute option->str, isCorrect ->based on option
    //this way, the answer is tagged to the correct option
    setUpOptions(){
        let options=[];
        for(let index in this.ori_options){
            let option_obj = {
                option: this.ori_options[index],
                isAnswer: (parseInt(index) === this.answer - 1),
            };
            options.push(option_obj);
        }
        this.options = shuffle(options);
    }
    // returns a string of the options in (1) 1_option\n
    getOptions(){
        let rtr_str = ``;
        for(let index in this.options){
            rtr_str += `(${parseInt(index) + 1}) ${this.options[parseInt(index)].option}\n`;
        }
        return rtr_str;
    }
    // returns a string of the answer in the format (x) answer_String
    getAnswer(){
        let answer = '', index_of_answer;
        for(let index in this.options){
            if(this.options[index].isAnswer){
                answer = this.options[index].option;
                index_of_answer = parseInt(index);
            }
        }
        let rtr_str = `(${index_of_answer + 1}) ${answer}`;
        return rtr_str;
    }
    // takes in the user_answer as a param, set the object user_answer to the input, sets the attr isCorrect, when an answer is given
    setUserAnswer(user_answer){
        this.user_answer = user_answer;
        this.isCorrect = this.checkUserAnswer();
    }
    // checks the user_answer returns null for no answer, true for correct and false for wrong
    checkUserAnswer(){
        let user_answer = this.user_answer,
        options = this.options;
        if(user_answer === null){
            return null;
        }
        else if(options[user_answer - 1].isAnswer){
            return true;
        }
        else{
            return false;
        }
    }
    // returns the str when checking if the question is completed
    getCompleted(){
        if(this.isCorrect === null){
            return 'You did not complete this question';
        }
        else{
            return `(${this.user_answer}) ${this.options[this.user_answer - 1].option}`;
        }
    }
    // returns the str when calling to check if the question is completed
    getSubmit(){
        if(this.isCorrect === null){
            return `Correct Answer: (${this.getAnswer()}\nYou did not complete this question`;
        }
        else if(this.isCorrect === true){
            return `You got this question Correct!\nCorrect Answer: (${this.user_answer}) ${this.options[this.user_answer - 1].option}`;
        }
        else{
            let rtr_str = `Your Answer: \n(${this.user_answer}) ${this.options[this.user_answer - 1].option}\nAnswer: \n${this.getAnswer()}`;
            return rtr_str;
        }
    }
    // call method to reset mcq state
    resetMCQ(){
        this.user_answer = null;
        this.options = [];
        this.isCorrect = null;
        this.setUpOptions();
    }
}

class Quiz{
    constructor(arr_of_questions, arr_of_topics){
        // setting up defaults
        // arr_of_questions = [[mcq_obj, ...] ,...] first_order index = topic, num of questions in that arr
        // arr_of_topics = [topic_1, topic_2...]
        this.input_var = require('readline-sync');
        this.arr_of_questions = arr_of_questions;
        this.arr_of_topics = arr_of_topics;
        // startinng main
        console.log('-= Welcome to Quiz Application =-\n');
        this.name = this.input_var.question('Please Enter your name: ');
        this.runMain();
        console.log('Thanks for playing. have a nice day!');
    }
    // main function call to play the quiz called in the constructor 
    runMain(){
        while(true){
            let selected_choice = this.getTopic(this.name, this.arr_of_topics);
            // if the user wants to exit the program
            if(selected_choice === 0){
                return;
            }
            else{
                // setting up questions and topic based on selection
                // selected_question = [mcq_1, mcq_2 ...]
                // selected_topic = 'topic'
                this.selected_questions = shuffle(this.arr_of_questions[selected_choice-1]);
                this.selected_topic = this.arr_of_topics[selected_choice-1];
            }
            // start the quiz
            this.startQuiz(this.selected_topic, this.selected_questions);
            // resets the questions for the topic
            for(let index in this.selected_questions){
                this.selected_questions[index].resetMCQ();
            }
        }
    }
    // get functions always return the input of the user in its primitive form
    getTopic(name, topics){
        let user_input = '';
        console.log(`Hi ${name}, please choose the quiz category you would like to attempt: `);
        // printing the topics out 
        for(let i=0; i<topics.length; i++){
            console.log(`(${i + 1}) ${topics[i]}`);
        }
        console.log('(0) Exit');
        while(true){
            user_input = this.input_var.questionInt('>> ');
            // checking if input is within options
            if(user_input>-1 && user_input<topics.length + 1){
                break;
            }
            else{
                console.log('Invalid Input, Please try again.');
            }
        }
        return user_input;
    }
    startQuiz(topic, question_objs){
        // to log the topic
        console.log('');
        console.log(`[${topic}] topic selected`);
        console.log('');
        let index = 0;
        // to check if we are still showing questions
        while(true){
            let user_input = '', num_of_questions = question_objs.length;
            // for the first question
            if(index<num_of_questions){
                user_input = this.getQuestion(question_objs[index], index, num_of_questions);
                if(user_input === 'P'){
                    index -= 1;
                }
                else if(user_input === 'N'){
                    index += 1;
                }
                else{
                    question_objs[index].setUserAnswer(user_input);
                    index += 1;
                }
            }
            else{
                // after the last question, go and check through all the questions, the user_input here is the 0 to submit or 1-5 to go back
                user_input = this.checkCompleted(question_objs);
                if(user_input === 0){
                    this.calculateSubmit(question_objs);
                    break;
                }
                else{
                    // sets the index to the question the user ones to go back to
                    index = user_input - 1;
                }
            }
        }
    }
    // method called to ask the user a question, returns the input from the user
    getQuestion(question_obj, index, num_of_questions){
        let user_input = '';
        let num_of_options = question_obj.options.length;
        // logs the current question and options passed in
        console.log(`Question ${index + 1}: ${question_obj.question}`);
        console.log(question_obj.getOptions());
        // expecting different inputs based on the index passed
        // case for the first question
        if(index === 0){
            console.log(`<enter 1 to ${num_of_options} for answer, N for the next question>`);
            console.log(`Your Answer: ${(question_obj.user_answer === null) ? 'Unanswered' : question_obj.user_answer}`);
            while(true){
                user_input = this.input_var.question('>> ');
                if(user_input === 'N'){
                    break;
                }
                else if(parseInt(user_input)>0 && parseInt(user_input)<num_of_options + 1){
                    user_input = parseInt(user_input);
                    break;
                }
                else{
                    console.log('Invalid Input, Please try again.');
                }
            }
        }
        // case for the question 2 to the last - 1 
        else if(index >= num_of_questions - 1){
            console.log(`<enter 1 to ${num_of_options} for answer, P for the previous question>`);
            console.log(`Your Answer: ${(question_obj.user_answer === null) ? 'Unanswered' : question_obj.user_answer}`);
            while(true){
                user_input = this.input_var.question('>> ');
                if(user_input === 'P'){
                    break;
                }
                else if(parseInt(user_input)>0 && parseInt(user_input)<num_of_options + 1){
                    user_input = parseInt(user_input);
                    break;
                }
                else{
                    console.log('Invalid Input, Please try again.');
                }
            }
        }
        // case for the last question
        else{
            console.log(`<enter 1 to ${num_of_options} for answer, P for the previous question, N for the next question>`);
            console.log(`Your Answer: ${(question_obj.user_answer === null) ? 'Unanswered' : question_obj.user_answer}`);
            while(true){
                user_input = this.input_var.question('>> ');
                if(user_input === 'N' || user_input=== 'P'){
                    break;
                }
                else if(parseInt(user_input)>0 && parseInt(user_input)<num_of_options + 1){
                    user_input = parseInt(user_input);
                    break;
                }
                else{
                    console.log('Invalid Input, Please try again.');
                }
            }
        }
        return user_input;
    }
    // method called when the last question is done
    checkCompleted(question_objs){
        console.log('You made it to the end of the quiz, here are your answers: ');
        let questions_missed = [];
        // to get the index of the question that the user missed
        for(let index in question_objs){
            index = parseInt(index);
            let question = question_objs[index];
            let str_to_print = `Question ${index + 1}: ${question.question}\n`;
            let check_str = question.getCompleted();
            if(check_str === 'You did not complete this question'){
                questions_missed.push(index);
            }
            str_to_print += check_str;
            console.log(str_to_print);
            console.log();
        }
        // case to check if there is any missing question, if there is show the question missed
        if(questions_missed.length > 0){
            console.log(`You missed questions ${questions_missed.join(',')}`);
        }
        else{
            console.log(`You did not miss any questions!`);
        }
        let user_input = '';
        console.log(`Enter 0 to submit your quiz or [1 to ${question_objs.length}] to change your answer`);
        while(true){
            user_input = this.input_var.questionInt('>> ');
            if(user_input > -1 && user_input < question_objs.length + 1){
                break;
            }
            else{
                console.log('Invalid Input, Please try again.');
            }
        }
        return user_input;
    }
    // method called when the quiz is submitted
    calculateSubmit(question_objs){
        let q_right = [], q_wrong = [], q_missing = [];
        // go through all the questions and sort for correct, wrong or missing
        for(let index in question_objs){
            index = parseInt(index);
            let check_answer = question_objs[index].checkUserAnswer();
            // choice = index + 1
            if(check_answer === null){
                q_missing.push(index + 1);
            }
            else if(check_answer){
                q_right.push(index + 1);
            }
            else{
                q_wrong.push(index + 1);
            }
        }
        // logging final percentage as well as what question got right and wrong
        let percentage = (q_right.length/question_objs.length) * 100;
        console.log(`You got ${q_right.length} questions correct, ${q_wrong.length} questions wrong, and did not answer ${q_missing.length} questions.`);
        if(q_right.length !== 0){
            console.log(`You got questions ${q_right.join(',')} right`);
        }
        if(q_wrong.length !== 0){
            console.log(`You got questions ${q_wrong.join(',')} wrong`);
        }
        if(q_missing.length){
            console.log(`You did not do ${q_missing.join(',')}`);
        }
        console.log(`Your Percentage is: ${percentage}%`);
        console.log('');
        // log each question
        for(let index in question_objs){
            index = parseInt(index);
            let question = question_objs[index];
            console.log(`Question ${index + 1}: ${question.question}`);
            console.log(question.getSubmit());
            console.log();
        }
        // congratulatory message if they got all the question right
        if(q_right.length === question_objs.length){
            console.log('You got all questions right!\nCongratulations');
        }
        this.input_var.question('Press Enter to Continue...');
    }
}

// takes an input of raw data from a text file, returns topic, array of MCQ objects for that topic
let parse = function(data){
    let ori_arr = data.split('\n');
    let new_line_regex = /\r?\n|\r/g;
    for(let i=0; i<ori_arr.length; i++){
        ori_arr[i] = ori_arr[i].replace(new_line_regex, '');
    }
    let topic = ori_arr[0];
    ori_arr = ori_arr.splice(1);
    let list_of_q = [];
    for(let i=0; i<ori_arr.length; i += 7){
        let question, options, answer;
        // setting q = 0 offset, options = 1 - 4 offset, a = 5 offest, del last line
        question = ori_arr[i];
        options = ori_arr.slice(i+1, i+5);
        answer = parseInt(ori_arr[i+5]);
        // push as 1 arr into an arr
        list_of_q.push(new MCQ([question, options, answer]));
    }
    return [topic, list_of_q];
};

// main code
const fs = require('fs');
const path = require('path');

// base dir for where quiz files are stored
let base_dir = path.resolve(__dirname, '../Questions')
let files_in_folder = fs.readdirSync(base_dir);

let topics = [];
let questions = [];
for(let i=0; i<files_in_folder.length; i++){
    let file_path = base_dir + '/' + files_in_folder[i];
    let topics_and_question = parse(fs.readFileSync(file_path, 'utf-8'));
    topics.push(topics_and_question[0]);
    questions.push(topics_and_question[1]);
}
// sets up a quiz and starts the whole quiz
let a = new Quiz(questions, topics);