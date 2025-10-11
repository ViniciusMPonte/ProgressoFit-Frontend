export class MathHelper {
    static calculatePercentage(value, total, decimals = 0) {
        if (total === 0) return 0

        const percentage = (value / total) * 100
        return Number(percentage.toFixed(decimals))
    }
}
