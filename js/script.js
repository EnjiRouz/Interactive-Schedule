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

/**
 * Инициализация базовых дисциплин таблицы
 * @param response - ответ сервера
 */
function initializeBaseSubjects(response) {
	let baseSubjects = JSON.parse(response);

	for (let i=0; i<Object.keys(baseSubjects).length; i++) {
		getById(baseSubjects[i].id+"-semester").innerText=baseSubjects[i].subjects;
	}
}

/**
 * Инициализация дополнительных дисциплин
 * @param response - ответ сервера
 */
function initializeExtraSubjects(response) {
	let extraSubjects = JSON.parse(response);
	let mySet = new Set();

	for (let i = 0; i < Object.keys(extraSubjects).length; i++) {
		mySet.add(extraSubjects[i].category);
	}

	console.log(mySet);
}

window.onload=function() {
	initializeBaseSubjects(serverResponseBaseSubjects);
	initializeExtraSubjects(serverResponseExtraSubjects)
};


// TODO create template for course element
// TODO associate category with color in cycle way
// TODO group 9 elements in colorful row by category name
// TODO setup color as enum to use its number
// TODO create courses templates with colors, right rows with the same category
// TODO drag and drop out object (and move it to the right container)
// TODO save table to make pdf and statistic table with user hashcode id