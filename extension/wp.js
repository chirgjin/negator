	class WP extends BASE {
		getContent() {
			let cont = '';

			$(".entry-content").each((i,el) => {
				el = $(el);
				if(el.data("negator_id")) {
					return ;
				}
				let id = this.getId();
				cont += `<post id='${id}' >${el.text().trim()}</post>`;
				el.attr("data-negator_id", id);
			});

			return cont;
		}

		async isReady() {

			return 1;
		}

		handleHiding(ids) {
			Object.keys(ids).forEach(key => {
	            let data = ids[key];

	            let div = $("[data-negator_id='" + key + "']");

	            console.log(data);
	        });
		}

		constructor() {
			super();

			this.sendContentRequest();
		}
	}