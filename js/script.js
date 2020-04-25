const Colors = Object.freeze([
	"red",
	"pink",
	"purple",
	"blue",
	"sea",
	"green",
	"yellow",
]);

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
	let categories = new Set();

	// выделение множества категорий курсов
	for (let i = 0; i < Object.keys(extraSubjects).length; i++) {
		categories.add(extraSubjects[i].category);
	}

	// создание ячеек с дополнительными дисциплиными, разделенных по цветам
	let categoriesArray = Array.from(categories);
	for (let i=0; i<categoriesArray.length; i++) {
		let category = getById("subjectsOfChoiceTable");
		category.innerHTML += "<tr><td class='non-editable-table-cell clickable "+ Colors[i] +"' colspan='9' id='category-"+ i +"' onclick='hideElementsWithClass("+'"'+ Colors[i] + '"' +")'>"+ categoriesArray[i] +" (скрыть) </td></tr>";

		// подсчёт количества курсов для конкретной категории
		let categoryCourses=[];
		for (let j=0; j<Object.keys(extraSubjects).length; j++) {
			if (categoriesArray[i] === extraSubjects[j].category) {
				categoryCourses.push(extraSubjects[j].name);
			}
		}

		// разделение курсов по строкам внутри категории
		let coursesContent="";
		for(let k=0; k<categoryCourses.length; k++){
			if(k===0)
				coursesContent += "<tr>";

			if(k % 9===0 && k!==0)
				coursesContent += "</tr><tr>";

			coursesContent += "<td class='can-be-hidden'><div id='course-" + k + "_category-" + i + "' class='draggable-content " + Colors[i] + "'>" + categoryCourses[k] + "</div></td>";

			// добавление ячеек в конец таблицы
			if(k===categoryCourses.length-1) {
				if(k % 9!==0) {
					for(let m=0;m<9-k%9-1;m++)
						coursesContent += "<td></td>"
				}
				coursesContent += "</tr>";
			}
		}
		category.innerHTML+=coursesContent;
	}
}


window.onload=function() {
	initializeBaseSubjects(serverResponseBaseSubjects);
	initializeExtraSubjects(serverResponseExtraSubjects);
	redips.init();
};

// TODO drag and drop out object (and move it to the right container) <------think about attachment with id
// TODO save table to make pdf and statistic table with user hashcode id