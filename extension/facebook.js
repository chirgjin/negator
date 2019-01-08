class Facebook extends BASE {

    loadPostData(post) {
        if(post.data("negator_id")) {
            return '';
        }


        let id = this.getId('p');
        let text = `<post id='${id}' >\n<content>\n${post.find('[data-ad-preview="message"]').text().trim()}\n</content>\n`;

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
        
        $("[role='article']").each((i,el) => {
            el = $(el);

            if(cont.trim().length < 50 && el.css("display") != 'none' && el.attr("aria-label") != 'Comment') {
                cont += this.loadPostData(el) || '';
                if(cont.trim().length < 50) {
                    this.sendNextBatch = 1;
                }
            }
        });

        return cont;
    }

    async isReady() {
        
        if(!$("._2iwq._6b5s").hasClass("_2x3w")) {
            await this.wait(250);
            
            return await this.isReady();
        }

        console.log("Ready Now");

        return 1;
    }

    handleResponse(response) {

        response.abuse.forEach(abuse => {
            console.log(response.getId(abuse.text))
        });
    }

};
