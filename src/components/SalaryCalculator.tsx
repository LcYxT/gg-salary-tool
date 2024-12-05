import { useState } from 'react'

const SalaryCalculator = () => {
  const [joinMonth, setJoinMonth] = useState('1')
  const [monthlySalary, setMonthlySalary] = useState('64000')
  const [bonusRatio, setBonusRatio] = useState('2')

  const calculateSalary = () => {
    const n = parseInt(joinMonth) // 入職月份 (1-12)
    const salary = parseFloat(monthlySalary) // 月薪
    const ratio = parseFloat(bonusRatio) // 分紅比例

    if (isNaN(n) || isNaN(salary) || isNaN(ratio) || n < 1 || n > 12) {
      return null
    }

    const singleBonus = salary * ratio // 單次分紅金額
    const probationEndMonth = n + 3 // 試用期結束月份 (n + 3)
    const bonusMonths = [2, 5, 8, 11] // 固定的分紅月份

    // 計算有效分紅月份
    const effectiveBonusMonths = bonusMonths.filter((month) => month >= probationEndMonth + 2)

    // 如果第一個有效分紅月不是整個季度 (例如 8 月只算 4-6 月中的部分)
    const partialBonusRatio = (3 - ((probationEndMonth - 1) % 3)) / 3 // 試用期結束後能計算的月份比例 (2/3 或 1/3)

    // 底薪計算 (14 個月薪)
    const annualBaseSalary = salary * 14

    // 計算前三年的數據
    const yearData = []
    for (let year = 0; year < 4; year++) {
      const isFirstYear = year === 0

      let annualSeasonBonuses = 0

      if (isFirstYear) {
        // 第一年的分紅需要計算部分季度
        annualSeasonBonuses = effectiveBonusMonths.reduce((total, month) => {
          if (month === effectiveBonusMonths[0]) {
            // 第一個有效分紅月可能是部分季度
            return total + singleBonus * partialBonusRatio
          }
          return total + singleBonus
        }, 0)
      } else {
        // 第二年和第三年分紅 (全年有效)
        annualSeasonBonuses = bonusMonths.length * singleBonus
      }

      // 隔年 7 月補發分紅 (上年度有效分紅總額)
      const annualBonus: number = year === 0 ? 0 : yearData[year - 1].seasonBonus

      yearData.push({
        year: year + 1,
        baseSalary: isFirstYear ? (12 - n) * salary : annualBaseSalary,
        seasonBonus: annualSeasonBonuses,
        annualBonus: annualBonus,
        totalIncome: annualBaseSalary + annualSeasonBonuses + annualBonus,
      })
    }

    return yearData
  }

  const result = calculateSalary()

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>GG分紅計算器</h2>
      <div>
        <label>
          入職月份（1-12）:
          <input type="number" value={joinMonth} onChange={(e) => setJoinMonth(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          月薪 (NTD):
          <input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          季分紅倍數:
          <input type="number" step="0.01" value={bonusRatio} onChange={(e) => setBonusRatio(e.target.value)} />
        </label>
      </div>
      {result ? (
        <div style={{ marginTop: '20px' }}>
          <h3>計算結果</h3>
          {result.map((data, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              {index === 0 ? <h4>第 {data.year} 年 ({joinMonth} - 12月) </h4> : <h4>第 {data.year} 年 (1 - 12月) </h4>}
              {/* <p>底薪 (14 個月): {data.baseSalary.toFixed(2)} NTD</p> */}
              <p>當年季分紅: {data.seasonBonus.toFixed(2)} NTD</p>
              <p>(7月)年分紅: {data.annualBonus.toFixed(2)} NTD</p>
              <p>當年總分紅: {(data.seasonBonus + data.annualBonus).toFixed(2)} NTD</p>
              {/* <p>總收入: {data.totalIncome.toFixed(2)} NTD</p> */}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '20px', color: 'pink' }}>請輸入有效資料</div>
      )}
    </div>
  )
}

export default SalaryCalculator
