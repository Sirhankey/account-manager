
const isPaid = async (request: any) => {
    if (request?.record?.params?.isPaid) {
        request.record.params = {
            // id: request.record.params.id,
            name: request.record.params.name,
            amount: request.record.params.amount,
            dueDate: request.record.params.dueDate,
            paymentMethod: request.record.params.paymentMethod,
            paymentDate: request.record.params.paymentDate,
            discount: request.record.params.discount
        }
    }
    return request;
};

const carregaCombos = async (request: any) => {
    if (request.records?.length >= 1) {
        for (let record in request.records) {
            request.records[record].params.categoria = request.records[record].populated.categoria.params.desc;
            request.records[record].params.grupo = request.records[record].populated.grupo.params.desc;
            request.records[record].params.status = request.records[record].populated.status.params.desc;
            request.records[record].params.metodoPagamento = request.records[record].populated.metodoPagamento.params.desc;
        }
        console.log("AQUI",request);
    }
    return request;
};

// const formatCurrency = async (request: any) => {
//     if (request?.record?.params?.amount) {
//         request.record.params = {
//             ...request.record.params,
//             amount: request.record.params.amount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
//         }
//     }
//     if (request?.record?.params?.discount) {
//         request.record.params = {
//             ...request.record.params,
//             discount: request.record.params.discount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
//         }
//     }
//     if (request?.payload?.amount) {
//         request.payload = {
//             ...request.payload,
//             amount: request.payload.amount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
//         }
//     }
//     if (request?.payload?.discount) {
//         request.payload = {
//             ...request.payload,
//             discount: request.payload.discount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
//         }
//     }

//     return request;
// };

const formatCurrency = async (request: any) => {
    const formatAmount = (value: any) => value?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

    if (request?.record?.params) {
        request.record.params.amount = formatAmount(request.record.params.amount);
        request.record.params.discount = formatAmount(request.record.params.discount);
    }
    
    if (request?.payload) {
        request.payload.amount = formatAmount(request.payload.amount);
        request.payload.discount = formatAmount(request.payload.discount);
    }

    return request;
};

export { isPaid, formatCurrency, carregaCombos };