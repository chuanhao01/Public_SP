// class to allow dropdown buttons when clicked to change the value in the dropdown
// expects input params of (dropdown_button_id_in_html, dropdown_list_id_in_html)
class Dropdown{
    constructor(drop_btn_id, drop_list_div_id){
        this.dropdown_obj = document.getElementById(drop_btn_id);
        this.dropdown_list_obj = document.getElementById(drop_list_div_id).children;
        for(let i=0; i<this.dropdown_list_obj.length; i++){
            let current_button =  this.dropdown_list_obj[i];
            current_button.addEventListener('click', this.onClickChange.bind(this));
        }
    }
    // event called when any of the buttons is pressed
    onClickChange(event){
        event.preventDefault();
        this.dropdown_obj.innerText = event.srcElement.attributes.value.value;
        this.dropdown_obj.value = event.srcElement.attributes.value.value;
    }
}

/*

Class for the form on the contacts page
The class adds event listeners to update input fields as it recieves input
Has a final event listener for when the submit button is pressed
Only works for my form ids
Expects the input param (form_id) when initalised

*/
class Form extends Dropdown{
    constructor(form_id){
        super('contactDropdown', 'contactDropdownList');
        // reseting the session storage
        sessionStorage.removeItem('form_data');
        // tagging all the elements I am going to use
        this.contact_name = document.getElementById('contactName');
        this.contact_email = document.getElementById('contactEmail');
        this.contact_dropdown = document.getElementById('contactDropdown');
        this.contact_dropdown_list = document.getElementById('contactDropdownList').children;
        this.contact_number = document.getElementById('contactNumber');
        this.contact_country = document.getElementById('contactCountry');
        this.contact_type = document.querySelectorAll('input[type="checkbox"]');
        this.contact_type_valid = [document.getElementById('contactTypeCheckValid'), document.getElementById('contactTypeCheckInvalid')];
        this.contact_message = document.getElementById('contactMessage');
        this.contact_submit = document.getElementById('contactSubmit');
        this.form_mail_obj = document.getElementById('formMail');
        // To set width and height for mail
        this.form_obj = document.getElementById(form_id);
        this.form_mail_obj.style.height =  `${this.form_obj.clientHeight + 150}px`;
        this.form_mail_obj.style.width = `${this.form_obj.clientWidth}px`;
        window.addEventListener('resize', () => {
            this.form_mail_obj.style.height =  `${this.form_obj.clientHeight + 150}px`;
            this.form_mail_obj.style.width = `${this.form_obj.clientWidth}px`;
        });
        // tagging mail elements
        this.mail_name = document.getElementById('mailName');
        this.mail_email = document.getElementById('mailEmail');
        this.mail_dropdown = document.getElementById('mailDropdown');
        this.mail_number = document.getElementById('mailNumber');
        this.mail_country = document.getElementById('mailCountry');
        this.mail_type = document.getElementById('mailType');
        this.mail_message = document.getElementById('mailMessage');
        // adding countries for dropdown
        let countries_list = ['Singapore', 'Malaysia', 'Philippines', 'China', 'Indonesia', 'Japan', 'India', 'USA'];
        for(let country of countries_list){
            let option_to_add = document.createElement('option');
            option_to_add.value = country;
            option_to_add.innerHTML = country;
            this.contact_country.appendChild(option_to_add);
        }
        // adding event listeners for each input fields
        this.contact_name.addEventListener('input', this.onNameChange.bind(this));
        this.contact_email.addEventListener('input', this.onEmailChange.bind(this));
        this.contact_number.addEventListener('input', this.onDropdownAndNumber.bind(this));
        this.contact_country.addEventListener('click', this.onCountryChange.bind(this));
        // adding event listener for dropdown
        this.contact_dropdown.addEventListener('click', this.onDropdownAndNumber.bind(this));
        for(let button of this.contact_dropdown_list){
            button.addEventListener('click', this.onDropdownAndNumber.bind(this));
        }
        // adding event listener for the checkboxes
        for(let checkbox of this.contact_type){
            checkbox.addEventListener('click', this.onTypeChange.bind(this));
        }
        this.contact_message.addEventListener('input', this.onMessageChange.bind(this));
        this.contact_submit.addEventListener('click', this.onFormSubmit.bind(this));
    }
    /*

    Event called to validate the name input field as input is recieved 
    Methods also updates the respective mail field with the value in the input field

    */
    onNameChange(event){
        event.preventDefault();
        this.mail_name.innerHTML = event.target.value;
        if(event.target.value === ''){
           event.target.classList.add('is-invalid'); 
           event.target.classList.remove('is-valid');
        }
        else{
            event.target.classList.add('is-valid');
            event.target.classList.remove('is-invalid');
        }
    /*

    Event called to validate the email input field as input is recieved 
    Methods also updates the respective mail field with the value in the input field

    */   }
    onEmailChange(event){
        event.preventDefault();
        this.mail_email.innerHTML = event.target.value;
        let email_val_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email_val_regex.test(event.target.value)){
            event.target.classList.add('is-invalid'); 
            event.target.classList.remove('is-valid');
        } 
        else{
            event.target.classList.add('is-valid');
            event.target.classList.remove('is-invalid');
        }
    }
    /*
    
    Event called to validate the number input field as input is recieved     
    This event is tagged to the dropdown and its button, as well as the number input field
    Both the dropdown and the input field must be valid for it to be valid

    */
    onDropdownAndNumber(event){
        event.preventDefault();
        let number_val_regex = /\b\d{8}\b/;
        let dropdown_value = this.contact_dropdown.value;
        let number_value = this.contact_number.value;
        let input_dom = this.contact_number;
        if(number_val_regex.test(number_value)){
            if(dropdown_value !== ''){
                input_dom.classList.add('is-valid');
                input_dom.classList.remove('is-invalid');
            }
            else{
                input_dom.classList.add('is-invalid'); 
                input_dom.classList.remove('is-valid');
            }
        } 
        else{
            input_dom.classList.add('is-invalid'); 
            input_dom.classList.remove('is-valid');
        }
        this.mail_dropdown.innerHTML = dropdown_value;
        this.mail_number.innerHTML = number_value;
    }
    // method to overwite the dropdown button change
    onClickChange(event){
        event.preventDefault();
        this.dropdown_obj.innerText = event.srcElement.attributes.value.value;
        this.dropdown_obj.value = event.srcElement.attributes.value.value;
    }
    /*

    Event called to validate the message input field as input is recieved 
    Methods also updates the respective mail field with the value in the input field

    */
    onMessageChange(event){
        event.preventDefault();
        this.mail_message.innerHTML = event.target.value;
        if(event.target.value === ''){
            event.target.classList.add('is-invalid'); 
            event.target.classList.remove('is-valid');
        } 
        else{
            event.target.classList.add('is-valid');
            event.target.classList.remove('is-invalid');
        }
    }
    /*

    Event called to validate the country input field when a country is selected 
    Methods also updates the respective mail field with the value in the input field

    */
    onCountryChange(event){
        event.preventDefault();
        let country_obj = event.target;
        this.mail_country.innerHTML = country_obj.options[country_obj.selectedIndex].value;
        if(country_obj.options[country_obj.selectedIndex].value === ''){
            country_obj.classList.add('is-invalid');
            country_obj.classList.remove('is-valid');
        }
        else{
            country_obj.classList.add('is-valid');
            country_obj.classList.remove('is-invalid');
        }
    }
    /*

    Event called to check if any of the type checkboxes is selected 
    Methods also updates the respective mail field with the value in the input field

    */
    onTypeChange(event){
        let all_checkedboxes = '';
        for(let checkbox of this.contact_type){
            if(checkbox.checked){
                all_checkedboxes += `${checkbox.value}<br>`;
            }
        }    
        this.mail_type.innerHTML = all_checkedboxes;  
        if(this.checkType(this.contact_type)){
            this.contact_type_valid[0].classList.add('d-block');
            this.contact_type_valid[1].classList.remove('d-block');
        }
        else{
            this.contact_type_valid[0].classList.remove('d-block');
            this.contact_type_valid[1].classList.add('d-block');
        }
    }
    /*
    Method to check if the elements in the array is checked 
    (Used for an array of the input checkboxes) 
    */
    checkType(checkboxes){
        for(let checkbox of checkboxes){
            if(checkbox.checked){
                return true;
            }
        }
        return false;
    }
    // Method used to get all the selected values in the checkboxes and return them as a string
    getAllTypes(checkboxes){
        let check_boxes = [];
        for(let checkbox of checkboxes){
            if(checkbox.checked){
                check_boxes.push(checkbox.value);
            }
        }
        return check_boxes;
    }
    /*
    Method called when the submit button is pressed so as to validate all input fields
    */
    onFormSubmit(event){
        event.preventDefault();
        let email_val_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let number_val_regex = /\b\d{8}\b/;
        // checking all input fields one by one and adding respective error classes 
        if(this.contact_name.value === ''){
            this.contact_name.classList.add('is-invalid');
            this.contact_name.classList.remove('is-valid');
        }
        if(!email_val_regex.test(this.contact_email.value)){
            this.contact_email.classList.add('is-invalid');
            this.contact_email.classList.remove('is-valid');
        }
        if(this.contact_dropdown.value === ''){
            this.contact_number.classList.add('is-invalid');
            this.contact_number.classList.remove('is-valid');
        }
        if(!number_val_regex.test(this.contact_number.value)){
            this.contact_number.classList.add('is-invalid');
            this.contact_number.classList.remove('is-valid');
        }
        if(this.contact_country.options[this.contact_country.selectedIndex].value === ''){
            this.contact_country.classList.add('is-invalid');
            this.contact_country.classList.remove('is-valid');
        }
        if(!this.checkType(this.contact_type)){
            this.contact_type_valid[0].classList.remove('d-block');
            this.contact_type_valid[1].classList.add('d-block');
        }
        if(this.contact_message.value === ''){
            this.contact_message.classList.add('is-invalid');
            this.contact_message.classList.remove('is-valid');
        }
        // to check all input fields at once to see if they are valid
        if(this.contact_name.value !== ''){
            // checking email
            if(email_val_regex.test(this.contact_email.value)){
                // checking contact dropdown
                if(this.contact_dropdown.value !== ''){
                    // checking number
                    if(number_val_regex.test(this.contact_number.value)){
                        // checking country
                        if(this.contact_country.options[this.contact_country.selectedIndex].value !== ''){
                            //checking if one of the checkboxes are ticked 
                            if(this.checkType(this.contact_type)){
                                // check message
                                if(this.contact_message.value !== ''){
                                    let rtr_object = {
                                        name: this.contact_name.value,
                                        email: this.contact_email.value,
                                        dropDown: this.contact_dropdown.value,
                                        number: this.contact_number.value,
                                        country: this.contact_country.options[this.contact_country.selectedIndex].value,
                                        type: this.getAllTypes(this.contact_type),
                                        message: this.contact_message.value
                                    };
                                    sessionStorage.setItem('form_data', JSON.stringify(rtr_object));
                                    window.location.href = 'thank_you.html';
                                } 
                            } 
                        } 
                    } 
                } 
            } 
        } 
    }
}

// Main Code
// To initialise the form code
let form = new Form('form');