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

    

    constructor() {
        super();

    }
};
