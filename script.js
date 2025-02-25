const container = document.querySelector(".calculator-wrap");
const buttons = container?.querySelectorAll("button");
const calculatorStatusEl = container.querySelector(".status");
const calculatorScreenEl = container.querySelector("input");
const buttonStart = container.querySelector(".btn-toggle"); // am selectat clasa pentru btn I/O
const buttonEqual = container.querySelector(".btn-eq"); // am selectat clasa pt =
const historyEl = container.querySelector(".history"); //am selectat pentru clasa history

let calculatorStatus = false;
let storeSecondary = false; //este folosit ca un "comutator" (true / false) care spune calculatorului unde sa salveze cifrele (in currentValue sau secondaryValue)
let currentValue = "";
let secondaryValue = "";
let total = 0;
let operation = ""; //am creat variabila operation
let resultDisplayed = false; //adaug o variabila ce vreau sa o folosesc pentru a nu se mai putea adauga cifre dupa un rezultat

//variabile pentru istoricul calculelor

let lastNum1 = "";
let lastNum2 = "";
let lastOperation = "";
let lastTotal = "";

[...buttons].forEach((button) =>
	button.addEventListener("click", (ev) => {
		const _this = ev.target;
		const action = button.getAttribute("data-action");

		// Butonul I/O - Porneste/Opreste calculatorul
		if (action === "toggle") {
			calculatorStatus = !calculatorStatus;
			calculatorStatusEl.classList.toggle("disabled");
			calculatorStatusEl.classList.toggle("enabled");
			calculatorStatusEl.innerText = calculatorStatus ? "ON" : "OFF";
			calculatorScreenEl.value = calculatorStatus ? "0" : "";

			if (!calculatorStatus) {
				//se sterge istoricul la inchidere
				historyEl.innerHTML = "";
			}

			//OFF = Dezactivează/activează butoanele în funcție de status
			// am adaugat disabled pe butoane
			buttons.forEach((btn) => {
				if (btn !== buttonStart) btn.disabled = !calculatorStatus;
			});
		}

		//verifica daca este un input si daca a fost apasat un buton
		//Daca se apasa o cifra (0-9)
		if (action === "input") {
			const buttonValue = _this.getAttribute("data-value"); //se ia valoarea butonului

			if (resultDisplayed) {
				return; // blocheaza introducerea cifrelor
			}
			if (storeSecondary) {
				secondaryValue = secondaryValue + buttonValue;
				calculatorScreenEl.value = secondaryValue;
				return;
			}

			currentValue = currentValue + buttonValue;
			calculatorScreenEl.value = currentValue;
		}

		//Daca se apasa un operator (+, -, *, /,√)
		// verifica daca a fost apasat un operator
		if (action === "operation") {
			if (currentValue === "") return; // nu permite un operator fara un nr inainte
			operation = button.getAttribute("data-operator");
			//resultDisplayed este true imediat dupa ce utilizatorul apasa = sau √ ceea ce blocheaza introducerea de cifre
			if (resultDisplayed) {
				storeSecondary = true; // Permitem introducerea cifrelor in secondaryValue
				//indică faptul ca următoarele cifre vor merge in secondaryValue in loc de currentValue
				resultDisplayed = false; //se reseteaza resultDisplayed = false; astfel încat sa permitem introducerea cifrelor
			} else {
				storeSecondary = true;
			}
		}

		//daca apas pt clear
		if (action === "clear") {
			storeSecondary = false;
			currentValue = ""; //valoarea curenta devine 0
			secondaryValue = ""; //valorea secundara devine 0
			total = 0; //valoarea totala devine 0
			operation = "";
			calculatorScreenEl.value = "";
			historyEl.innerHTML = ""; //se sterge istoricul la apasarea tastei clear
			resultDisplayed = false;
		}

		//daca se apasa egal =

		if (action === "equal") {
			//trebuie verificat daca valoarea curenta,  valoarea secundara si opearatia nu sunt nule
			if (currentValue !== "" && secondaryValue !== "" && operation !== "") {
				//daca nu sunt nule
				let num1 = parseFloat(currentValue);
				let num2 = parseFloat(secondaryValue);
				let tempOperation = operation; //pentru history

				if (operation === "+") {
					total = num1 + num2;
				}
				if (operation === "-") {
					total = num1 - num2;
				}
				if (operation === "*") {
					total = num1 * num2;
				}
				if (operation === "/") {
					if (num2 == 0) {
						calculatorScreenEl.value = "Error";
						return;
					} else {
						total = num1 / num2;
					}
				}

				calculatorScreenEl.value = total; // afisare rezultat

				//pentru istoric

				lastNum1 = num1;
				lastNum2 = num2;
				lastOperation = tempOperation;
				lastTotal = total;

				//pentru a continua calculul
				currentValue = total.toString(); //pastreaza rezultatul pentru urmatoarele calcule
				secondaryValue = ""; // a doua valoarea devine goala
				operation = null; //operatia devine nula
				storeSecondary = false; // storeSecondary devine false

				resultDisplayed = true; //blocheaza introducerea de cifre dupa =
			}
		}

		//am adaugat si sqrt
		//trebuie tratat separat ca are doar o singura variabila
		if (action === "sqrt") {
			let num = parseFloat(currentValue);
			if (num < 0) {
				calculatorScreenEl.value = "Error";
				return;
			} else {
				total = Math.sqrt(num);
			}

			calculatorScreenEl.value = total;

			resultDisplayed = true; //blocheaza introducerea de cifre dupa sqrt

			//pentru istoric
			lastNum1 = num;
			lastTotal = total;
			lastOperation = "√";

			//pentru a continua calculul
			currentValue = total.toString(); //pastreaza rezultatul pentru urmatoarele calcule
			secondaryValue = ""; // a doua valoarea devine goala
			operation = null; //operatia devine nula
			storeSecondary = false; // storeSecondary devine false
		}

		//pentru a vedea istoricul operatiilor
		if (action === "history") {
			if (lastOperation === "√") {
				historyEl.innerHTML += `<p>√${lastNum1} = ${lastTotal}</p>`;
			} else if (lastOperation !== "") {
				historyEl.innerHTML += `<p>${lastNum1} ${lastOperation} ${lastNum2} = ${lastTotal}</p>`;
			}
		}
	})
);
