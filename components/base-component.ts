// Component Base Class
namespace App {
	export abstract class Component<
		T extends HTMLDivElement | HTMLUListElement,
		U extends HTMLElement
	> {
		templateElement: HTMLTemplateElement
		hostElement: T
		element: U

		constructor(
			templateId: string,
			hostElementId: string,
			insertAtStart: boolean,
			newElementId?: string
		) {
			this.templateElement = <HTMLTemplateElement>(
				document.querySelector(templateId)
			)

			this.hostElement = <T>document.querySelector(hostElementId)

			const importedNode = document.importNode(
				this.templateElement.content,
				true
			)

			this.element = <U>importedNode.firstElementChild

			if (newElementId) this.element.id = newElementId

			this.attach(insertAtStart)
		}

		private attach(insertAtBeginning: boolean) {
			this.hostElement.insertAdjacentElement(
				insertAtBeginning ? "afterbegin" : "beforeend",
				this.element
			)
		}

		abstract configure?(): void
		abstract renderContent(): void
	}
}
