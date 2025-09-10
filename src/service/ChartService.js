export default class ChartService {
    constructor(ctx, defaultOptions = {}) {
        this.ctx = ctx;
        this.chart = null;
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {left: 5, right: 5, bottom: 5, top: 5}
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: false,
                    font: {size: 16}
                }
            },
            ...defaultOptions
        };
    }

    // -- Método principal para criar qualquer tipo de gráfico -- //
    create(labels, datasets, type = 'line', customOptions = {}) {
        // Validação simples
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

        // Destruir gráfico anterior se existir
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.ctx, config);
        return this.chart;
    }

    // -- Método específico para gráfico de linha -- //
    createLine(labels, data, options = {}) {
        const dataset = this.normalizeDataset(data, {
            backgroundColor: ["rgba(92, 250, 30, 0.4)"],
            fill: true,
            borderColor: "rgba(97, 243, 57, 1)",
            tension: 0.4
        });

        const lineDefaults = {
            scales: {
                x: {grid: {display: true}},
                y: {grid: {display: true}, beginAtZero: true}
            }
        };

        return this.create(labels, [dataset], 'line', this.mergeOptions(lineDefaults, options));
    }

    // -- Método específico para gráfico de barras -- //
    createBar(labels, data, options = {}) {
        const dataset = this.normalizeDataset(data, {
            backgroundColor: "rgba(75, 192, 192, 0.8)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
        });

        const barDefaults = {
            scales: {
                x: {grid: {display: false}},
                y: {grid: {display: true}, beginAtZero: true}
            }
        };

        return this.create(labels, [dataset], 'bar', this.mergeOptions(barDefaults, options));
    }

    // -- Método específico para gráfico de pizza -- //
    createPie(labels, data, options = {}) {
        const colors = [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
        ];

        const dataset = this.normalizeDataset(data, {
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 2
        });

        const pieDefaults = {
            plugins: {
                legend: {position: 'right'}
            }
        };

        return this.create(labels, [dataset], 'pie', this.mergeOptions(pieDefaults, options));
    }

    // -- Método específico para gráfico de rosca -- //
    createDoughnut(labels, data, options = {}) {
        return this.createPie(labels, data, {...options, type: 'doughnut'});
    }

    // -- Método para múltiplos datasets -- //
    createMultiDataset(labels, datasets, type = 'line', options = {}) {
        const normalizedDatasets = datasets.map((dataset, index) =>
            this.normalizeDataset(dataset, this.getDefaultColors(index))
        );

        return this.create(labels, normalizedDatasets, type, options);
    }

    // -- Atualizar dados do gráfico existente -- //
    updateData(labels, data) {
        if (!this.chart) {
            throw new Error("Nenhum gráfico foi criado ainda.");
        }

        this.chart.data.labels = labels;

        if (Array.isArray(data[0])) {
            // Múltiplos datasets
            this.chart.data.datasets = data.map((dataset, index) =>
                this.normalizeDataset(dataset, this.getDefaultColors(index))
            );
        } else {
            // Dataset único
            this.chart.data.datasets[0].data = data;
        }

        this.chart.update();
    }

    // -- Gerar dados mock para desenvolvimento -- //
    static generateMockData(labelCount = 6, labelPrefix = "Item", min = 0, max = 100) {
        const labels = Array.from({length: labelCount}, (_, i) => `${labelPrefix} ${i + 1}`);
        const data = Array.from({length: labelCount}, () =>
            Math.floor(Math.random() * (max - min + 1)) + min
        );
        return {labels, data};
    }

    // -- Método para destruir o gráfico -- //
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    // -- Métodos auxiliares -- //
    normalizeDataset(data, defaults = {}) {
        if (typeof data === 'object' && data.data) {
            // Já é um dataset completo
            return {...defaults, ...data};
        }
        // É apenas um array de dados
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