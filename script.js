const allStepperLi = document.querySelectorAll('.stepper li');
const nextBtn = document.querySelector('.btn.next');
const prevBtn = document.querySelector('.btn.prev');
const headerTitle = document.querySelector('.wrapper .title');
const cardImgsNotSelected = document.querySelectorAll(
    '.card .card-img.not-selected'
);
const cardImgsSelected = document.querySelectorAll('.card .card-img.selected');
const cardTexts = document.querySelectorAll('.card p');
const cardCheckBoxes = document.querySelectorAll('.card .check');

const stepsContainer = document.querySelector('.wrapper .steps');
const formContainer = document.querySelector('.wrapper .form-control');
const btnsContainer = document.querySelector('.wrapper .btns.outer');

const form = document.querySelector('.form-control');
const nameInp = document.querySelector('.form-control .name');
const emailInp = document.querySelector('.form-control .email');
const phoneInp = document.querySelector('.form-control .phone');
const descriptionInp = document.querySelector('.form-control .description');
const conditionCheckBox = document.querySelector(
    '.condition .accept .accept-condition'
);
const prevFormBtn = document.querySelector('.form-control .form-prev');
const submitFormBtn = document.querySelector('.form-control .form-submit');

let selected = 0;
let data = {};

const typeData = {
    name: 'type',
    title: 'What type of project are you building?',
    imgs: {
        notSelected: [
            '/assets/web-developement.svg',
            '/assets/mobile-app.svg',
            '/assets/other.svg',
        ],
        selected: [
            '/assets/web-developement-clicked.svg',
            '/assets/mobile-app-clicked.svg',
            '/assets/other-clicked.svg',
        ],
    },
    texts: ['Desktop', 'Mobile', 'Other'],
};
const scopeData = {
    name: 'scope',
    title: 'What is the scope of your project?',
    imgs: {
        notSelected: [
            '/assets/front-end.svg',
            '/assets/backend.svg',
            '/assets/design-estimate.svg',
        ],
        selected: [
            '/assets/front-end-clicked.svg',
            '/assets/back-end-clicked.svg',
            '/assets/backend-design-clicked.svg',
        ],
    },
    texts: ['Front-End', 'Back-End', 'Design'],
};
const dateData = {
    name: 'date',
    title: 'How soon do you want us to start?',
    imgs: {
        notSelected: [
            '/assets/now.svg',
            '/assets/week.svg',
            '/assets/month.svg',
        ],
        selected: [
            '/assets/now-clicked.svg',
            '/assets/week-clicked.svg',
            '/assets/month-clicked.svg',
        ],
    },
    texts: ['Now', '1 Week', '1 Month'],
};

const cardData = [typeData, scopeData, dateData];

function setData() {
    const data = cardData[selected];

    headerTitle.textContent = data.title;
    data.imgs.notSelected.forEach((url, index) => {
        cardImgsNotSelected[index].src = url;
    });
    data.imgs.selected.forEach((url, index) => {
        cardImgsSelected[index].src = url;
    });
    data.texts.forEach((t, i) => {
        cardTexts[i].textContent = t;
    });
    cardCheckBoxes.forEach((c, i) => {
        c.setAttribute('data-id', data.texts[i]);
    });
    setCardCheckBox();
}

function setCardCheckBox() {
    let selectedCard = cardData[selected];
    cardCheckBoxes.forEach((c) => (c.checked = false));
    if (data[selectedCard.name]) {
        Object.entries(data[selectedCard.name]).forEach(([index, value]) => {
            cardCheckBoxes.forEach((c) => {
                cardCheckBoxes[index].checked = true;
            });
        });
    }
}

function goBack() {
    if (selected === 0) {
        allStepperLi[selected].classList.remove('done');
    } else {
        allStepperLi[selected].classList.remove('active');
        allStepperLi[selected].classList.remove('done');
        selected -= 1;
    }
    allStepperLi[selected].classList.remove('done');

    if (selected === 0) {
        prevBtn.style.display = 'none';
    }
    if (selected !== allStepperLi.length - 1) {
        stepsContainer.style.display = 'flex';
        btnsContainer.style.display = 'block';
        formContainer.style.display = 'none';
        nextBtn.textContent = 'Continue';
    }
    setData();

    if (typeof data[cardData[selected]?.name] === 'undefined') {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

function goNext() {
    allStepperLi[selected].classList.add('done');
    selected =
        selected === allStepperLi.length - 1 ? selected : (selected += 1);
    allStepperLi[selected].classList.add('active');

    if (selected > 0) {
        prevBtn.style.display = 'inline-block';
    }

    if (selected === allStepperLi.length - 1) {
        stepsContainer.style.display = 'none';
        formContainer.style.display = 'flex';
        headerTitle.textContent = 'Fill your contact details.';
        btnsContainer.style.display = 'none';
    } else {
        setData();
    }

    if (typeof data[cardData[selected]?.name] === 'undefined') {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

cardCheckBoxes.forEach((c, index) => {
    c.addEventListener('change', (e) => {
        let dataFor = cardData[selected];
        let checkedBox = e.target.getAttribute('data-id');
        let isChecked = e.target.checked;

        // For Date where user can select only one card
        if (selected === 2) {
            let tmpData = data[dataFor.name];
            if (tmpData) {
                if (Object.values(tmpData).length === 1) {
                    data[dataFor.name] = {};
                    setCardCheckBox();
                }
            }
        }

        // For Type where user can select only `Others` type of other than this
        if (selected === 0) {
            if (checkedBox === 'Other') {
                data[dataFor.name] = {};
                setCardCheckBox();
            } else {
                if (data[dataFor.name]) {
                    Object.values(data[dataFor.name]).forEach((c) => {
                        if (c === 'Other') {
                            data[dataFor.name] = {};
                            setCardCheckBox();
                        }
                    });
                }
            }
        }

        if (isChecked) {
            data[dataFor.name] = {
                ...data[dataFor.name],
                [index]: checkedBox,
            };
            setCardCheckBox();
        } else {
            delete data[dataFor.name][index];
        }

        formatData();

        if (Object.keys(data[dataFor.name]).length > 0) {
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
        }
    });
});

nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goBack);
prevFormBtn.addEventListener('click', goBack);
form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();
    let isConditionChecked = conditionCheckBox.checked;
    let name = nameInp.value;
    let email = emailInp.value;
    let phone = phoneInp.value;
    let description = descriptionInp.value;

    if (!isConditionChecked) return;
    if (!name || !email || !description) return;

    // use this data for the form submission - for data structure see the formatData function
    let finalData = formatData(name, email, phone, description);

    console.log(finalData);
}

function formatData(name, email, phone, description) {
    let dataKey = Object.keys(data);
    // this is how the data is being set
    let finalData = {
        name,
        email,
        phone,
        description,
        data: {
            type: [],
            scope: [],
            date: [],
        },
    };
    Object.values(data).forEach((d, index) => {
        Object.values(data[dataKey[index]]).forEach((v) => {
            finalData.data[dataKey[index]] = [
                ...finalData.data[dataKey[index]],
                v,
            ];
        });
    });

    return finalData;
}
