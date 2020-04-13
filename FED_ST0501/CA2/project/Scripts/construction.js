/*
Class creation for a timer used in the construction page
*/
class Construction{
    constructor(timer_id){
        this.clock_dom = document.getElementById(timer_id);
        this.done_date_obj = new Date("October 30 2019 00:00");
        this.timer_dom = this.clock_dom.children[0].children[2].children;
        this.days_dom = this.timer_dom.days;
        this.hours_dom = this.timer_dom.hours;
        this.minutes_dom = this.timer_dom.minutes;
        this.seconds_dom = this.timer_dom.seconds;
        this.getTimeLeft();
        this.updateClock = setInterval(this.getTimeLeft.bind(this), 1000);
    }
    // Method called to update the time shown on the webpage
    getTimeLeft(){
        this.timer_obj = new Date();
        this.time_left = this.done_date_obj.getTime() - this.timer_obj.getTime();
        this.days_left = Math.floor(this.time_left / (1000 * 60 * 60 * 24));
        this.hours_left = Math.floor((this.time_left / (1000 * 60 * 60) - this.days_left * 24));
        this.minutes_left = Math.floor((this.time_left / (1000 * 60) - (this.days_left * 24 * 60) - (this.hours_left * 60)));
        this.seconds_left = Math.floor((this.time_left / (1000)) - (this.days_left * 24 * 60 * 60) - (this.hours_left * 60 * 60) - (this.minutes_left * 60));
        this.days_dom.innerHTML = this.days_left;
        this.hours_dom.innerHTML = this.hours_left;
        this.minutes_dom.innerHTML = this.minutes_left;
        this.seconds_dom.innerHTML = this.seconds_left;
    }
}

let coundown = new Construction('clock');