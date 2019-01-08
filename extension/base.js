class BASE {
    sendRequest(content) {
        return new Promise (function (resolve, reject) {
            const xhr =
             new XMLHttpRequest();
            xhr.open("POST", "https://negator.herokuapp.com/api", true);
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
                xhr.send(content);
            }
    
            xhr.send(`content=${encodeURIComponent(content)}`);
        });
    }
    
    handleResponse(response) {
        console.log(response);
    }
    
    getid() {

        return (prefix='') => {
            let id = prefix +  Math.floor(Math.random() * 10000000).toString();

            return this.ids.indexOf(id) == -1 ? id : this.getId();
        };
    }

    constructor($) {
        this.ids = [];
        this.$ = $;
    }
}