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

});