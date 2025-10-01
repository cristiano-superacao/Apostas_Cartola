# Script SQL completo para Supabase
# Cole este conteúdo no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar schema principal
CREATE SCHEMA IF NOT EXISTS supermittos;
SET search_path TO supermittos, public;

-- ================================
-- TABELAS PRINCIPAIS
-- ================================

-- Jogadores (tabela master)
CREATE TABLE jogadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id BIGINT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    nome_normalizado TEXT NOT NULL,
    apelido TEXT,
    clube_id INTEGER,
    clube_nome TEXT,
    posicao_id INTEGER NOT NULL,
    posicao_nome TEXT,
    data_nascimento DATE,
    nacionalidade TEXT,
    altura INTEGER,
    peso INTEGER,
    valor_mercado DECIMAL(15,2),
    status_ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clubes
CREATE TABLE clubes (
    id SERIAL PRIMARY KEY,
    clube_id INTEGER UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    nome_normalizado TEXT NOT NULL,
    abreviacao TEXT,
    escudo_url TEXT,
    liga TEXT DEFAULT 'brasileirao',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posições
CREATE TABLE posicoes (
    id SERIAL PRIMARY KEY,
    posicao_id INTEGER UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    abreviacao TEXT NOT NULL,
    ordem_display INTEGER,
    min_escalacao INTEGER DEFAULT 0,
    max_escalacao INTEGER DEFAULT 11
);

-- Estatísticas por rodada
CREATE TABLE estatisticas_rodada (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    rodada INTEGER NOT NULL,
    campeonato TEXT DEFAULT 'brasileirao',
    data_rodada DATE,
    pontos_cartola REAL,
    preco REAL,
    variacao_preco REAL,
    media_ultimas_5 REAL,
    jogou BOOLEAN DEFAULT false,
    minutos_jogados INTEGER DEFAULT 0,
    gols INTEGER DEFAULT 0,
    assistencias INTEGER DEFAULT 0,
    finalizacoes INTEGER DEFAULT 0,
    passes_certos INTEGER DEFAULT 0,
    cartoes_amarelos INTEGER DEFAULT 0,
    cartoes_vermelhos INTEGER DEFAULT 0,
    fonte TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (jogador_id, rodada, fonte)
);

-- Sugestões de times
CREATE TABLE sugestoes_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID,
    rodada INTEGER NOT NULL,
    orcamento_maximo REAL DEFAULT 100.0,
    estrategia TEXT DEFAULT 'balanced',
    esquema_tatico TEXT DEFAULT '3-4-3',
    pontuacao_esperada REAL,
    custo_total REAL,
    roi_esperado REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jogadores nas sugestões
CREATE TABLE sugestoes_jogadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sugestao_id UUID REFERENCES sugestoes_times(id) ON DELETE CASCADE,
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    posicao_time TEXT NOT NULL,
    capitao BOOLEAN DEFAULT false,
    pontos_esperados REAL,
    preco REAL,
    UNIQUE (sugestao_id, jogador_id)
);

-- Status do mercado
CREATE TABLE mercado_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rodada_atual INTEGER,
    mercado_aberto BOOLEAN DEFAULT false,
    data_abertura TIMESTAMP,
    data_fechamento TIMESTAMP,
    temporada TEXT DEFAULT '2024',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- ÍNDICES
-- ================================

CREATE INDEX idx_jogadores_nome ON jogadores(nome_normalizado);
CREATE INDEX idx_jogadores_clube ON jogadores(clube_id, posicao_id);
CREATE INDEX idx_estatisticas_jogador ON estatisticas_rodada(jogador_id, rodada);
CREATE INDEX idx_estatisticas_pontos ON estatisticas_rodada(pontos_cartola DESC);

-- ================================
-- DADOS INICIAIS
-- ================================

-- Posições do Cartola FC
INSERT INTO posicoes (posicao_id, nome, abreviacao, ordem_display, min_escalacao, max_escalacao) VALUES
(1, 'Goleiro', 'GOL', 1, 1, 1),
(2, 'Lateral', 'LAT', 2, 0, 2),
(3, 'Zagueiro', 'ZAG', 3, 1, 2),
(4, 'Meia', 'MEI', 4, 1, 3),
(5, 'Atacante', 'ATA', 5, 1, 3),
(6, 'Técnico', 'TEC', 6, 1, 1)
ON CONFLICT (posicao_id) DO NOTHING;

-- Status inicial do mercado
INSERT INTO mercado_status (rodada_atual, mercado_aberto, temporada) 
VALUES (1, false, '2024') 
ON CONFLICT DO NOTHING;

-- Dados de exemplo para teste
INSERT INTO jogadores (jogador_id, nome, nome_normalizado, clube_nome, posicao_id, posicao_nome) VALUES
(1, 'Cristiano Ronaldo', 'cristiano ronaldo', 'Al Nassr', 5, 'Atacante'),
(2, 'Lionel Messi', 'lionel messi', 'Inter Miami', 5, 'Atacante'),
(3, 'Neymar Jr', 'neymar jr', 'Al Hilal', 5, 'Atacante'),
(4, 'Kylian Mbappé', 'kylian mbappe', 'Real Madrid', 5, 'Atacante'),
(5, 'Erling Haaland', 'erling haaland', 'Manchester City', 5, 'Atacante')
ON CONFLICT (jogador_id) DO NOTHING;

-- ================================
-- VIEW PARA DASHBOARD
-- ================================

CREATE OR REPLACE VIEW vw_jogadores_dashboard AS
SELECT 
    j.id,
    j.nome,
    j.clube_nome,
    p.abreviacao as posicao,
    COALESCE(AVG(er.pontos_cartola), 0) as media_pontos,
    COALESCE(AVG(er.preco), 50) as preco_medio,
    COUNT(er.id) as jogos,
    j.status_ativo
FROM jogadores j
LEFT JOIN posicoes p ON j.posicao_id = p.posicao_id
LEFT JOIN estatisticas_rodada er ON j.id = er.jogador_id
WHERE j.status_ativo = true
GROUP BY j.id, j.nome, j.clube_nome, p.abreviacao, j.status_ativo;