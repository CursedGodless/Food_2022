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

	fetch('http://localhost:3000/requests/1')
		.then(response => response.json())
		.then(data => console.log(data));


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

	nextArrow.addEventListener('click', () => {
		currentSlideIndex++;
		offset = currentSlideIndex * width.slice(0, -2);
		if (currentSlideIndex > slides.length - 1) {
			currentSlideIndex = 0;
			offset = 0;
		}

		sliderInner.style.transform = `translateX(-${offset}px)`;
		updateSlideIndex(currentSlideIndex);
	});

	prevArrow.addEventListener('click', () => {
		currentSlideIndex--;
		offset = currentSlideIndex * width.slice(0, -2);

		if (currentSlideIndex < 0) {
			currentSlideIndex = slides.length - 1;
			offset = currentSlideIndex * width.slice(0, -2);

		}
		
		sliderInner.style.transform = `translateX(-${offset}px)`;
		updateSlideIndex(currentSlideIndex);
	});

});