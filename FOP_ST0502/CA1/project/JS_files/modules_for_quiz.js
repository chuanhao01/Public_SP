// takes in an array of [question, options, answer] to make a MCQ object
class MCQ{
    constructor(mcq_arr){
        this.question = mcq_arr[0];
        this.options = mcq_arr[1];
        this.answer = mcq_arr[2];
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

module.exports = {
    parse
};

//  debugging code
// const fs = require('fs');
// let [topic, questions] = parse(fs.readFileSync('SP-Code/FOP Code/Assignment/Questions/Topic_1.txt', 'utf-8'));
// console.log(topic);
// console.log(questions);
