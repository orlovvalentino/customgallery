window.mediaCheck = function(options) {
	var mql;
	function mqChange(mq, options) {
		if (mq.matches) {
			if (typeof options.entry === "function") {
				options.entry();
			}
		} else if (typeof options.exit === "function") {
			options.exit();
		}
	}
	mql = window.matchMedia(options.media);
	mql.addEventListener( "change", (e) => {
		mqChange(mql, options);
	})
	mqChange(mql, options);
}


$.widget('shiekh.gallery', {
	options: {
		currentIndex:0,
		sellectors: {
			linkImages: '.js-gallery-image',
			fullGalleryContainer: '.js-product-zoom',
		},
		observerImg : new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					let currentIndex = entry.target.closest('.js-zoom-link').dataset.index;
					document.querySelector('#count').textContent = `${currentIndex}/${document.querySelectorAll('.js-zoom-link').length}`;
					$('.js-product-zoom a').removeClass('active');
					entry.target.closest('a').classList.add('active');
				}
			});
		}, {rootMargin: '-45% 0px -55%'})
	},

	/**
	 * Creates widget 'shiekh.gallery'
	 * @private
	 */
	_create: function () {
		this.images = $(this.options.sellectors.linkImages);
	},

	/**
	 * Initial slider
	 * @private
	 */
	_init: function () {
		mediaCheck({
			media: '(max-width: 768px)',
			entry:  () => {
				this._initCarousel();
			},
			exit: () => {
				this._initHandlers();
			}
		});
	},

	_initHandlers:function(){
		const self = this;
		if($('.owl-carousel').length==1){
			$('[data-sh-main]').removeClass('owl-carousel').owlCarousel('destroy');
		}
		$(this.images).on('click', function(ev)  {
			ev.preventDefault();
			self.options.currentIndex = $(this).data('index');
			self._openFullGallery(self.options.currentIndex);
		});
	},

	_openFullGallery:function(index){
		$(this.options.sellectors.fullGalleryContainer).show();
		$('.product__zoom [data-index="' + index + '"]')[0].scrollIntoView();
		$(window).on('keydown.fullgallery', this._keydownHandler.bind(this));
		$('.js-closeModal').on('click',  ()=> {
			this._closeFullGallery()
		});
		this.observeFullGallery();
		document.querySelectorAll('.js-zoom-link').forEach((item)=>{MagicZoom.start(item)})
		if (!this.magicZoominit) {
			this.magicZoominit = 1;
		}
	},
	_closeFullGallery: function(){
		$('.js-product-zoom').hide();
		document.querySelector('.js-gallery-image[data-index="1"]').scrollIntoView();
		this.unObserveFullGallery()
	},


	_keydownHandler:function(){
		if (event.keyCode === 27) {
			this._closeFullGallery();
			$(window).off('keydown.fullgallery');
		}
	},
	observeFullGallery:function(){
		document.querySelectorAll('.js-product-zoom img').forEach(img => {
			this.options.observerImg.observe(img)
		});
	},
	unObserveFullGallery:function() {
		document.querySelectorAll('.js-product-zoom img').forEach(img => {
			this.options.observerImg.unobserve(img)
		});
	},

	/**
	 * Init main slider
	 * @param {jQuery} slider
	 * @private
	 */
	_initCarousel: function () {
				$(this.images).off('click');
				if (this.magicZoominit) {
					document.querySelectorAll('.js-zoom-link').forEach((item)=>{MagicZoom.stop(item)});
					this.magicZoominit = 0;
				}

				$('[data-sh-main]').addClass('owl-carousel').owlCarousel({
					items: 1,
					slideSpeed: 2000,
					nav: false,
					autoplay: false,
					dots: true,
					loop: false,
					lazyLoadEager: 6,
					lazyLoad: true
				});
	}
});
$('.product-gallery').gallery();
