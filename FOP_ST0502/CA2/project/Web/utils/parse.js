// function to shuffle an array
function shuffle(ori_array){
    for(let i=ori_array.length-1; i>0; i--){
        let random_i = Math.floor(Math.random() * (i+1));
        [ori_array[i], ori_array[random_i]] = [ori_array[random_i], ori_array[i]];
    }
    return ori_array;
}
// Parsing files
// takes in an array of [question, options, answer] to make a MCQ object
class MCQ{
    constructor(mcq_arr){
        this.question = mcq_arr[0];
        this.options = this.setUpAnswer(mcq_arr[1], mcq_arr[2]);
        this.user_answer = null;
        this.isCorrect = null;
        this.shuffleOptions();
    }
    setUpAnswer(options, answer){
        let rtr_options = [];
        for(let i=0; i<options.length; i++){
            if(i === answer-1){
                rtr_options.push({
                    option: options[i],
                    isAnswer: true,
                });
            }
            else{
                rtr_options.push({
                    option: options[i],
                    isAnswer: false,
                });
            }
        }
        return rtr_options;
    }
    shuffleOptions(){
        this.options = shuffle(this.options);
    }
    updateUserAnswer(user_selected){
        this.user_answer = user_selected;
        let options = this.options;
        // checking if the answer is correct
        if(options[user_selected].isAnswer){
            this.isCorrect = true;
        }
        else{
            this.isCorrect = false;
        }
    }
    getCorrectAnswer(){
        let options = this.options;
        for(let index in options){
            index = parseInt(index);
            if(options[index].isAnswer){
                return `(${index + 1}) ${options[index].option}`;
            }
        }
    }
    getUserAnswer(){
        return `(${this.user_answer + 1}) ${this.options[this.user_answer].option}`;
    }
    reset(){
        this.user_answer = null;
        this.isCorrect = null;
        this.shuffleOptions();
    }
}

// takes an input of raw data from a text file, returns topic, array of MCQ objects for that topic
function parse(data){
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
}

// Loading the js text from html script
let arr_of_text = [topic_1_unparsed, topic_2_unparsed, topic_3_unparsed, topic_4_unparsed];

// parsing the strings
let topics = [];
let questions = [];
for(let i=0; i<arr_of_text.length; i++){
    let topics_and_question = parse(arr_of_text[i]);
    topics.push(topics_and_question[0]);
    questions.push(topics_and_question[1]);
}

