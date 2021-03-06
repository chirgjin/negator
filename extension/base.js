class BASE {
    
    get hidePercen() {
        return this._hidePercen || 60;
    }

    sendRequest(content) {
        let _this = this;
        return new Promise (function (resolve, reject) {

            if(content.trim().length < 1) {
                return reject({
                    status : null,
                    statusText : "Insufficient content"
                });
            }

            const xhr =
             new XMLHttpRequest();
            xhr.open("POST", "https://negator-gg-final.herokuapp.com/api", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("accepts", "*");
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status < 300) {
                        resolve( _this.transformResponse(xhr.response) );
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                }
            }
    
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
    
            xhr.timeout = 30000 * 4
            xhr.ontimeout = function () {
                return _this.sendRequest(content).then(data => {
                    resolve( data );
                }).catch(err => {
                    reject(err);
                });
            }
    
            xhr.send(JSON.stringify({
                content : content
            }));
        });
    }
    
    transformResponse(response) {
        response = typeof response == 'object' ? response : JSON.parse(response);

        response.abuse = response.abuse || [];

        response.getId = (str) => {
            let i = response.text.indexOf(str);

            let m = response.text.substr(0,i+1).match(/(post|comment|element) id='[A-Za-z0-9_]+'/ig);

            if(!m) {
                console.log(str,i,response.text,m);
                return console.log("No id found");
            }

            let ma = m[m.length - 1].match(/(post|comment|element) id='([A-Za-z0-9_]+)'/i);

            return {
                id : ma[2],
                type : ma[1]
            };
        }

        return response;
    }
    
    getId(prefix='') {

        let id = prefix +  Math.floor(Math.random() * 10000000).toString();

        return this.ids.indexOf(id) == -1 ? id : this.getId();
    }

    constructor() {
        this.ids = [];
        this.checkTimeout = 250;

        this.checkLocation();

        let css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = `._2iwq._6b5s._2x3w , .uiSimpleScrollingLoadingIndicator {animation: __nodeInserted 0.001s !important; -o-animation: __nodeInserted 0.001s !important; -ms-animation: __nodeInserted 0.001s !important; -moz-animation: __nodeInserted 0.001s !important; -webkit-animation: __nodeInserted 0.001s !important;}
        @keyframes __nodeInserted {from{outline-color: #111;}to{outline-color: #000;}}
        @-moz-keyframes __nodeInserted {from{outline-color: #111;}to{outline-color: #000;}}
        @-webkit-keyframes __nodeInserted {from{outline-color: #111;}to{outline-color: #000;}}
        @-ms-keyframes __nodeInserted {from{outline-color: #111;}to{outline-color: #000;}}
        @-o-keyframes __nodeInserted {from{outline-color: #111;}to{outline-color: #000;}}`;
        document.body.appendChild(css);

        document.addEventListener('animationstart', (e) => {
            this.insertion_event(e);
        }, false);
        document.addEventListener('MSAnimationStart', (e) => {
            this.insertion_event(e);
        }, false);
        document.addEventListener('webkitAnimationStart', (e) => {
            this.insertion_event(e);
        }, false);

        chrome.storage.local.get(['categories', 'hate_speech_percentage'], data => {
            this._hidePercen = parseInt(data.hate_speech_percentage) || 0;
        });

        
        $("body").on("click", ".mild", function (e) { 
            if(e && e.originalEvent && e.originalEvent.changedColor) {
                return ;
            }

            $(this).css("color", $(this).css("color") != 'rgb(255, 255, 255)' ? "white" : '');
        })
    }

    insertion_event(event) {
        if (event.animationName == '__nodeInserted') {
            return this.sendContentRequest();
        }
    }

    get content() {
        let cont = this.getContent();

        return cont.replace(/[^\x00-\x7F]/g, "");
    }
    
    checkLocation() {
        return ;

        clearTimeout(this.checkTimer);

        console.log("Checking Location");

        if(location.href == this.checkUrl) {
            return (this.checkTimer = setTimeout(() => {
                this.checkLocation();
            }, this.checkTimeout));
        }

        this.checkUrl = location.href;

        this.sendContentRequest();
    }

    handleResponse(response) {

    }

    async isReady() {
        return 1;
    }

    sendContentRequest() {
        console.log("Sending Content Req");

        return this.isReady().then(() => {

            console.log("IsReady");

            return this.sendRequest(this.content).then(data => {
                this.checkLocation();
                
                
                if(this.sendNextBatch) {
                    this.sendNextBatch = 0;
                    this.sendContentRequest();
                }


                return this.handleResponse( data );
            });
        });
    }

    
    handleResponse(response) {
        let ids = {};
        
        const getD = (data) => {
            return {
                type : data.type,
                abuse: 0,
                abuses : [],
                reasons : [],
                sentiments : [],
                negative: 0,
                positive: 0,
            };
        }

        response.abuse.forEach(abuse => {
            let data = response.getId(abuse.text);

            if(!data || !data.id) {
                return ;
            }

            ids[data.id] = ids[data.id] || getD(data);

            ids[data.id].abuses.push(abuse);

            if(ids[data.id].reasons.indexOf(abuse.type) == -1) {
                ids[data.id].reasons.push(abuse.type);
            }

            ids[data.id].negative++;
        });

        (response.sentiment_expressions || []).forEach(sentiment => {
            let data = response.getId(sentiment.text);

            if(!data || !data.id) {
                return ;
            }

            ids[data.id] = ids[data.id] || getD(data);

            ids[data.id][sentiment.polarity]++;

            let reason = (sentiment.reasons||[])[0];

            (sentiment.targets||[]).forEach( t => {
                if(t.match(/wom(e|a)n/i)) {
                    reason = 'women_abuse';
                }
            });

            ids[data.id].sentiments.push(sentiment);

            if(reason && ids[data.id].reasons.indexOf(reason) == -1) {
                ids[data.id].reasons.push(reason);
            }

        });

        // console.log(response);
        // console.log(ids);

        Object.keys(ids).forEach(key => {
            let data = ids[key];

            data.total = data.positive + data.negative;
            data.percen = Math.round(data.negative / data.total * 100);
            data.intense = this.isIntense(data);

            ids[key] = data;
        });


        this.handleHiding(ids,response);
    }

    handleHiding(ids, response) {

    }
    wait(ms=100) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    isIntense(data) {
        return 1 || data.negative >= 1 || data.negative < 1 && data.reasons.length > 0;
    }

    hideStuff(div, data) {

        let fbCheck = 0;

        if(this.isFB) {
            const btn = div.find(`[role="button"]`);
            if(btn.get(0) && btn.get(0).innerHTML.match(/see more/i)) {
                fbCheck = 1;
            }
        }
        
        if(fbCheck || data.percen >= this.hidePercen && div.text().length > 470 && data.type == 'post') {
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
                    e.preventDefault();
                });
            }

        }
        //else if(data.percen >= this.hidePercen) {
        else {

            let d = $(document.createElement('div')).addClass('mild').html(`<span class='tooltiptext' >${ (data.reasons && data.reasons.length > 1 ? data.reasons : ['misconduct']).join(',')}</span>`);

            d.append(div.html());

            div.html(d).addClass('negator');

            d.click(function (e) {
                $(this).css("color", $(this).css("color") != 'rgb(255, 255, 255)' ? "white" : '');
                e.originalEvent.changedColor = 1;
            });
        }
    }
}
