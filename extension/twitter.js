class Twitter extends BASE {

    constructor () {
        super();
        setTimeout(() => {
            this.sendContentRequest();
        }, 2500);
    }

    getContent() {
        //let $ = this.$ || jQuery;

        let cont = 'I will kill you';

        $("p.TweetTextSize.js-tweet-text.tweet-text").each((i,el) => {
            el = $(el);
            if (!el.data('negator_id')) {
                cont += el.text().trim();

                el.attr('data-negator_id', this.getId('p'));
            }
        });
        
        console.log(cont);

        return cont;
    }

    async isReady () {
        return 1;
    }

    handleHiding (ids) {
        console.log(ids);
    }
};
