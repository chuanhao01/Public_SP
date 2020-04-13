class SlideShow{
    constructor(slide_show_id, pictures_obj){
        // getting high level document
        this.slide_show_obj = document.getElementById(slide_show_id);
        this.slide_show_description = this.slide_show_obj.children['slideShowDescription'];
        this.max_height = this.slide_show_obj.clientHeight;
        window.addEventListener('resize',() => {
            this.max_height = this.slide_show_obj.clientHeight;
        } );
        // getting the description parts
        this.description_box = this.slide_show_description.children['descriptionBox'];
        this.dot_selector = this.slide_show_description.children['dotSelector'];
        // getting the div to add images in
        this.pic_frame = this.slide_show_obj.children[0].children['picFrame'];
        // getting arrows
        this.right_arrow = this.slide_show_obj.children['rightArrow'];
        this.left_arrow = this.slide_show_obj.children['leftArrow'];
        this.right_arrow.addEventListener('click', this.onRightArrow.bind(this));
        this.left_arrow.addEventListener('click', this.onLeftArrow.bind(this));
        // setting up paths for the pictures
        this.root_path = '../Content/';
        this.pictures_obj = pictures_obj;
        for(let picture in this.pictures_obj){
            this.createPath(this.pictures_obj[picture]);
        }
        // setting up the dots
        this.createDots();
        // setting up the slide show
        this.current_slide_show = 0;
        this.getSlide(0);
        this.slide_show_timer = setInterval(() =>{
            this.getSlide(this.current_slide_show + 1);
        }, 2000);        
    }
    createPath(pic_obj){
        pic_obj.path = this.root_path + pic_obj.name;
    }
    createDots(){
        let num_of_pictures = Object.keys(this.pictures_obj).length;
        for(let i=0; i<num_of_pictures; i++){
            let dot = document.createElement('span');
            dot.classList.add('dot');
            dot.classList.add('mx-1');
            dot.value = i;
            dot.addEventListener('click', this.onDotClick.bind(this));
            this.dot_selector.appendChild(dot);
        }
    }
    getSlide(slide_number){
        let pic_frame = this.pic_frame;
        let pictures_obj = this.pictures_obj;
        let num_of_pictures = Object.keys(pictures_obj).length;
        // removing the child elements
        while(pic_frame.firstChild){
            pic_frame.removeChild(pic_frame.firstChild);
        }
        let dom_pic = document.createElement('img');
        // checking if there is roll over
        if(slide_number < 0){
            slide_number = num_of_pictures - 1;
        }
        else if(slide_number > num_of_pictures - 1){
            slide_number = 0;
        }
        let current_pic_obj;
        for(let picture in pictures_obj){
            if(parseInt(pictures_obj[picture].id) === slide_number){
                current_pic_obj = pictures_obj[picture]; 
            }
        }
        dom_pic.src = current_pic_obj.path;
        dom_pic.style.maxHeight = `${this.max_height}px`;
        dom_pic.classList.add('img-fluid');
        pic_frame.appendChild(dom_pic);
        this.updateDot(slide_number);
        this.current_slide_show = slide_number;
    }
    updateDot(slide_number){
        let dots = this.dot_selector.children;
        dots = [].slice.call(dots);
        for(let i=0; i<dots.length; i++){
            dots[i].classList.remove('active');
        }
        dots[slide_number].classList.add('active');
    }
    onRightArrow(event){
        event.preventDefault();
        this.getSlide(this.current_slide_show + 1);
    }
    onLeftArrow(event){
        event.preventDefault();
        this.getSlide(this.current_slide_show - 1);
    }
    onDotClick(event){
        event.preventDefault();
        this.getSlide(event.target.value);
    }
}

let quiz_carousel = new SlideShow('quiz_carousel', quiz_data);
let pomodoro_carousel = new SlideShow('pomodoro_carousel', pomodoro_timer_data);
let seed_carousel = new SlideShow('seed_carousel', seed_data);
let personal_carousel = new SlideShow('personal_carousel', personal_website_data);