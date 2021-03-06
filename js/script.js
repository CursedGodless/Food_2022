document.addEventListener('DOMContentLoaded', () => {

	// Табы
	const tabsContent = document.querySelectorAll('.tabcontent'),
		tabParent = document.querySelector('.tabheader__items'),
		tabs = document.querySelectorAll('.tabheader__item');

	tabsContent.forEach(item => item.classList.add('fade'))

	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show');
		});

		tabs.forEach(item => item.classList.remove('tabheader__item_active'));
	}

	hideTabContent()

	function showTabContent(i) {
		tabsContent[i].classList.remove('hide');
		tabsContent[i].classList.add('show');

		tabs[i].classList.add('tabheader__item_active');
	}

	showTabContent(0);

	tabParent.addEventListener('click', (e) => {
		const target = e.target;
		if (target && target.matches('.tabheader__item')) {
			hideTabContent();

			tabs.forEach((item, i) => {
				target === item ? showTabContent(i) : '';
			});
		}
	});


	// Таймер

	const deadline = '2022-07-15';

	function getTimeRemaining() {
		const time = new Date(deadline) - new Date(),
			days = Math.floor(time / (1000 * 60 * 60 * 24)),
			hours = Math.floor((time / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((time / (1000 * 60)) % 60),
			seconds = Math.floor((time / 1000) % 60);

		return {
			time, days, hours, minutes, seconds
		};
	}


	setTimer('.timer');

	function setZero(num) {
		return num < 10 ? `0${num}` : num;
	}

	function setTimer(selector) {
		const timer = document.querySelector(selector),
			timerDays = timer.querySelector('#days'),
			timerHours = timer.querySelector('#hours'),
			timerMinutes = timer.querySelector('#minutes'),
			timerSeconds = timer.querySelector('#seconds'),
			timerId = setInterval(updateTimer, 1000);

		updateTimer();

		function updateTimer() {
			const { time, days, hours, minutes, seconds } = getTimeRemaining();
			timerDays.textContent = setZero(days);
			timerHours.textContent = setZero(hours);
			timerMinutes.textContent = setZero(minutes);
			timerSeconds.textContent = setZero(seconds);

			if (time <= 0) {
				clearInterval(timerId);
				timerDays.textContent = '00';
				timerHours.textContent = '00';
				timerMinutes.textContent = '00';
				timerSeconds.textContent = '00';
			}
		}

	}

	// Модалка


	const modal = document.querySelector('.modal'),
		modalBtns = document.querySelectorAll('[data-modal]');

	modalBtns.forEach(item => {
		item.addEventListener('click', () => {
			openModal();
		});
	});

	function openModal() {
		document.body.style.overflow = 'hidden';
		modal.classList.add('show');
		modal.classList.remove('hide');
		clearTimeout(modalTimerId);
	}

	function closeModal() {
		document.body.style.overflow = '';
		modal.classList.add('hide');
		modal.classList.remove('show');
	}

	modal.addEventListener('click', (e) => {
		const target = e.target;
		if (target && target.matches('.modal__close') || target && target.matches('.modal')) closeModal();
	});

	document.addEventListener('keydown', (e) => {
		const code = e.code;
		if (modal.classList.contains('show') && code === 'Escape') closeModal();
	});

	function openByBottom() {
		if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
			openModal();
			window.removeEventListener('scroll', openByBottom);
		}
	}

	window.addEventListener('scroll', openByBottom);

	const modalTimerId = setTimeout(openModal, 50000);


	// Карточки

	const getData = async (url) => {
		const request = await fetch(url);
		if (request.ok) {
			return request;
		} else {
			throw new Error(`Could not fetch, url: ${request.url}, status: ${request.status}`);
		}
	};

	const postData = async (url, header, data) => {
		return await fetch(url, {
			method: 'POST',
			headers: header,
			body: data
		});
	};

	class Card {
		constructor(parent, imgSrc, alt, subtitle, price, currency, descr, ...classes) {
			this.parent = parent;
			this.classes = classes.length === 0 ? ['menu__item'] : classes;
			this.imgSrc = imgSrc;
			this.alt = alt;
			this.subtitle = subtitle;
			this.price = price;
			this.currency = currency;
			this.descr = descr;
		}

		render() {
			const card = document.createElement('div');
			this.classes.forEach(item => card.classList.add(item));

			card.innerHTML = `
					<img src=${this.imgSrc} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.subtitle}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
							<div class="menu__item-cost">Цена:</div>
							<div class="menu__item-total"><span>${this.price}</span> ${this.currency}</div>
					</div>
			`;

			document.querySelector(this.parent).insertAdjacentElement('beforeend', card);
		}
	}

	getData('http://localhost:3000/menu')
		.then(response => response.json())
		.then(data => {
			data.forEach(({ img, altimg, title, descr, price }) => {
				new Card('.menu__field .container', img, altimg, title, price, 'грн/день', descr, 'menu__item').render();
			})
		});

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'Данные в процессе отправки',
		success: 'Отправка прошла успешно. С вами скоро свяжутся',
		failure: 'Ошибка отправки. Попробуйте позже'
	};

	forms.forEach(form => bindPostData(form));



	function bindPostData(form) {
		const statusMessage = document.createElement('img');
		statusMessage.src = 'icons/spinner.svg';
		statusMessage.style.cssText = `
		display:block;
		margin: 0 auto;
		margin-top: 15px;
		`;

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);
			const formDataObj = Object.fromEntries(formData.entries());

			postData('http://localhost:3000/requests', { 'Content-type': 'application/json' }, JSON.stringify(formDataObj))
				.then(response => {
					console.log(response.status);
					return response.json();
				})
				.then(response => {
					console.log(response);
					statusMessage.remove();
					showModalAfterRequest(message.success);
				})
				.catch(() => {
					showModalAfterRequest(message.failure);
				})
				.finally(() => {
					setTimeout(() => {
						form.reset();
						closeModal();
					}, 1500);
				});
		});

	}

	function showModalAfterRequest(modalText) {
		const previousModal = document.querySelector('.modal__content');

		previousModal.classList.add('hide');
		openModal();

		const requestModal = document.createElement('div');
		requestModal.classList.add('modal__content', 'show');
		requestModal.innerHTML = `
			<div class="modal__close">&times;</div>
			<div class="modal__title">${modalText}</div>
		`;
		document.querySelector('.modal .modal__dialog').append(requestModal);

		setTimeout(() => {
			closeModal();
			requestModal.remove();
			previousModal.classList.remove('hide');
		}, 1500);
	}

	// Слайдер

	const slider = document.querySelector('.offer__slider'),
		slides = slider.querySelectorAll('.offer__slide'),
		prevArrow = slider.querySelector('.offer__slider-prev'),
		nextArrow = slider.querySelector('.offer__slider-next'),
		totalSlides = slider.querySelector('#total'),
		currentSlide = slider.querySelector('#current'),
		sliderWrapper = slider.querySelector('.offer__slider-wrapper'),
		sliderInner = slider.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(sliderWrapper).width;



	sliderInner.style.cssText = `
		width: ${100 * slides.length + '%'};
		display: flex;
		transition: .5s all;
		`;

	sliderWrapper.style.overflow = 'hidden';
	slides.forEach(slide => slide.style.width = width);

	let currentSlideIndex = 0,
		offset = 0;

	totalSlides.textContent = setZero(slides.length);
	const updateSlideIndex = (index) => {
		currentSlide.textContent = setZero(index + 1);
	};

	updateSlideIndex(currentSlideIndex);

	function changeSlide() {
		offset = currentSlideIndex * width.replace(/\D/g, '');
		if (currentSlideIndex > slides.length - 1) {
			currentSlideIndex = 0;
			offset = 0;
		}
		if (currentSlideIndex < 0) {
			currentSlideIndex = slides.length - 1;
			offset = currentSlideIndex * width.replace(/\D/g, '');
		}
		changeActiveDot();
		sliderInner.style.transform = `translateX(-${offset}px)`;
		updateSlideIndex(currentSlideIndex);
	}

	nextArrow.addEventListener('click', () => {
		currentSlideIndex++;
		changeSlide();
	});

	prevArrow.addEventListener('click', () => {
		currentSlideIndex--;
		changeSlide();
	});

	const dotsWrapper = document.createElement('ul');
	dotsWrapper.style.cssText = `
		position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
	`;

	function createDot(index) {
		const dot = document.createElement('li');
		dot.classList.add('dot');
		dot.setAttribute('data-slide-index', index);
		dot.style.cssText = `
			box-sizing: content-box;
			flex: 0 1 auto;
			width: 30px;
			height: 6px;
			margin-right: 3px;
			margin-left: 3px;
			cursor: pointer;
			background-color: #fff;
			background-clip: padding-box;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
			opacity: .5;
			transition: opacity .6s ease;
		`;

		dotsWrapper.append(dot);
	}


	function changeActiveDot() {
		const dots = dotsWrapper.querySelectorAll('.dot');
		dots.forEach(dot => {
			if (dot === dots[currentSlideIndex]) {
				dot.style.opacity = '1';
			} else {
				dot.style.opacity = '.5';
			}
		});
	}

	dotsWrapper.addEventListener('click', (e) => {
		const target = e.target;
		if (target && target.matches('.dot')) {
			currentSlideIndex = +target.getAttribute('data-slide-index');
			changeSlide();
		}
	});

	slider.append(dotsWrapper);
	slider.style.position = 'relative';
	slides.forEach((item, index) => {
		createDot(index);
	});
	changeActiveDot();

	// Калькулятор

	const result = document.querySelector('.calculating__result span');
	let sex = 'female', height, weight, age, activity = '1.375';

	function calcResult() {
		if (!sex || !height || !weight || !age || !activity) {
			result.textContent = '___';
			return;
		}
		if (sex === 'female') {
			result.textContent = ((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * activity).toFixed();
		} else {
			result.textContent = ((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * activity).toFixed();
		}
	}

	calcResult();

	function getStaticInfo(parentSelector, activeClass) {
		const elements = document.querySelectorAll(`${parentSelector} div`);

		document.querySelector(parentSelector).addEventListener('click', (e) => {

			const target = e.target;
			if (target && target.matches(`${parentSelector} .calculating__choose-item`)) {
				elements.forEach(item => {
					item.classList.remove(activeClass);
				});

				target.classList.add(activeClass);
				if (target.getAttribute('data-activity-level')) {
					activity = target.getAttribute('data-activity-level');
				} else {
					sex = target.id;
				}

			}
			calcResult();
		});
	}
	getStaticInfo('#gender', 'calculating__choose-item_active');
	getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

	function getDynamicInfo(parentSelector) {
		document.querySelectorAll(`${parentSelector} input`).forEach(item => {
			item.addEventListener('input', () => {
				item.value = item.value.replace(/\D/g, '');
				switch (item.getAttribute('id')) {
					case 'height':
						height = item.value;
						break;
					case 'weight':
						weight = item.value;
						break;
					case 'age':
						age = item.value;
						break;
					default:
						break;
				}
				calcResult();
			});
		});
	}
	getDynamicInfo('.calculating__choose_medium');
});