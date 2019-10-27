const html = `<div class="container" style="padding-top:20px;padding-bottom:100px">
    <div class="row">
        <div class="col-md-12">
            <div class="needs-validation" novalidate>
                <div class="row">
                    <div class="col-md-9 mb-3">
                        <label for="country">日期</label>
                        <input type="text" readonly id="orderDate" class="form-control" name="order-date" placeholder="订单日期">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="country">是否付款</label>
                        <select class="custom-select d-block w-100">
                            <option value="0">否</option>
                            <option value="1">是</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12">
                        <button class="btn btn-sm btn-primary float-right" id="addGoods">新增</button>
                    </div>
                </div>

                <div class="card mb-4" style="background: #f9f9f9;">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                        <button class="btn btn-sm btn-danger float-right" id="delGoods">删除</button>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="username">品名</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" name="order-name" placeholder="品名">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="username">CAS#</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" name="order-cas" placeholder="CAS">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="firstName">数量</label>
                                <input type="text" class="form-control" name="order-num" placeholder="数量" value="">
                            </div>
                            <div class="col-md-6 mb-3" id="supplierSelecter">
                                <label for="username">供应商</label>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">进项</label>
                                <input type="text" class="form-control" name="order-income" placeholder="进项" value="">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">进项税</label>
                                <input type="text" class="form-control" name="order-inputTax" placeholder="进项税"
                                    value="">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">出项税</label>
                                <input type="text" class="form-control" name="order-outputTax" placeholder="出项税"
                                    value="">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="lastName">杂费</label>
                                <input type="text" class="form-control" name="order-extra" placeholder="杂费" value="">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="username">备注</label>
                            <div class="input-group">
                                <input type="text" class="form-control" name="order-remark" placeholder="备注">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="lastName">货款</label>
                        <input type="text" class="form-control" name="order-payment" placeholder="货款"
                            value="">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="lastName">购汇</label>
                        <input type="text" class="form-control" name="order-exchange" placeholder="购汇" value="">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="firstName">银行手续费</label>
                        <input type="text" class="form-control" name="order-bankCharges" placeholder="银行手续费" value="">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="username">关税</label>
                        <input type="text" class="form-control" name="order-tariff" placeholder="关税" value="">
                    </div>
                    <div class="col-md-6 mb-3">
                            <label for="username">运费</label>
                            <input type="text" class="form-control" name="order-fare" placeholder="运费" value="">
                        </div>
                </div>
                <div class="row">
                        <div class="col-md-6 mb-3" id="customerSelecter">
                            <label for="username">采购商</label>
                        </div>
                    </div>
                <div class="row">
                    <div class="col-md-6 mb-3" id="expressSelecter">
                        <label for="username">快递公司</label>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="username">快递单号</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="order-expressNum" placeholder="快递单号">
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="username">快递日期</label>
                        <div class="input-group">
                            <input type="text" id="orderExpressDate" readonly class="form-control" name="order-expressDate" placeholder="请选择">
                        </div>
                    </div>
                </div>
                <div class="row">
                        <div class="col-md-12 mb-3" >
                            <label for="username">订单备注</label>
                            <input type="text" class="form-control" name="order-extraRemark" placeholder="">
                        </div>
                    </div>
            </div>
        </div>
    </div>
</div>`

module.exports = html