/// <reference path='models/drag-n-drop.ts'/>
/// <reference path='models/project.ts'/>
/// <reference path='state/project-state.ts'/>
/// <reference path='util/validation.ts'/>
/// <reference path='components/project-input.ts'/>
/// <reference path='components/project-item.ts'/>
/// <reference path='components/project-list.ts'/>
/// <reference path='components/base-component.ts'/>

namespace App {
	new ProjectInput()
	new ProjectList("active")
	new ProjectList("finished")
}
