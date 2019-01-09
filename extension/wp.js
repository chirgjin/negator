	class WP extends BASE {
		getContent() {
			let cont = '';

			$(".entry-content,.postComplete").each((i,el) => {
				el = $(el);
				if(el.data("negator_id")) {
					return ;
				}

				el.find('script[type="application/ld+json"]').remove();
				
				let id = this.getId();
				cont += `<post id='${id}' >${el.text().trim()}</post>`;
				el.attr("data-negator_id", id);
			});

			
			return cont.length > 5000 ? cont.substr(0,5000) : cont;
		}

		async isReady() {

			return 1;
		}

		handleHiding(ids, response) {
			Object.keys(ids).forEach(key => {
	            let data = ids[key];

	            let div = $("[data-negator_id='" + key + "']");

				console.log(data);
				
				data.abuses.forEach( (abuse,i) => {
					let el = div.find(`:contains("${abuse.text}")`);
					if(!el.get(0)) {
						el = div;
					}
					else if(el.length > 1) {
						el = $(el.get(el.length - 1));
					}

					el.html(
						el.html().replace(abuse.text, `<span class='mild' data-negator_id='abuse:${i}' >%abuse:${i}%<span class='tooltiptext' >${abuse.type || 'unknown'}</span></span>`)
					);
					
					el.parent().addClass("negator");
					
					abuse.el = () => {
						return div.find(`[data-negator_id='abuse:${i}']`);
					};

				});

				data.sentiments.forEach( (sentiment,i) => {

					if(sentiment.polarity != 'negative') {
						return ;
					}

					let el = div.find(`:contains("${sentiment.text}")`);
					if(!el.get(0)) {
						el = div;
					}
					else if(el.length > 1) {
						el = $(el.get(el.length - 1));
					}

					el.html(
						el.html().replace(sentiment.text, `<a class='negator-abuse' data-negator_id='sentiment:${i}' >%sentiment:${i}%</a>`)
					);
					
					sentiment.el = () => {
						return div.find(`[data-negator_id='sentiment:${i}']`);
					};
				})

				data.abuses.forEach( (abuse,i) => {
					
					abuse.el().html(
						abuse.el().html().replace(`%abuse:${i}%`, abuse.text)
					);

				});

				data.sentiments.forEach( (sentiment,i) => {
					if(!sentiment.el) {
						return ;
					}

					sentiment.el().html(
						(sentiment.el().html() || '').replace(`%sentiment:${i}%`, sentiment.text)
					);

				});

				div.find(".mild").click(function (e) {
                    $(div).find(".mild").css("color", $(this).css("color") != 'rgb(255, 255, 255)' ? "white" : '');
				});
				
				div.find(".negator-abuse").click(function (e) {
					div.find(".negator-abuse").toggleClass("negator-viewable");
				});

	        });
		}

		constructor() {
			super();

			this.sendContentRequest();
		}
	}