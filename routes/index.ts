import app = require("teem");

class IndexRoute {
	@app.http.post()
	public async inserirLeitura(req: app.Request, res: app.Response) {
		let erro: string = null;

		let leitura = req.body;

		leitura.temperatura = parseFloat(leitura.temperatura);
		leitura.umidade = parseFloat(leitura.umidade);
		leitura.luminosidade = parseFloat(leitura.luminosidade);

		if (!leitura) {
			erro = "Dados inválidos";
		} else if (isNaN(leitura.temperatura)) {
			erro = "Temperatura inválida";
		} else if (isNaN(leitura.umidade)) {
			erro = "Umidade inválida";
		} else if (isNaN(leitura.luminosidade)) {
			erro = "Luminosidade inválida";
		}

		if (erro) {
			res.status(400).json(erro);
		} else {
			await app.sql.connect(async (sql: app.Sql) => {
				await sql.query("insert into agro_dados (temperatura_dados, umidade_dados, luminosidade_dados, id_estacao, data_dados) values (?, ?, ?, 1, now())", [leitura.temperatura, leitura.umidade, leitura.luminosidade]);
			});
			res.status(204).end();
		}
	}

	public async grafico(req: app.Request, res: app.Response) {
		let hoje = new Date();

		let mes = hoje.getMonth() + 1;
		let dia = hoje.getDate();

		let opcoes = {
			ano: hoje.getFullYear(),
			mes: (mes < 10 ? "0" + mes : mes),
			dia: (dia < 10 ? "0" + dia : dia)
		};

		res.render("index/grafico", opcoes);
	}

	public async sobre(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Sobre"
		};

		res.render("index/sobre", opcoes);
	}

	public async index(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Index"
		};

		res.render("index/index", opcoes);
	}

	public async obterDados(req: app.Request, res: app.Response) {
		let dados = [
			{ dia: "10/09", valor: 80 },
			{ dia: "11/09", valor: 92 },
			{ dia: "12/09", valor: 90 },
			{ dia: "13/09", valor: 101 },
			{ dia: "14/09", valor: 105 },
			{ dia: "15/09", valor: 100 },
			{ dia: "16/09", valor: 64 },
			{ dia: "17/09", valor: 78 },
			{ dia: "18/09", valor: 93 },
			{ dia: "19/09", valor: 110 }
		];

		res.json(dados);
	}
}

export = IndexRoute;
