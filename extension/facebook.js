class Facebook extends BASE {

    loadPostData(post) {
        if(post.data("negator_id")) {
            return '';
        }


        let id = this.getId('p');
        let text = `<post id='${id}' ><content>${post.find('[data-ad-preview="message"]').text().trim()}</content>`;

        post.find("[aria-label='Comment']").each((i,el) => {
            el = $(el);

            if(el.data("negator_id")) {
                return ;
            }
            let id = this.getId('c');
            text += `<comment id='${id}' >${el.text().trim()}</comment>`;

            el.attr("data-negator_id", id);
        });

        post.attr("data-negator_id", id);

        text += `</post>`;

        return text;
    }

    getContent() {
        //let $ = this.$ || jQuery;

        let cont = 'I will kill you';

        $("[role='article']").each((i,el) => {
            el = $(el);

            if(el.css("display") != 'none' && el.attr("aria-label") != 'Comment') {
                cont += this.loadPostData(el);
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

        console.log(response);

        response.abuse.forEach(abuse => {
            console.log(response.getId(abuse.text))
        });
    }

};
