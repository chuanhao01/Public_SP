/* 
class declartion for thank you
*/
class ThankYou{
    constructor(jumbotron_id){
        // getting html DOM elements
        this.jumbotron_obj = document.getElementById(jumbotron_id);
        this.name_obj = document.getElementById('name');
        this.email_obj = document.getElementById('email');
        this.dropdown_obj = document.getElementById('dropDown');
        this.number_obj = document.getElementById('number');
        this.country_obj = document.getElementById('country');
        this.type_obj = document.getElementById('type');
        this.message_obj = document.getElementById('message');
        // Checks if there is anything in the session storage
        // Displays an error message if there is no session storage
        if(sessionStorage.getItem('form_data') === null){
            this.jumbotron_obj.removeChild(this.jumbotron_obj.firstElementChild);
            let error_msg = document.createElement('h4');
            error_msg.innerHTML = 'Hey, you are not supposed to be here';
            this.jumbotron_obj.appendChild(error_msg);
        }
        // If the session storage key exists, then load the data into the webpage
        else{
            this.form_data = JSON.parse(sessionStorage.getItem('form_data'));
            // adding form data into the html DOM
            this.name_obj.innerHTML = this.form_data['name'];
            this.email_obj.innerHTML = this.form_data['email'];
            this.dropdown_obj.innerHTML = this.form_data['dropDown'];
            this.number_obj.innerHTML = this.form_data['number'];
            this.country_obj.innerHTML = this.form_data['country'];
            this.type_obj.innerHTML = this.unPackType(this.form_data['type']);
            this.message_obj.innerHTML = this.form_data['message'];
        }
        sessionStorage.removeItem('form_data');
    }
    unPackType(types_selected){
        let str_type = '';
        for(let type of types_selected){
           str_type = type + '<br>'; 
        }
        return str_type;
    }
}


let thank_you_jumbotron = new ThankYou('thank_you_jumbotron');