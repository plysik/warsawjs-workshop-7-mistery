class componentSlideshow extends HTMLElement{
    constructor(){
        super();
        this.shadow  = this.attachShadow({mode:'open'});
    }
    connectedCallback(){        
        this._attachTemplate();
        this.addEventListener('click', this._clickHandler);
    }
    disconectedCallback(){
        this.removeEventListener('click', this._clickHandler);
    }

    _attachTemplate(){
        let template = document.currentScript.ownerDocument.querySelector("template").content.cloneNode(true);
        this.shadow.appendChild(template);
    }

    _clickHandler(){
        if(!this.slider)
        {
            this.slider = new Slider({items:this.children, callback:($child)=>this._displayChild($child.cloneNode(true)), delay:1000});
        }
        else{
            this.slider.stop();
            this.slider = null;
            let $childContainer = this.shadow.querySelector(".content");
            $childContainer.innerText = '';
        }
    }
    _displayChild($element){
        let $childContainer = this.shadow.querySelector(".content");
        $childContainer.innerText = '';
        $childContainer.appendChild($element);
    }
}

window.customElements.define('component-slideshow', componentSlideshow);

