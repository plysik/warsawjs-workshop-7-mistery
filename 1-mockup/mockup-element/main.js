class MockupElement extends HTMLElement{
    constructor(){
        super();
        this.shadow  = this.attachShadow({mode:'open'});
    }
    connectedCallback(){
        let template = MockupElement.DOCUMENT.querySelector("template").content.cloneNode(true);
        this.shadow.appendChild(template);
        let $img = this.shadow.querySelector('img');
        $img.src = this.attributes.imageSrc.value;
        
        let $h1 = this.shadow.querySelector("h1");
        $h1.innerHTML = this.attributes.label.value;
    }
}
MockupElement.DOCUMENT = document.currentScript.ownerDocument;

window.customElements.define('mockup-element', MockupElement);

