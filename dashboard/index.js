// -- Função para gerar o eixo X das semanas e o eixo Y da qnt treinos -- //
class TreinoData {
  constructor(semanas, treinos) {
    if (semanas.length !== treinos.length) {
      throw new Error("Dias e treinos devem ter o mesmo tamanho.");
    }
    this.semanas = semanas;
    this.treinos = treinos;
  }
}

// -- Função mock gera dados ficticios para o grafico -- // 
function mockTreinoData(numSemanas = 6) {
  const semanas = [];
  const treinos = [];

  for (let i = 1; i <= numSemanas; i++) {
    semanas.push(`Semana ${i}`);
    treinos.push(Math.floor(Math.random() * (9 - 0 + 1)) + 0); 
    // gera valores entre 0 e 9
  }
  return new TreinoData(semanas, treinos);
}



// -- Modelo do grafico -- //
class Grafico {
  constructor(ctx) {
    this.ctx = ctx;
    this.chart = null;
  }

  criar(treinoData) {
    const config = {
      type: "line",
      data: {
        labels: treinoData.semanas,
        datasets: [
          {
            data: treinoData.treinos,
            backgroundColor: ["rgba(92, 250, 30, 0.4)"],
            fill: true,
            borderColor: "rgba(97, 243, 57, 1)",
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        layout: {
          padding: { left: 5, right: 5, bottom: 5, top: 2 }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Treinos realizado nas Semanas",
            font: { size: 20 }
          }
        },
        scales: {
          x: {
            grid: { display: false, drawOnChartArea: false }
          },
          y: {
            grid: { display: false, drawOnChartArea: false },
            min: 0,
            max: 9,
            ticks: { stepSize: 1 }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.ctx, config);
  }
}

// --- Exemplo de uso ---
const ctx = document.getElementById("line-chart");

// -- Para ativar o mock e gerar os dados troque para true -- //
const isDev = false;

const treinoData = isDev
  ? mockTreinoData(6) 
  : new TreinoData(
      ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5","Semana 6"],
      [4, 5, 6, 4, 9, 6]
    );

const grafico = new Grafico(ctx);
grafico.criar(treinoData);
