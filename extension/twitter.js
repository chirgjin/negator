class Twitter extends BASE {

    loadPostData(post) {
        if(post.data("checked")) {
            return ;
        }

        let id = this.getId('p');
        let text = `<post id='${id}' ><content>${post.find('[data-ad-preview="message"]').text()}</content>`;

        post.find("[aria-label='Comment']").each((i,el) => {
            
            if(el.hasBeenChecked) {
                return ;
            }
            let id = this.getId('c');
            text += `<comment id='${id}' >${el.textContent}</comment>`;

            el.setAttribute("data-negator_id", id);
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
        
        console.log(cont);

        return cont;
    }

    async isReady() {
        
        if(!$("._2iwq._6b5s").hasClass("_2x3w")) {
            console.log($("._2iwq._6b5s"))
            await this.wait(250);
            
            return await this.isReady();
        }

        console.log("Ready Now");

        return 1;
    }

    handleResponse(response) {

    }

};
