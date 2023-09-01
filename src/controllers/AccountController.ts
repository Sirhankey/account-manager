import moment from "moment";
import { sequelize } from "../../db";
import { Account } from "../models/account.entity";
import { getLast12Months } from "../utils/date";
import { Op } from "sequelize";

export default class AccountController{
    async getData(){
        console.log('!!!getData() - AccountController!!!')
        const months = getLast12Months();
        const labels = months[0];
        const data = await this.getTotalByMonth2(months[1])

        return  {
            labels: labels,
            data: {
                labels,
                datasets: [
                  {
                    label: 'Contas a Pagar',
                    data: data[0],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                  {
                    label: 'Contas Pagas',
                    data: data[1],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  },
                ],
              }
        }
    }
    async getTotalByMonth(months: any[], status: any){
        const accounts: Number[] = []

        for(const month of months){
            const _accounts = await Account.count({
                where: {
                    createdAt: {
                        [Op.and]: [
                            sequelize.literal(`MONTH(createdAt) = ${month[1]}`),
                            sequelize.literal(`YEAR(createdAt) = ${month[0]}`),
                        ]
                    }
                }
            });

            accounts.push(_accounts);
        }
        return accounts;
    }

    async getTotalByMonth2(months: any[]){
        const accountsTrue: any[] = []
        const accountsFalse: any[] = []

        for(const month of months){
            const _accounts = await Account.findAll({
                attributes: [
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('id')), 'totalAccounts'],
                    'nome',
                    'amount'
                ],
                where: {
                    dataPagamento: {
                        [Op.and]: [
                            sequelize.literal(`MONTH(dueDate) = ${month[1]}`),
                            sequelize.literal(`YEAR(dueDate) = ${month[0]}`),
                        ]
                    }
                },
            })

            const t = _accounts.map((t: any) => {
                return {
                    status: t.status,
                    conta: t.nome,
                    totalAccounts: t.get('totalAccounts')
                }
            });
            if(t[0]){
                accountsTrue.push(t[0]['totalAccounts']);
            }else{
                accountsTrue.push(0);
            }
            if(t[1]){
                accountsFalse.push(t[1]['totalAccounts']);
            }else{
                accountsFalse.push(0);
            }
        }

        return [accountsTrue, accountsFalse];
    }

    async getWeekDays(){
        const hoje = moment()

        var diasDaSemana: any = [];
        var data_active: any = [];
        var data_inactive: any = [];

        for(let i = 0; i < 7; i++){
            const date = moment(hoje).subtract(i, 'days');
            const dayWeek = date.format('dddd');
            diasDaSemana.push(dayWeek);

            const r_active = await this.getTotalDay(date.format('YYYY-MM-DD'), 1)
            const r_inactive = await this.getTotalDay(date.format('YYYY-MM-DD'), 0)
            data_active.push(r_active)
            data_inactive.push(r_inactive)
        }

        data_active.reverse()
        data_inactive.reverse()
        diasDaSemana.reverse()

        return [diasDaSemana, data_active, data_inactive];
    }

    async getTotalDay(day: string, status: any){
        return await Account.count({
            where: {
                createdAt: {
                    [Op.and]: [
                        sequelize.literal(`createdAt >= '${day} 00:00:00'`),
                        sequelize.literal(`createdAt <= '${day} 23:59:59'`),
                    ]
                },
                status: status
            }
        });
    }
}