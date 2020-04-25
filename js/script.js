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
			if(foundElements[i].parentElement.classList.contains("can-be-hidden")) {
				foundElements[i].classList.remove("hide");
				foundElements[i].parentElement.classList.remove("hide");
			}
	}
	else {
		categoryTitle[0].textContent = categoryTitle[0].textContent.replace("(скрыть)", "(показать)");
		for (let i = 0; i < foundElements.length; i++)
			if(foundElements[i].parentElement.classList.contains("can-be-hidden")) {
				foundElements[i].classList.add("hide");
				foundElements[i].parentElement.classList.add("hide");
			}
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
						coursesContent += "<td class='can-be-hidden'><div class='non-editable-table-cell " + Colors[i] + "' style='display: none;'></div></td>"
				}
				coursesContent += "</tr>";
			}
		}
		category.innerHTML+=coursesContent;
	}
}

/**
 * Проверка заполненности ячеек таблицы и вывод таблицы в pdf в случае полностью заполненной таблицы
 */
function checkCells() {
	let extraSubjectsCells = getByClassName("extraSubject");
	let nonEmptyCells = 0;
	let userChoices=[];
	for (let i = 0; i < extraSubjectsCells.length; i++) {
		if (extraSubjectsCells[i].hasChildNodes())
			userChoices.push(extraSubjectsCells[i].childNodes[0].textContent);
			nonEmptyCells++;
	}

	if (nonEmptyCells === extraSubjectsCells.length)
		createPdf(userChoices);
}

/**
 * Создание pdf-файла с выборами пользователя
 * Документация: https://github.com/simonbengtsson/jsPDF-AutoTable
 */
function createPdf(userChoices) {
	let baseSubjects = JSON.parse(serverResponseBaseSubjects);

	let doc = new jsPDF({
		orientation: "l", //p for portrait
		unit: "pt",
		format: "letter"
	});
	doc.addFileToVFS("./resources/fonts/times_new_roman.ttf", font);
	doc.addFont("./resources/fonts/times_new_roman.ttf", "TNR", "normal");
	doc.setFont("TNR");
	doc.setFontSize(12);
	doc.setTextColor(0, 0, 0);

	doc.autoTable({
		head: [[
			// заголовки
			{ content: "Базовые дисциплины", rowSpan: 4, styles:{ halign: "center",	valign: "middle",}},
			{ content: "1 курс", colSpan: 2, styles:{ halign: "center",	valign: "middle",}},
			{ content: "2 курс", colSpan: 2, styles:{ halign: "center", valign: "middle",}},
			{ content: "3 курс", colSpan: 2, styles:{ halign: "center", valign: "middle",}},
			{ content: "4 курс", colSpan: 2, styles:{ halign: "center", valign: "middle",}},
		]],
		body: [
			// вторая строка
			[
				{},
				{content:"1 семестр", styles:{halign: "center",	valign: "middle",}},
				{content:"2 семестр", styles:{halign: "center", valign: "middle",}},
				{content:"3 семестр", styles:{halign: "center", valign: "middle",}},
				{content:"4 семестр", styles:{halign: "center", valign: "middle",}},
				{content:"5 семестр", styles:{halign: "center", valign: "middle",}},
				{content:"6 семестр", styles:{halign: "center", valign: "middle",}},
				{content:"7 семестр", styles:{halign: "center", valign: "middle",}},
				{content:"8 семестр", styles:{halign: "center", valign: "middle",}},
			],

			// третья строка - базовые дисциплины
			[{},baseSubjects[0].subjects, baseSubjects[1].subjects, baseSubjects[2].subjects, baseSubjects[3].subjects,
				baseSubjects[4].subjects, baseSubjects[5].subjects, baseSubjects[6].subjects,baseSubjects[7].subjects],

			// дисциплины на выбор
			[{},{content: "Дисциплины на выбор", colSpan:8,styles:{ halign: "center", valign: "middle",}}],
			["Майнор 1",
				{content: "ВЫБОР НЕДОСТУПЕН", colSpan: 2, rowSpan:3,styles:{ halign: "center", valign: "middle",}},
				{content: userChoices[0], rowSpan:3,styles:{ halign: "center", valign: "middle",}},
				{content: userChoices[1], rowSpan:2,styles:{ halign: "center", valign: "middle",}},
				{content: userChoices[2]},
				{content: userChoices[3]},
				{content: userChoices[4]},
				{content: "ВЫБОР НЕДОСТУПЕН", rowSpan:3,styles:{ halign: "center", valign: "middle",}}],

			["Майнор 2", {content: userChoices[5]},	{content: userChoices[6]},	{content: userChoices[7]},	],
			["Майнор 3", {content: userChoices[8]},	{content: userChoices[9]}, {content: userChoices[10]},	{content: userChoices[11]},]
		],
		styles: {
			font: "TNR",
			fontStyle: "normal",
			fontSize: 8,
			overflow: "linebreak",
			lineColor: 240,
			lineWidth: 1,
		},
		margin: {top: 60},
	});
	doc.save("student-program.pdf");
}

window.onload=function() {
	initializeBaseSubjects(serverResponseBaseSubjects);
	initializeExtraSubjects(serverResponseExtraSubjects);
	redips.init();
};

// TODO drag and drop out object (and move it to the right container) <------think about attachment with id
// TODO statistic table with user hashcode id