/// <reference path='base-component.ts'/>

// ProjectList Class
namespace App {
	export class ProjectList
		extends Component<HTMLDivElement, HTMLElement>
		implements DragTarget
	{
		protected listEl = this.element.querySelector("ul")!
		assignedProjects: Project[]

		constructor(private type: "active" | "finished") {
			super("#project-list", "#app", false, `${type}-projects`)

			this.assignedProjects = []

			this.configure()
			this.renderContent()
		}

		dragOverHandler(event: DragEvent) {
			if (
				event.dataTransfer &&
				event.dataTransfer.types[0] === "text/plain"
			) {
				event.preventDefault()
				this.listEl.classList.add("droppable")
			}
		}

		dragLeaveHandler(event: DragEvent) {
			this.listEl.classList.remove("droppable")
		}

		dropHandler(event: DragEvent) {
			const prjId = event.dataTransfer!.getData("text/plain")
			projectState.moveProject(
				prjId,
				this.type === "active"
					? ProjectStatus.Active
					: ProjectStatus.Finished
			)
		}

		configure() {
			this.element.addEventListener(
				"dragover",
				this.dragOverHandler.bind(this)
			)
			this.element.addEventListener(
				"dragleave",
				this.dragLeaveHandler.bind(this)
			)
			this.element.addEventListener("drop", this.dropHandler.bind(this))

			projectState.addListener((projects: Project[]) => {
				const relevantProjects = projects.filter(prj => {
					if (this.type === "active")
						return prj.status === ProjectStatus.Active

					return prj.status === ProjectStatus.Finished
				})
				this.assignedProjects = relevantProjects
				this.renderProjects()
			})
		}

		renderContent() {
			const listId = `${this.type}-projects-list`

			this.element.querySelector("ul")!.id = listId
			this.element.querySelector(
				"h2"
			)!.textContent = `${this.type.toUpperCase()} PROJECTS`
		}

		renderProjects() {
			const listEl = <HTMLUListElement>(
				document.querySelector(`#${this.type}-projects-list`)
			)

			listEl.innerHTML = ""

			for (const prjItem of this.assignedProjects) {
				new ProjectItem(this.element.querySelector("ul")!.id, prjItem)
			}
		}
	}
}
