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
                return _this.sendRequest(content).then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
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
    }

    get content() {
        let cont = this.getContent();

        return cont.replace(/[^\x00-\x7F]/g, "");
    }

    checkLocation() {
        clearTimeout(this.checkTimer);

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
        
        return this.isReady().then(() => {
            return this.sendRequest(this.content).then(data => {
                this.checkLocation();
                
                return this.handleResponse( JSON.parse( data ) );
            });
        });
    }
}