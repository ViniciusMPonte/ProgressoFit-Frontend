export default class ChartService {
    constructor(ctx, defaultOptions = {}) {
        this.ctx = ctx;
        this.chart = null;
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            ...defaultOptions
        };
    }
    

    create(labels, datasets, type = 'line', customOptions = {}) {
        if (!Array.isArray(labels) || !Array.isArray(datasets)) {
            throw new Error("Labels e datasets devem ser arrays.");
        }

        const config = {
            type: type,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: this.mergeOptions(this.defaultOptions, customOptions)
        };

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.ctx, config);
        return this.chart;
    }

    createMultiDataset(labels, datasets, type = 'line', options = {}) {
        const normalizedDatasets = datasets.map((dataset, index) =>
            this.normalizeDataset(dataset, this.getDefaultColors(index))
        );

        return this.create(labels, normalizedDatasets, type, options);
    }

    updateData(labels, data) {
        if (!this.chart) {
            throw new Error("Nenhum gráfico foi criado ainda.");
        }

        this.chart.data.labels = labels;

        if (Array.isArray(data[0])) {
            this.chart.data.datasets = data.map((dataset, index) =>
                this.normalizeDataset(dataset, this.getDefaultColors(index))
            );
        } else {
            this.chart.data.datasets[0].data = data;
        }

        this.chart.update();
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    normalizeDataset(data, defaults = {}) {
        if (typeof data === 'object' && data.data) {
            
            return {...defaults, ...data};
        }
        
        return {...defaults, data: data};
    }

    getDefaultColors(index) {
        const colors = [
            {bg: 'rgba(54, 162, 235, 0.8)', border: 'rgba(54, 162, 235, 1)'},
            {bg: 'rgba(255, 99, 132, 0.8)', border: 'rgba(255, 99, 132, 1)'},
            {bg: 'rgba(75, 192, 192, 0.8)', border: 'rgba(75, 192, 192, 1)'},
            {bg: 'rgba(255, 206, 86, 0.8)', border: 'rgba(255, 206, 86, 1)'},
            {bg: 'rgba(153, 102, 255, 0.8)', border: 'rgba(153, 102, 255, 1)'}
        ];

        const color = colors[index % colors.length];
        return {
            backgroundColor: color.bg,
            borderColor: color.border,
            borderWidth: 2
        };
    }

    mergeOptions(target, source) {
        const result = {...target};

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.mergeOptions(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    }

    get chartInstance() {
        return this.chart;
    }
}