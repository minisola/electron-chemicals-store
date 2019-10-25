module.exports = (db) => {

    let customerList = []
    let currentCustomer = null
    loadList()

    //载入列表
    function loadList() {
        db.find({
            dataType: 'customer'
        }).sort({
            createTime: -1
        }).exec((err, ret) => {
            if (ret && ret.length) {
                customerList = ret
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
        });
    }



    //新增客戶
    $('#customerAdd').show().on('click', function () {
        $("#customerAddDialog").modal().find('.modal-title').text('新增客户')
    })
    // 新增保存客户
    $('#customerSave').on('click', function () {
        const name = $("#customerName").val().trim()
        const remark = $("#customerRemark").val().trim()
        if (!name) {
            return layer.msg("请输入名称")
        }
        if (currentCustomer) {
            db.update({
                _id: currentCustomer._id
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
            dataType: "customer",
            name: name,
            remark: remark,
            createTime: new Date().getTime()
        }, (err) => {
            pipe(err)
        });
    })
    $(document).off('click', '.btn-table-inner-edit', edit)
        .on('click', '.btn-table-inner-edit', edit)
    $(document).off('click', '.btn-table-inner-del', del)
        .on('click', '.btn-table-inner-del', del)

    function edit() {
        const index = $(this).data("index")
        currentCustomer = customerList[index]
        const $dialog = $("#customerAddDialog")
        $dialog.find("[name=customerName]").val(currentCustomer.name)
        $dialog.find("[name=customerRemark]").val(currentCustomer.remark)
        $dialog.modal().find('.modal-title').text('编辑客户')
    }

    function del() {
        const index = $(this).data("index")
        layer.confirm("确认删除?", function () {
            db.remove({
                _id: customerList[index]._id
            }, function (err) {
                pipe(err, "删除成功")
            })
        })
    }

    function pipe(err, msg) {
        if (err) return layer.msg("err")
        layer.msg(msg || "保存成功")
        loadList()
        $('#customerAddDialog').modal('hide')
        currentCustomer = null
    }

}