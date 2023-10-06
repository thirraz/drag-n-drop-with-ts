// validation
interface Validatable {
	value: string | number
	required?: boolean
	minLength?: number
	maxLength?: number
	min?: number
	max?: number
}

function validate(validatableInput: Validatable) {
	const { value, max, maxLength, min, minLength, required } = validatableInput
	let isValid = true

	// validations for string values
	if (required) isValid = isValid && value.toString().trim().length !== 0

	if (minLength != null && typeof value === "string")
		isValid = isValid && value.length > minLength

	if (maxLength != null && typeof value === "string")
		isValid = isValid && value.length < maxLength

	// validations for number values
	if (min != null && typeof value === "number")
		isValid = isValid && value >= min

	if (max != null && typeof value === "number")
		isValid = isValid && value <= max

	return isValid
}

// Project Type
enum ProjectStatus {
	Active,
	Finished
}
class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

// Project State Management (Singleton)
type Listener = (items: Project[]) => void

class ProjectState {
	private listeners: Listener[] = []
	private projects: Project[] = []
	private static instance: ProjectState

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn)
	}

	addProject(title: string, description: string, numOfPeople: number) {
		// const newProject = {
		// 	id: Math.random.toString(),
		// 	title,
		// 	description,
		// 	people: numOfPeople
		// }
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			numOfPeople,
			ProjectStatus.Active
		)

		this.projects.push(newProject)
		for (const listenerFn of this.listeners) listenerFn(this.projects.slice())
	}

	static getInstance() {
		if (this.instance) return this.instance

		this.instance = new ProjectState()
		return this.instance
	}
}

const projectState = ProjectState.getInstance()

// ProjectList Class
class ProjectList {
	templateElement: HTMLTemplateElement
	hostElement: HTMLDivElement
	element: HTMLElement
	assignedProjects: Project[]

	constructor(private type: "active" | "finished") {
		this.templateElement = <HTMLTemplateElement>(
			document.querySelector("#project-list")
		)

		this.hostElement = <HTMLDivElement>document.querySelector("#app")

		this.assignedProjects = []

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		)

		this.element = <HTMLElement>importedNode.firstElementChild
		this.element.id = `${type}-projects`

		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects
			this.renderProjects()
		})

		this.attach()
		this.renderContent()
	}

	private renderProjects() {
		const listEl = <HTMLUListElement>(
			document.querySelector(`#${this.type}-projects-list`)
		)

		for (const prjItem of this.assignedProjects) {
			const listItem = document.createElement("li")
			listItem.textContent = prjItem.title
			listEl?.appendChild(listItem)
		}
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`

		this.element.querySelector("ul")!.id = listId
		this.element.querySelector(
			"h2"
		)!.textContent = `${this.type.toUpperCase()} PROJECTS`
	}

	private attach() {
		this.hostElement.insertAdjacentElement("beforeend", this.element)
	}
}

// ProjectInput Class
class ProjectInput {
	templateElement: HTMLTemplateElement
	hostElement: HTMLDivElement
	element: HTMLFormElement
	titleInputElement: HTMLInputElement
	descriptionInputElement: HTMLInputElement
	peopleInputElement: HTMLInputElement

	constructor() {
		this.templateElement = <HTMLTemplateElement>(
			document.querySelector("#project-input")
		)

		this.hostElement = <HTMLDivElement>document.querySelector("#app")

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		)

		this.element = <HTMLFormElement>importedNode.firstElementChild
		this.element.id = "user-input"

		this.titleInputElement = <HTMLInputElement>(
			this.element.querySelector("#title")
		)
		this.descriptionInputElement = <HTMLInputElement>(
			this.element.querySelector("#description")
		)
		this.peopleInputElement = <HTMLInputElement>(
			this.element.querySelector("#people")
		)

		this.configure()
		this.attach()
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputElement.value
		const enteredDescription = this.descriptionInputElement.value
		const enteredPeople = this.peopleInputElement.value

		const titleValidatable: Validatable = {
			value: enteredTitle,
			required: true
		}

		const descriptionValidatable: Validatable = {
			value: enteredDescription,
			required: true,
			minLength: 5
		}

		const peopleValidatable: Validatable = {
			value: +enteredPeople,
			required: true,
			min: 1
		}

		if (
			!validate(titleValidatable) ||
			!validate(descriptionValidatable) ||
			!validate(peopleValidatable)
		) {
			alert("Invalid input, please try again!")
			return
		}

		return [enteredTitle, enteredDescription, +enteredPeople]
	}

	private clearInputs() {
		this.titleInputElement.value = ""
		this.descriptionInputElement.value = ""
		this.peopleInputElement.value = ""
	}

	private submitHandler(event: Event) {
		event.preventDefault()
		const userInput = this.gatherUserInput()

		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput
			projectState.addProject(title, desc, people)
			this.clearInputs()
		}
	}

	private configure() {
		this.element.addEventListener("submit", this.submitHandler.bind(this))
	}

	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.element)
	}
}

const prjInput = new ProjectInput()
const activePrjList = new ProjectList("active")
const finishedPrjList = new ProjectList("finished")
