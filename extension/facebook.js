let getId = (() => {
    let ids = [];

    return () => {
        let id = Math.floor(Math.random() * 10000000);

        return ids.indexOf(id) == -1 ? id : getId();
    };
})();

function loadPostData(post) {
    if(post.data("checked")) {
        return ;
    }

    
    let id = getId();
    let text = `<post id='${id}' ><content>${post.find('[data-ad-preview="message"]').text()}</content>`;

    post.find("[aria-label")
}