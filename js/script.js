/**
 * Получение элементов по id
 * @param id - идентификатор элемента
 * @returns {HTMLElement}
 */
function getById(id){
	return document.getElementById(id);
}

/**
 * Получение элементов по имени класса
 * @param className - имя класса
 * @returns {HTMLCollectionOf<Element>}
 */
function getByClassName(className){
	return document.getElementsByClassName(className);
}

/**
 * Получение элементов по тегу
 * @param tag - тег элемента
 * @returns {HTMLCollectionOf<HTMLElementTagNameMap[*]>}
 */
function getByTag(tag){
	return document.getElementsByTagName(tag);
}

/**
 * Скрывает элементы заданного класса (в данном случае используется для таблицы курсов, которые можно скрыть/показать
 * в отдельной части таблицы, меняя при этом заголовок)
 * @param className имя класса, элементы которого требуется скрыть
 */
function hideElementsWithClass(className){
	let foundElements=getByClassName(className);
	let categoryTitle=document.getElementsByClassName("clickable "+className);

	if(categoryTitle[0].textContent.includes("(показать)"))	{
		categoryTitle[0].textContent=categoryTitle[0].textContent.replace("(показать)", "(скрыть)");
		for(let i=0; i<foundElements.length; i++)
			if(foundElements[i].parentElement.classList.contains("can-be-hidden"))
				foundElements[i].classList.remove("hide");
	}
	else {
		categoryTitle[0].textContent = categoryTitle[0].textContent.replace("(скрыть)", "(показать)");
		for (let i = 0; i < foundElements.length; i++)
			if(foundElements[i].parentElement.classList.contains("can-be-hidden"))
				foundElements[i].classList.add("hide");
	}
	categoryTitle[0].classList.remove("hide");
}

// create redips container
let redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag object
	let rd = REDIPS.drag;
	// initialization
	rd.init();
	// REDIPS.drag settings
	rd.dropMode = 'single';			// dragged elements can be placed only to the empty cells
	rd.hover.colorTd = '#9BB3DA';	// set hover color
	rd.clone.keyDiv = true;			// enable cloning DIV elements with pressed SHIFT key
	// prepare node list of DIV elements in curriculumTable
	redips.divNodeList = document.getElementById('curriculumTable').getElementsByTagName('div');
	// element is dropped
	rd.event.dropped = function () {
		let	objOld = rd.objOld,					// original object
			targetCell = rd.td.target,			// target cell
			targetRow = targetCell.parentNode,	// target row
			i, objNew;							// local variables
	};
};

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}