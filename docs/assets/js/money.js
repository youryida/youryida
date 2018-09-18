const money = {
    /*
    两个Date的累计收益
     */
    getDateDiffGains(baseMoney, yearRate, startDate, endDate) {
        let secondsRate = yearRate / 365 / 24 / 60 / 60;
        let pastSeconds = this.getDateDiffSeconds(startDate, endDate);
        let gains = pastSeconds * secondsRate * baseMoney;
        return gains;
    },
    /*
    取两个Date的秒数差
     */
    getDateDiffSeconds(startDate, endDate) {
        return (endDate.getTime() - startDate.getTime()) / 1000;
    },
    /**
     * 按借款长短 动态计算当前利息 一般场景下时间长的利息高
     * @param  {date object} startDate    日期对象
     * @param  {步长阶梯利率的二维数组}  yearRateStep 格式为[[0,0.07],[90,0.08]]
     * @return {number}              年化利息
     */
    getCurrentPeriodYearRate(startDate, yearRateStep = [
        [0, 0.06]
    ]) {
        let nowDate = new Date();
        let pastSeconds = this.getDateDiffSeconds(startDate, nowDate);
        let pastDays = pastSeconds / 60 / 60 / 24;
        let yearRate = 0;
        yearRateStep.forEach((item, index) => {
            if (pastDays >= item[0]) { yearRate = item[1] } else {
                return;
            }
        });
        return yearRate;
    }
}


export default money;