const {
    ipcRenderer
} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    ejs.delimiter = '$';
    ipcRenderer.on('resultInfo', (e, result) => {
        $(function () {
            console.log(result);
            if (!result || !result.rows) return
            const d = result.rows[0] || {}
            // window.data = item
            // const content = document.getElementById('content').innerHTML;
            // console.log(content);
            // let html = ejs.render(content, data);
            $(".web_section").html(`<div class="container">
                <div class="result-list">
                    <div class="title result_tab">
                        <div class="result_tab_name">
                            查询结果 : ${d.goodsname ?d.goodsname : '无'}
                        </div>
                        <span style="display:none" id="pdtName">
                                ${d.goodsname ?d.goodsname : '无'}
                        </span>
                    </div>
                    <div class="info">
                    ${d.goodsname ?d.goodsname : '<h3 class="am-text-center">无此产品,请检查关键词重试</h3>'}
                                <div class="am-g" ${d.goodsname ? '' : 'style="diplay:none !important"'}>
                                    <div class="am-u-sm-12 am-fr">
                                        <div class="info-line am-fr">
                                            <div>
                                                <label for="">CAS# <span>:</span>
                                                </label>
                                                <span id="pdtCas">
                                                ${d.goodscas}
                                                </span>
                                            </div>
                                            <div>
                                                <label for="">MDL# <span>:</span></label>
                                                <span id="pdtMdl">
                                                ${d.mdl}
                                                </span>
                                            </div>
                                            <div>
                                                <label for="">分子式 <span>:</span></label>
                                                <span id="pdtSumformula">
                                                ${d.sumformula}
                                                </span>
                                            </div>
                                            <div>
                                                <label for="">分子量 <span>:</span></label>
                                                <span id="pdtMulecularWeight">
                                                ${d.mulecularWeight}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="am-fr">
                                            <a id="img_open" title="查看大图" href="http://hopschem.com/${d.showimg}"
                                                style="display:block">
                                                <img id="showimg" src="http://hopschem.com/${d.showimg}" alt="">
                                            </a>
                                        </div>
                                    </div>
                                </div>
                    </div>
                    <div class="list-detail">
                    </div>
                </div>
            </div>`)

            // if(!item) return
            // var json = item.gys
            // if (json) json = JSON.parse(json)
            // else return
            // window.data = json
            // const temp = document.getElementById('temp').innerHTML;
            // html = ejs.render(temp, data);
            // $(".list-detail").html(html)

            // $('#img_open').imageLightbox()
        })
    })
})