"use strict";

class UsersService {
    constructor(usersList) {
        this.usersList = usersList;
    }

    getUsers(filterParams = null) {
        fetch(`https://jsonplaceholder.typicode.com/users?${filterParams ?? ''}`)
            .then(response => response.json())
            .then(json => this.appendUsersToList(json))
            .catch(error => {
                console.error('Fetch error:', error);
                this.usersList.innerHTML = 'Failed to load users';
            });
    }

    appendUsersToList(result) {
        this.usersList.innerHTML = '';

        result?.forEach((element) => {
            this.usersList.insertAdjacentHTML("beforeEnd", `
                <li class="cards__item">
                    <div class="head">
                        <div>${element?.username}</div>
                        <a href="#">${element?.website}</a>
                    </div>

                    <div class="title">Company information:</div>
                    <ul class="info-block">
                        <li class="info-block__item">
                            <span>Name:</span>
                            <div>${element?.company.name}</div>
                        </li>
                        <li class="info-block__item">
                            <span>BS:</span>
                            <div>${element?.company.bs}</div>
                        </li>
                        <li class="info-block__item">
                            <span>Phrase:</span>
                            <q>${element?.company.catchPhrase}</q>
                        </li>
                    </ul>
                </li>
            `);
        });

        if (!result.length) { this.usersList.innerHTML = 'No Data'; }
    }
}

class FilterService {
    constructor(filter, inputsCollection, usersService) {
        this.filter = filter;
        this.inputsCollection = inputsCollection;
        this.usersService = usersService;
    }

    get isFilterOpen() {
        return this.filter.classList.contains('show');
    }

    applyFilter() {
        const filterParams = [];
        this.inputsCollection.forEach((items) => {
            if (items.value) {
                filterParams.unshift(`${items.name}=${encodeURIComponent(items.value)}`);
            }
        });
        if (filterParams.length) {
            this.usersService.getUsers(filterParams.join('&'));
            this.filter.classList.remove('show');
        }
    }

    toggleFilter() {
        this.isFilterOpen ? this.hideFilter() : this.showFilter();
    }

    showFilter() {
        this.filter.classList.add('show');
    }

    hideFilter() {
        this.filter.classList.remove('show');
    }
}

window.onload = function() {
    // Init UsersService
    const usersService = new UsersService(document.querySelector('.cards'));
    usersService.getUsers();

    // Init FilterService
    const form = document.getElementById("form");
    const filterService = new FilterService(
        document.getElementById('filter'),
        form.querySelectorAll(".form__input"),
        usersService
    );

    // Events
    const filterIcon = document.getElementById('filter-icon');
    const cancelBtn = document.getElementById('form-cancel');
    const applyBtn = document.getElementById('form-apply');
    const resetBtn = document.getElementById('form-reset');

    filterIcon.addEventListener('click', () => filterService.toggleFilter());
    cancelBtn.addEventListener('click', () => filterService.hideFilter());
    applyBtn.addEventListener('click', () => filterService.applyFilter());
    resetBtn.addEventListener('click', () => {
        usersService.getUsers();
        filterService.hideFilter();
    });

};
