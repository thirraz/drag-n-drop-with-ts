/// <reference path='base-component.ts'/>

// ProjectInput Class
namespace App {
	export class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
		titleInputElement: HTMLInputElement
		descriptionInputElement: HTMLInputElement
		peopleInputElement: HTMLInputElement

		constructor() {
			super("#project-input", "#app", true, "user-input")

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
		}

		configure() {
			this.element.addEventListener("submit", this.submitHandler.bind(this))
		}

		renderContent() {}

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
	}
}
