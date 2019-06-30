const {
    ipcRenderer
} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    ejs.delimiter = '$';
    ipcRenderer.on('resultInfo',(e,result)=>{
            $(function () {
                const item = result.rows[0]
                window.data = item
                const content = document.getElementById('content').innerHTML;
                console.log(content);
                let html = ejs.render(content, data);
                $(".web_section").html(html)
                
                if(!item) return
                var json = item.gys
                if (json) json = JSON.parse(json)
                else return
                window.data = json
                const temp = document.getElementById('temp').innerHTML;
                html = ejs.render(temp, data);
                $(".list-detail").html(html)

                $('#img_open').imageLightbox()
            })
    })
})



