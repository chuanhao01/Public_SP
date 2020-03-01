// testing fs
function parseFile(data){
    let arr_of_lines = data.split('\n');
    return [arr_of_lines[0], arr_of_lines.slice(1)];
}

function parseQuestion(arr_of_lines){
    for(let i=0; i<arr_of_lines.length; i += 7){
        let question, options, answer;
        question = arr_of_lines[i];
        options = arr_of_lines.slice();
    }
}

const fs = require('fs');
// fs.readFile('SP-Code/FOP Code/Assignment/Quiz_text/Topic_1.txt', 'utf-8', (err, data)=>{
//     if(err) throw err;
//     console.log(data);
// });

let raw_file = fs.readFileSync('SP-Code/FOP Code/Assignment/Quiz_text/Topic_1.txt', 'utf-8');
// console.log(raw_file);
let [topic, list_of_lines] = parseFile(raw_file);
console.log(topic);
console.log(list_of_lines);
console.log(typeof(topic))

// fs.readdir('SP-Code/FOP Code/Assignment/Quiz_text', (err, files)=>{
//     if(err) throw err;
//     console.log(files);
// })


