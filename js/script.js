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

});