var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function validate(validatableInput) {
    var value = validatableInput.value, max = validatableInput.max, maxLength = validatableInput.maxLength, min = validatableInput.min, minLength = validatableInput.minLength, required = validatableInput.required;
    var isValid = true;
    // validations for string values
    if (required)
        isValid = isValid && value.toString().trim().length !== 0;
    if (minLength != null && typeof value === "string")
        isValid = isValid && value.length > minLength;
    if (maxLength != null && typeof value === "string")
        isValid = isValid && value.length < maxLength;
    // validations for number values
    if (min != null && typeof value === "number")
        isValid = isValid && value >= min;
    if (max != null && typeof value === "number")
        isValid = isValid && value <= max;
    return isValid;
}
// Project Type
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
var Project = /** @class */ (function () {
    function Project(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var State = /** @class */ (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListener = function (listenerFn) {
        this.listeners.push(listenerFn);
    };
    return State;
}());
var ProjectState = /** @class */ (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super.call(this) || this;
        _this.projects = [];
        return _this;
    }
    ProjectState.getInstance = function () {
        if (this.instance)
            return this.instance;
        this.instance = new ProjectState();
        return this.instance;
    };
    ProjectState.prototype.addProject = function (title, description, numOfPeople) {
        // const newProject = {
        // 	id: Math.random.toString(),
        // 	title,
        // 	description,
        // 	people: numOfPeople
        // }
        var newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFn = _a[_i];
            listenerFn(this.projects.slice());
        }
    };
    return ProjectState;
}(State));
var projectState = ProjectState.getInstance();
// Component Base Class
var Component = /** @class */ (function () {
    function Component(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = (document.querySelector(templateId));
        this.hostElement = document.querySelector(hostElementId);
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
    };
    return Component;
}());
// Project Item Class
var ProjectItem = /** @class */ (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = _super.call(this, "#single-project", "#".concat(hostId), false, "#".concat(project.id)) || this;
        _this.project = project;
        _this.project = project;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    Object.defineProperty(ProjectItem.prototype, "persons", {
        get: function () {
            if (this.project.people === 1)
                return "1 person";
            return "".concat(this.project.people, " persons");
        },
        enumerable: false,
        configurable: true
    });
    ProjectItem.prototype.dragStartHandler = function (event) {
        event.dataTransfer.setData("text/plain", this.project.id);
        event.dataTransfer.effectAllowed = "move";
    };
    ProjectItem.prototype.dragEndHandler = function (_) {
        console.log("Dragend");
    };
    ProjectItem.prototype.configure = function () {
        this.element.addEventListener("dragstart", this.dragStartHandler.bind(this));
        this.element.addEventListener("dragend", this.dragEndHandler.bind(this));
    };
    ProjectItem.prototype.renderContent = function () {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = "".concat(this.persons, " assigned.");
        this.element.querySelector("p").textContent = this.project.description;
    };
    return ProjectItem;
}(Component));
// ProjectList Class
var ProjectList = /** @class */ (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(type) {
        var _this = _super.call(this, "#project-list", "#app", false, "".concat(type, "-projects")) || this;
        _this.type = type;
        _this.listEl = _this.element.querySelector("ul");
        _this.assignedProjects = [];
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.dragOverHandler = function (event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            this.listEl.classList.add("droppable");
        }
    };
    ProjectList.prototype.dragLeaveHandler = function (event) {
        this.listEl.classList.remove("droppable");
    };
    ProjectList.prototype.dropHandler = function (event) {
        console.log(event.dataTransfer.getData("text/plain"));
    };
    ProjectList.prototype.configure = function () {
        var _this = this;
        this.element.addEventListener("dragover", this.dragOverHandler.bind(this));
        this.element.addEventListener("dragleave", this.dragLeaveHandler.bind(this));
        this.element.addEventListener("drop", this.dropHandler.bind(this));
        projectState.addListener(function (projects) {
            var relevantProjects = projects.filter(function (prj) {
                if (_this.type === "active")
                    return prj.status === ProjectStatus.Active;
                return prj.status === ProjectStatus.Finished;
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
    };
    ProjectList.prototype.renderContent = function () {
        var listId = "".concat(this.type, "-projects-list");
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = "".concat(this.type.toUpperCase(), " PROJECTS");
    };
    ProjectList.prototype.renderProjects = function () {
        var listEl = (document.querySelector("#".concat(this.type, "-projects-list")));
        listEl.innerHTML = "";
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var prjItem = _a[_i];
            new ProjectItem(this.element.querySelector("ul").id, prjItem);
        }
    };
    return ProjectList;
}(Component));
// ProjectInput Class
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, "#project-input", "#app", true, "user-input") || this;
        _this.titleInputElement = (_this.element.querySelector("#title"));
        _this.descriptionInputElement = (_this.element.querySelector("#description"));
        _this.peopleInputElement = (_this.element.querySelector("#people"));
        _this.configure();
        return _this;
    }
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
    };
    ProjectInput.prototype.renderContent = function () { };
    ProjectInput.prototype.gatherUserInput = function () {
        var enteredTitle = this.titleInputElement.value;
        var enteredDescription = this.descriptionInputElement.value;
        var enteredPeople = this.peopleInputElement.value;
        var titleValidatable = {
            value: enteredTitle,
            required: true
        };
        var descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        var peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert("Invalid input, please try again!");
            return;
        }
        return [enteredTitle, enteredDescription, +enteredPeople];
    };
    ProjectInput.prototype.clearInputs = function () {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    };
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], desc = userInput[1], people = userInput[2];
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    };
    return ProjectInput;
}(Component));
var prjInput = new ProjectInput();
var activePrjList = new ProjectList("active");
var finishedPrjList = new ProjectList("finished");
