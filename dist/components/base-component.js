// Component Base Class
export class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = (document.querySelector(templateId));
        this.hostElement = document.querySelector(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(insertAtStart);
    }
    attach(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
    }
}
