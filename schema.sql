-- Create the "user" table
CREATE TABLE user(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  saldo REAL DEFAULT 0,
  role TEXT NOT NULL,
  serie TEXT, -- 2 EM, 3 EM, 7 EF
  turma TEXT, -- A, B, C
  telefone TEXT,
  email TEXT,
  cpf TEXT
);

-- Create the "produto" table
CREATE TABLE produto(
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL, -- pipoca bokus
  descricao TEXT, -- pode ser observações
  valor REAL NOT NULL,
  tipo TEXT, -- salgados, bomboniere, flor de cactus, etc
  quantidade INTEGER
);

-- Create the "venda_produto" table
CREATE TABLE venda_produto(
  id INTEGER PRIMARY KEY,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  produto_id INTEGER,
  vendido_por INTEGER,
  vendido_para INTEGER,
  turno TEXT,
  FOREIGN KEY(produto_id) REFERENCES produto(id),
  FOREIGN KEY(vendido_por) REFERENCES user(id),
  FOREIGN KEY(vendido_para) REFERENCES user(id)
);

-- Create the "historico_abastecimento_estoque" table
CREATE TABLE historico_abastecimento_estoque(
  id INTEGER PRIMARY KEY,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  descricao TEXT,
  produto_id INTEGER,
  quantidade INTEGER,
  recebido_por INTEGER,
  FOREIGN KEY(produto_id) REFERENCES produto(id),
  FOREIGN KEY(recebido_por) REFERENCES user(id)
);

-- Create the "controle_pagamento" table
CREATE TABLE controle_pagamento(
  id INTEGER PRIMARY KEY,
  tipo_pagamento TEXT, -- pix, boleto, cartão debito, cartão crédito
  descricao TEXT, -- referente a pagamento de num sei oq
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  valor REAL,
  liberado_por INTEGER,
  turno TEXT,
  aluno_id INTEGER,
  bandeira_cartao TEXT, -- se for no cartão
  pix TEXT, -- se for no pix, pode ser a chave pix
  banco TEXT, -- se for no pix, pode ser o banco
  pagamento_realizado BOOLEAN,
  FOREIGN KEY(aluno_id) REFERENCES user(id),
  FOREIGN KEY(liberado_por) REFERENCES user(id)
);

-- Create the "controle_vale_lanche" table
CREATE TABLE controle_vale_lanche(
  id INTEGER PRIMARY KEY,
  turno TEXT,
  valor REAL,
  aluno_id INTEGER,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  recebido_por INTEGER,
  vale_lanche_pago BOOLEAN,
  FOREIGN KEY(aluno_id) REFERENCES user(id),
  FOREIGN KEY(recebido_por) REFERENCES user(id)
);