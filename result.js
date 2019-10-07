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
            $(".web_section").html(`<div style="padding:10px 20px">
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
                    ${d.goodsname ? '' : '<h3 class="am-text-center">无此产品,请检查关键词重试</h3>'}
                                <div class="am-g" ${d.goodsname ? '' : 'style="display:none !important"'}>
                                    <div class="am-u-sm-12 am-fr">
                                        <div class="info-line am-fr">
                                            <div>
                                                <label class="am-text-right" for="">CAS&nbsp;<span>:</span>
                                                </label>
                                                <span id="pdtCas">
                                                ${d.goodscas}
                                                </span>
                                            </div>
                                            <div>
                                                <label class="am-text-right" for="">MDL&nbsp;<span>:</span></label>
                                                <span id="pdtMdl">
                                                ${d.mdl}
                                                </span>
                                            </div>
                                            <div>
                                                <label class="am-text-right" for="">分子式&nbsp;<span>:</span></label>
                                                <span id="pdtSumformula">
                                                ${d.sumformula}
                                                </span>
                                            </div>
                                            <div>
                                                <label class="am-text-right" for="">分子量&nbsp;<span>:</span></label>
                                                <span id="pdtMulecularWeight">
                                                ${d.mulecularWeight}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="am-fr">
                                            <a id="img_open" title="查看大图" href="http://hopschem.com/assets/${d.showimg}"
                                                style="display:block">
                                                <img id="showimg" src="http://hopschem.com/assets/${d.showimg}" alt="">
                                            </a>
                                        </div>
                                    </div>
                                </div>
                    </div>
                    <div class="list-detail">
                    </div>
                </div>
            </div>`)

            if (!d.gys) return
            if (d.gys == '{}') return
            let gys = JSON.parse(d.gys)
            console.log(gys);

            const gysHTML = gys.gys_list.map(el => {
                const head = `<div class="line-title">
                <div class="line-title result_tab">
                        <div class="result_tab_name">
                                货号 ${el.no}
                            <span>-</span>
                        </div>
                    </div>
                    </div>
                    <div class="detail-list">
                        <div class="am-g">
                            <div class="am-u-sm-10 detail-list-left">
                                <table class="am-table">
                                    <thead>
                                        <tr>
                                <th width="25%">包装</th>
                                <th width="20%">单价</th>
                                <th width="20%">预计发货时间</th>
                                <th width="15%">含量</th>
                            </tr>
                        </thead>
                        <tbody>`
                        const body = el.bz.map(el=>{
                            return `<tr>
                            <td>
                            ${el.bz}
                            </td>
                            <td class="line-price-hook">
                            ${el.jiage}
                            </td>
                            <td>
                            ${el.shijian}
                            </td>
                            <td>
                            ${el.hanliang}
                            </td>
                        </tr>`
                        }).join('')
                        const foot = `</tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="detail-list-blank"></div>`
                return head + body +foot
            }).join('')

            $('.list-detail').html(gysHTML)

            $('#img_open').imageLightbox()

            $(document).on("click", ".line-title", function () {
                var list = $(this).next('.detail-list')
                if (list.is(':visible')) {
                    $(this).next('.detail-list').slideUp()
                    $(this).find('span').text(' + ')
                } else {
                    $(this).find('span').text(' - ')
        
                    list.slideDown()
                }
            })

        })
    })
})