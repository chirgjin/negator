class SteamCommunity extends BASE {

    // loadPostData(post) {
    //     if(post.data("negator_id")) {
    //         return '';
    //     }


    //     let id = this.getId('p');
    //     let text = `<post id='${id}' >\n<content>\n${post.find('.userContent').text().trim()}\n</content>\n`;

    //     post.find("[aria-label='Comment']").each((i,el) => {
    //         el = $(el);

    //         if(el.data("negator_id")) {
    //             return ;
    //         }
    //         let id = this.getId('c');
    //         text += `<comment id='${id}' >\n${el.text().trim()}\n</comment>\n`;

    //         el.attr("data-negator_id", id);
    //     });

    //     post.attr("data-negator_id", id);

    //     text += `</post>\n`;

    //     return text;
    // }

    getContent() {
        //let $ = this.$ || jQuery;

        let cont = '';
        let len = 1500;
        
        // $("[role='article']").each((i,el) => {
        //     el = $(el);

        //     if(cont.trim().length < len && el.css("display") != 'none' && el.attr("aria-label") != 'Comment') {
        //         cont += this.loadPostData(el) || '';
        //         if(cont.trim().length >= len) {
        //             this.sendNextBatch = 1;
        //         }
        //     }
        // });

        $(".forum_op .content, #news .body, .commentthread_comment_text, .grouppage_header_name").each( (i, el) => {

            el = $(el)

            console.log(el);

            if(el.data("negator_id")) {
                return ;
            }

            if(cont.trim().length < len && el.css("display") != 'none') {
                let id = this.getId('p');
    
                el.attr("data-negator_id", id)

                cont += `<element id='${id}' >${el.text().trim()}</element>`
                if(cont.trim().length >= len) {
                    this.sendNextBatch = 1;
                }
            }
        })

        console.log("Loading Content")
        

        return cont.trim();
    }

    async isReady() {

        console.log("Ready now...")
        return 1;
    }


    handleHiding(ids, response) {
        
        Object.keys(ids).forEach(key => {
            let data = ids[key];

            let div = $("[data-negator_id='" + key + "']");

            this.hideStuff(div, data);
        });
    }

    

    constructor() {
        super();

        console.log("Initialized")

        window.addEventListener("load", () => {
            this.sendContentRequest()
        })
    }
};
