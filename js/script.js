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

	new Card('.menu__field .container', "img/tabs/vegy.jpg", "vegy", 'Меню "Фитнес"', '229', 'грн/день', '>Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 'menu__item').render();

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'Данные в процессе отправки',
		success: 'Отправка прошла успешно. С вами скоро свяжутся',
		failure: 'Ошибка отправки. Попробуйте позже'
	};

	forms.forEach(form => postData(form));

	function postData(form) {
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

			const xhr = new XMLHttpRequest();
			xhr.open('POST', 'server.php');

			const formData = new FormData(form);
			xhr.send(formData);

			xhr.addEventListener('load', () => {
				statusMessage.remove();
				if (xhr.status === 200) {
					showModalAfterRequest(message.success);
				} else {
					showModalAfterRequest(message.failure);
				}
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
});