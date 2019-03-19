class Facebook extends BASE {

    loadPostData(post) {
        if(post.data("negator_id")) {
            console.log(post);
            return '';
        }


        let id = this.getId('p');
        let text = `<post id='${id}' >\n<content>\n${post.find('.userContent').text().trim()}\n</content>\n`;

        post.find("[aria-label='Comment']").each((i,el) => {
            el = $(el);

            if(el.data("negator_id")) {
                return ;
            }
            let id = this.getId('c');
            text += `<comment id='${id}' >\n${el.text().trim()}\n</comment>\n`;

            el.attr("data-negator_id", id);
        });

        post.attr("data-negator_id", id);

        text += `</post>\n`;

        return text;
    }

    getContent() {
        //let $ = this.$ || jQuery;

        let cont = '';
        let len = 500;
        
        $("[role='article']").each((i,el) => {
            el = $(el);

            if(cont.trim().length < len && el.css("display") != 'none' && el.attr("aria-label") != 'Comment') {
                cont += this.loadPostData(el) || '';
                if(cont.trim().length >= len) {
                    this.sendNextBatch = 1;
                }
            }
        });

        

        return cont.trim();
    }

    async isReady() {
        
        if(!$("._2iwq._6b5s").hasClass("_2x3w") && !$(".uiSimpleScrollingLoadingIndicator").get(0)) {
            await this.wait(250);
            
            return await this.isReady();
        }

        console.log("Ready Now");

        return 1;
    }


    handleHiding(ids, response) {
        
        Object.keys(ids).forEach(key => {
            let data = ids[key];

            let div = $("[data-negator_id='" + key + "']");

            if(data.type == 'post') {
                div = div.find('.userContent');
            }
            else if(data.type == 'comment') {
                div = div.find("[data-testid]").find("span").find("span");
            }

            this.hideStuff(div, data);
        });
    }

    hideStuff(div, data) {

        if(data.percen >= this.hidePercen && div.text().length > 470 && data.type == 'post') {
            div.addClass("negator main-content");
            
            let htm = `<div class="intense">
            <div class="content">
                <div class="grid">
                    <img src="https://i.imgur.com/9j3jveC.png">
                    <p>This posts may contain intense hate or violent statements which may hurt your feelings. </p>
                    <ul class="list-abuse">`;

            (data.reasons || ["misconduct"]).forEach((reason) => {
                htm += `<li>${reason}</li>`;
            });

            htm += `</ul>
			</div>
			<button data-for='view-post' >View Post Anyway</button>
		</div>	
	</div>

    <img src="https://i.imgur.com/UCDofmG.png" class="hide-post hidden" data-for='hide-post' >`;
    
            div.prepend(htm);

            div.find("[data-for='view-post']").click(e => {
                div.find(".intense").addClass("hidden");
                div.find(".hide-post").removeClass("hidden");
            }).removeAttr("data-for");

            div.find("[data-for='hide-post']").click(e => {
                div.find(".intense").removeClass("hidden");
                div.find(".hide-post").addClass("hidden");
            });
            
        }
        else if(data.abuses.length > 0){
            let h = div.html() || '';
            data.abuses.forEach( (abuse,i) => {
                console.log(abuse);

                h = h.replace(abuse.text, `<a href='#' class='mild' >%${i}%<span class='tooltiptext' >${abuse.type}</span></a>`);
            });

            if(data.abuses.length > 0) {
                data.abuses.forEach( (abuse,i) => {
                    h = h.replace(`%${i}%`, abuse.text);
                });

                div.html(h);
                div.addClass('negator');
                div.find(".mild").click(e => {
                    
                })
            }

        }
        //else if(data.percen >= this.hidePercen) {
        else {

            let d = $(document.createElement('div')).addClass('mild').html(`<span class='tooltiptext' >${ (data.reasons && data.reasons.length > 1 ? data.reasons : ['misconduct']).join(',')}</span>`);

            d.append(div.html());

            div.html(d).addClass('negator');

            d.click(function (e) {
                console.log(e);
                $(this).css("color", $(this).css("color") != 'rgb(255, 255, 255)' ? "white" : '');
                e.originalEvent.changedColor = 1;
            });

            console.log(d, div);
        }
    }

    constructor() {
        super();

        $("body").on("click", ".mild", function (e) { 
            if(e && e.originalEvent && e.originalEvent.changedColor) {
                return ;
            }

            $(this).css("color", $(this).css("color") != 'rgb(255, 255, 255)' ? "white" : '');
        })
    }
};
