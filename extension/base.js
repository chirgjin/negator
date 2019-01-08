class BASE {
    sendRequest(content) {
        let _this = this;
        return new Promise (function (resolve, reject) {
            const xhr =
             new XMLHttpRequest();
            xhr.open("POST", "https://negator1.herokuapp.com/api", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
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
    
            xhr.timeout = 30000
            xhr.ontimeout = function () {
<<<<<<< Updated upstream
                return _this.sendRequest(content).then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
=======
                xhr.send(JSON.stringify({
                    content: content
                }));
>>>>>>> Stashed changes
            }
    
            xhr.send(JSON.stringify({
                content : content
            }));
        });
    }
    
    handleResponse(response) {
        console.log(response);
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
        css.innerHTML = `._2iwq._6b5s._2x3w {animation: __nodeInserted 0.001s !important; -o-animation: __nodeInserted 0.001s !important; -ms-animation: __nodeInserted 0.001s !important; -moz-animation: __nodeInserted 0.001s !important; -webkit-animation: __nodeInserted 0.001s !important;}
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
                
                return this.handleResponse( JSON.parse( data ) );
            });
        });
    }

    wait(ms=100) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }
}
