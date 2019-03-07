// Classes
class Budget {
	constructor(budget) {
		this.budget = Number(budget); // to convert the "budget" string to an int
		this.budgetLeft = this.budget;
	}

	subtractFromBudget(amount) {
		return this.budgetLeft -= amount;
	}
}

// Everything related to HTML
class HTML {
	constructor() {}

	insertBudget(amount) {
		// Show in the HTML
		budgetTotal.innerHTML = `${amount}`;
		budgetLeft.innerHTML = `${amount}`;
	}

	printMessage(message, className) {
		const messageWrapper = document.createElement('div');
		messageWrapper.classList.add('text-center', 'alert', className);
		messageWrapper.appendChild(document.createTextNode(message));

		document.querySelector('.primary').insertBefore(messageWrapper, addExpenseForm);

		// clear the error message after 3 seconds
		setTimeout(function() {
			document.querySelector('.primary .alert').remove();
			addExpenseForm.reset();
		}, 3000);
	};

	// Displays the expenses on the list once the form is submitted
	addExpenseToList(name, amount) {
		const expenseList = document.querySelector('#expenses ul');

		// Add a new list item
		const li = document.createElement('li');
		li.className = 'list-group-item d-flex justify-content-between align-items-center';
		// first, create the template
		li.innerHTML = `
			${name}
			<span class="badge badge-primary badge-pill">$${amount}</span>
		`;
		// and now, insert it into the HTML
		expenseList.appendChild(li);
	}

	trackBudget(amount) {
		const budgetLeftDollars = budget.subtractFromBudget(amount);
		budgetLeft.innerHTML = `$${budgetLeftDollars}`;

		if ((budget.budget / 4) >= budgetLeftDollars) {
			budgetLeft.parentElement.parentElement.classList.remove('alert-success', 'alert-warning');
			budgetLeft.parentElement.parentElement.classList.add('alert-danger');
		} else if ((budget.budget / 2) >= budgetLeftDollars) {
			budgetLeft.parentElement.parentElement.classList.remove('alert-success');
			budgetLeft.parentElement.parentElement.classList.add('alert-warning');
		}
	}
}

// Variables
const addExpenseForm = document.querySelector('#add-expense'),
	budgetTotal = document.querySelector('span#total'),
	budgetLeft = document.querySelector('span#left');

let budget, userBudget;

// Instantiating classes
const html = new HTML();

// Event Listeners
eventListeners();
function eventListeners() {

	// App Init
	document.addEventListener('DOMContentLoaded', function() {
		userBudget = prompt("What's your budget for the week?");

		/**
		 * Make sure the user actually entered something. If
		 * he/she clicks "Cancel" or leaves the input field
		 * blank, then we just refresh the page.
		 */
		if (userBudget === null || userBudget === '' || userBudget == 0) {
			window.location.reload();
		} else {
			/**
			 * Once we've check to make sure the budget is
			 * valid, we can instantiate the Budget class.
			 */
			budget = new Budget(userBudget);

			// Instantiate the HTML class
			html.insertBudget(budget.budget);
		}
	});

	// Adding a new expense
	addExpenseForm.addEventListener('submit', function(e) {
		e.preventDefault();
		// Read the values from the "budget" form
		const expenseName = document.querySelector('#expense').value;
		const amount = document.querySelector('#amount').value;

		if (expenseName === '' || amount === '') {
			html.printMessage("There was an error: All the fields are mandatory.", 'alert-danger');
		} else {
			html.addExpenseToList(expenseName, amount);
			html.trackBudget(amount);
			html.printMessage("Expense successfully added.", 'alert-success');
		}
	});
}
