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

	public async graficoMes(req: app.Request, res: app.Response) {
		let hoje = new Date();

		let mes = hoje.getMonth() + 1;
		let dia = hoje.getDate();

		let opcoes = {
			ano: hoje.getFullYear(),
			mes: (mes < 10 ? "0" + mes : mes),
			dia: (dia < 10 ? "0" + dia : dia)
		};

		res.render("index/graficoMes", opcoes);
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

	public async obterDadosPorDia(req: app.Request, res: app.Response) {
		let data = req.query.data as string;

		let dataInicial = data + " 00:00:00";
		let dataFinal = data + " 23:59:59";

		let dados: any[];

		await app.sql.connect(async (sql: app.Sql) => {
			dados = await sql.query(`
				select avg(umidade_dados) umidade_dados, avg(temperatura_dados) temperatura_dados,
				avg(luminosidade_dados) luminosidade_dados, extract(hour from data_dados) hora
				from agro_dados
				where data_dados between ? and ?
				group by hora
				order by hora asc
			`, [dataInicial, dataFinal]);
		});

		res.json(dados);
	}

	public async obterDadosPorMes(req: app.Request, res: app.Response) {
		let mes = parseInt(req.query.mes as string);
		let ano = parseInt(req.query.ano as string);

		let dataInicial = `${ano}-${mes}-01 00:00:00`;
		if (mes >= 12) {
			ano++;
			mes = 1;
		} else {
			mes++;
		}
		let dataFinal = `${ano}-${mes}-01 00:00:00`;

		let dados: any[];

		await app.sql.connect(async (sql: app.Sql) => {
			dados = await sql.query(`
				select avg(umidade_dados) umidade_dados, avg(temperatura_dados) temperatura_dados,
				avg(luminosidade_dados) luminosidade_dados, extract(day from data_dados) dia
				from agro_dados
				where data_dados between ? and ?
				group by dia
				order by dia asc
			`, [dataInicial, dataFinal]);
		});

		res.json(dados);
	}
}

export = IndexRoute;
