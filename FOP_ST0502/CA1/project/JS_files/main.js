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
        let selected_choice = this.getTopic(this.name, this.arr_of_topics);
        // setting up questions and topic based on selection
        // selected_question = [mcq_1, mcq_2 ...]
        // selected_topic = 'topic'
        this.selected_questions = this.arr_of_questions[selected_choice-1];
        this.selected_topic = this.arr_of_topics[selected_choice-1];
        // start the quiz
        this.startQuiz(this.selected_topic, this.selected_questions);
    }
    // get functions always return the input of the user in its primitive form
    getTopic(name, topics){
        let user_input = '';
        console.log(`Hi ${name}, please choose the quiz category you would like to attempt: `);
        // printing the topics out 
        for(let i=0; i<topics.length; i++){
            console.log(`(${i + 1}) ${topics[i]}`);
        }
        while(true){
            user_input = this.input_var.questionInt('>> ');
            // checking if input is within options
            if(user_input>0 && user_input<topics.length + 1){
                break;
            }
            else{
                console.log('Invalid Input, Please try again.');
            }
        }
        return user_input;
    }
    getQuestion(question_obj, index){
        let user_input = '';
        if(index === 0){
            console.log(question_obj.question);
            let num_of_options = question_obj.options.length;
            // printing the options for the question
            for(let i=0; i<num_of_options; i++){
                console.log(question_obj.options[i]);
            }
            console.log(`<enter 1 to ${num_of_options} for answer, N for the next question>`);
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
            return user_input;
        }
        // inputs same as above
        else{
            console.log(question_obj.question);
            let num_of_options = question_obj.options.length;
            // printing the options for the question
            for(let i=0; i<num_of_options; i++){
                console.log(question_obj.options[i]);
            }
            console.log(`<enter 1 to ${num_of_options} for answer,P for the previous question, N for the next question>`);
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
            return user_input;
        }
    }
    getSubmit(list_of_questions){
        let user_input = '';
        console.log(`Enter 0 to submit your quiz or [1 to ${list_of_questions.length}] to change your answer`);
        while(true){
            user_input = this.input_var.questionInt('>> ');
            if(user_input > -1 && user_input < list_of_questions.length + 1){
                break;
            }
            else{
                console.log('Invalid Input, Please try again.');
            }
        }
        return user_input;
    }
    // selected_topic = string, selected_questions = arr
    startQuiz(selected_topic, selected_questions){
        // initialising null values for user_anwer based on num of Q
        let all_user_answers = [];
        for(let i=0; i<selected_questions.length; i++){
            all_user_answers.push(null);
        }
        console.log('');
        console.log(`[${selected_topic}] topic selected`);
        console.log('');
        let index = 0, check_done = true;
        while(check_done){
            let user_answer = '';
            // for questions, user_answer is choice, option is picked on index but string is choice
            if(index === 0){
                user_answer = this.getQuestion(selected_questions[index], index);
                // checking input
                if(user_answer === 'N'){
                    index += 1;
                }
                else{
                    all_user_answers[index] = [user_answer, selected_questions[index].options[user_answer - 1]];
                    index += 1;
                }
                console.log('');
            }
            else{
                user_answer = this.getQuestion(selected_questions[index], index);
                // checking input
                if(user_answer === 'N'){
                    index += 1;
                }
                else if(user_answer === 'P'){
                    index -= 1;
                }
                else{
                    all_user_answers[index] = [user_answer, selected_questions[index].options[user_answer - 1]];
                    index += 1;
                }
                console.log('');
            }
            if(index >= selected_questions.length){
                this.checkCompleted(selected_questions ,all_user_answers);
                let submit_status = this.getSubmit(selected_questions);
                console.log('');
                if(submit_status === 0){
                    this.calculateSubmit(selected_questions, all_user_answers);
                    check_done = false;
                } 
                else{
                    index = submit_status - 1;
                }
            }
        }
    }
    checkCompleted(questions ,user_answers){
        // printing all questions and answers and get respective arr of choice of questions
        console.log('You made it to the end of the quiz, here are your answers: ');
        let questions_done = [], questions_not_done = [];
        for(let i=0; i<user_answers.length; i++){
            console.log(questions[i].question);
            if(user_answers[i] === null){
                questions_not_done.push(i+1);
                console.log('You did not do this question.');
            }
            else{
                questions_done.push(i+1);
                console.log(`Your Answer: ${user_answers[i][1]}`);
            }
            console.log('');
        }
        if(questions_done.length !== 0){
            if(questions_done.length === user_answers.length){
                console.log("Great Job, you completed all of the questions!");
            }
            else{
                console.log(`You completed questions ${questions_done.join(',')}`);
            }
        }
        if(questions_not_done.length !== 0){
            if(questions_not_done.length === user_answers.length){
                console.log("Oh dear, it looks like you skipped all of the questions");
            }
            else{
                console.log(`You did not complete questions ${questions_not_done.join(',')}`);
            }
        }
    }
    calculateSubmit(questions, user_answers){
        let num_total = questions.length, percentage;
        // arrays to hold the index of the questions
        let q_right = [], q_wrong = [], q_missing = [];
        for(let i=0; i<questions.length; i++){
            if(user_answers[i] === null){
                q_missing.push(i);
            }
            else if(user_answers[i][0] === questions[i].answer){
                q_right.push(i);
            }
            else{
                q_wrong.push(i);
            }
        }
        percentage = (q_right.length / num_total) * 100;
        console.log(`You got ${q_right.length} questions correct, ${q_wrong.length} questions wrong, and did not answer ${q_missing.length} questions.`);
        console.log(`Your Percentage is: ${percentage}%`);
        console.log('');
        // unpacks the question and answers using index
        if(q_right.length !== 0){
            if(q_right.length === num_total){
                console.log('You got all the questions right!.');
            }
            else{
                console.log('These are the questions you got right:');
                for(let i=0; i<q_right.length; i++){
                    console.log(questions[q_right[i]].question);
                    console.log(`Answer: ${user_answers[q_right[i]][1]}`);
                    console.log('');
                }
            }
        }
        if(q_wrong.length !== 0){
            if(q_wrong.length === num_total){
                console.log('You got all the questions wrong, don\'t worry you can always try again!');
            }
            console.log('These are the questions you got wrong:');
            for(let i=0; i<q_wrong.length; i++){
                console.log(questions[q_wrong[i]].question);
                console.log(`Your Answer: ${user_answers[q_wrong[i]][1]}`);
                console.log(`Correct Answer: ${questions[q_wrong[i]].options[(questions[q_wrong[i]].answer - 1)]}`);
                console.log('');
            }
        }
        if(q_missing.length !== 0){
            if(q_missing.length === num_total){
                console.log('You did not attempt any of the questions, maybe you clicked too fast?');
            }
            console.log('These are the questions you missed: ');
            for(let i=0; i<q_missing.length; i++){
                console.log(questions[q_missing[i]].question);
                console.log(`Correct Answer: ${questions[q_missing[i]].options[(questions[q_missing[i]].answer - 1)]}`);
                console.log('');
            }
        }

    }
}

// main code
// importing fs module from node.js to read files
// importing custom modules from other files to use
const fs = require('fs');
const mods = require('./modules_for_quiz');

// base dir for where quiz files are stored
let base_dir = '../Questions';
let files_in_folder = fs.readdirSync(base_dir);

let topics = [];
let questions = [];
for(let i=0; i<files_in_folder.length; i++){
    let file_path = base_dir + '/' + files_in_folder[i];
    let topics_and_question = mods.parse(fs.readFileSync(file_path, 'utf-8'));
    topics.push(topics_and_question[0]);
    questions.push(topics_and_question[1]);
}

// this one line runs the whole class
let quiz_1 = new Quiz(questions, topics);


// debugging code
// console.log(files_in_folder);
// console.log(topics);
// console.log(questions);