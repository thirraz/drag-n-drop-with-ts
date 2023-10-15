import { Project } from "../models/project.js"
import { Component } from "../components/base-component.js"
import { Draggable } from "../models/drag-n-drop.js"

// Project Item Class
export class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable
{
	get persons() {
		if (this.project.people === 1) return "1 person"

		return `${this.project.people} persons`
	}

	constructor(hostId: string, private project: Project) {
		super("#single-project", `#${hostId}`, false, `#${project.id}`)
		this.project = project

		this.configure()
		this.renderContent()
	}

	dragStartHandler(event: DragEvent) {
		event.dataTransfer!.setData("text/plain", this.project.id)
		event.dataTransfer!.effectAllowed = "move"
	}

	dragEndHandler(_: DragEvent) {
		console.log("Dragend")
	}

	configure() {
		this.element.addEventListener(
			"dragstart",
			this.dragStartHandler.bind(this)
		)
		this.element.addEventListener("dragend", this.dragEndHandler.bind(this))
	}

	renderContent() {
		this.element.querySelector("h2")!.textContent = this.project.title
		this.element.querySelector(
			"h3"
		)!.textContent = `${this.persons} assigned.`
		this.element.querySelector("p")!.textContent = this.project.description
	}
}
