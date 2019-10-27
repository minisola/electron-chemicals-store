module.exports = (db) => {

    let list = []
    let current = null
    //载入列表
    function loadList(callback) {
        $("#dataTable tbody").html("")
        db.find({
            dataType: 'supplier'
        }).sort({
            createTime: -1
        }).exec((err, ret) => {
            if (ret && ret.length) {
                localStorage.supplier = JSON.stringify(ret)
                list = ret
                let html = ""
                ret.forEach((el, i) => {
                    html += `<tr>
                  <td><b>${el.name}</b></td>
                  <td style="max-width:500px">
                    <div class="ellipsis td-text">
                      <span>
                      ${el.remark}
                      </span>
                    </div>
                  </td>
                  <td width="140">
                    <button data-index="${i}" type="button" class="btn btn-sm btn-outline-primary btn-table-inner btn-table-inner-edit">编辑</button>
                    <button data-index="${i}" type="button" class="btn btn-sm btn-outline-danger btn-table-inner btn-table-inner-del">删除</button>
                  </td>
                </tr>`
                })
                $("#dataTable tbody").html(html)
            }
            callback && callback()
        });
    }
    //新增客戶
    $('#supplierAdd').show().off('click').on('click', function () {
        $("#supplierAddDialog").modal().find('.modal-title').text('新增供应商')
    })
    // 新增保存客户
    $('#supplierSave').off('click').on('click', function () {
        const name = $("#supplierName").val().trim()
        const remark = $("#supplierRemark").val().trim()
        if (!name) {
            return layer.msg("请输入名称")
        }
        if (current) {
            db.update({
                _id: current._id
            }, {
                $set: {
                    name: name,
                    remark: remark
                }
            }, function (err) {
                pipe(err)
            })
            return
        }
        db.insert({
            dataType: "supplier",
            name: name,
            remark: remark,
            createTime: new Date().getTime()
        }, (err) => {
            pipe(err)
        });
    })

    loadList(bindBtns)

    function bindBtns() {
        $('.btn-table-inner-edit').on('click', edit)
        $('.btn-table-inner-del').on('click', del)
    }

    function edit() {
        const index = $(this).data("index")
        current = list[index]
        const $dialog = $("#supplierAddDialog")
        $dialog.find("[name=supplierName]").val(current.name)
        $dialog.find("[name=supplierRemark]").val(current.remark)
        $dialog.modal().find('.modal-title').text('编辑供应商')
    }

    function del() {
        const index = $(this).data("index")
        layer.confirm("确认删除?", function () {
            db.remove({
                _id: list[index]._id
            }, function (err) {
                pipe(err, "删除成功")
            })
        })
    }

    function pipe(err, msg) {
        if (err) return layer.msg("err")
        layer.msg(msg || "保存成功")
        loadList(bindBtns)
        $('#supplierAddDialog').modal('hide')
        const $dialog = $("#supplierAddDialog")
        $dialog.find("[name=supplierName]").val(null)
        $dialog.find("[name=supplierRemark]").val(null)
        current = null
    }

}