import { Component } from "../components/base-component.js";
import { ProjectItem } from "../components/project-item.js";
import { ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
// ProjectList Class
export class ProjectList extends Component {
    constructor(type) {
        super("#project-list", "#app", false, `${type}-projects`);
        this.type = type;
        this.listEl = this.element.querySelector("ul");
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            this.listEl.classList.add("droppable");
        }
    }
    dragLeaveHandler(event) {
        this.listEl.classList.remove("droppable");
    }
    dropHandler(event) {
        const prjId = event.dataTransfer.getData("text/plain");
        projectState.moveProject(prjId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler.bind(this));
        this.element.addEventListener("dragleave", this.dragLeaveHandler.bind(this));
        this.element.addEventListener("drop", this.dropHandler.bind(this));
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === "active")
                    return prj.status === ProjectStatus.Active;
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
    renderProjects() {
        const listEl = (document.querySelector(`#${this.type}-projects-list`));
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul").id, prjItem);
        }
    }
}
