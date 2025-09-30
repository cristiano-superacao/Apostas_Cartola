-- SuperMittos Database Schema
-- PostgreSQL schema for football analytics and team suggestions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS supermittos;
SET search_path TO supermittos, public;

-- ================================
-- CORE TABLES
-- ================================

-- Jogadores (master table)
CREATE TABLE jogadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id BIGINT UNIQUE NOT NULL, -- ID master (Cartola ID)
    nome TEXT NOT NULL,
    nome_normalizado TEXT NOT NULL, -- Nome normalizado para matching
    apelido TEXT,
    clube_id INTEGER,
    clube_nome TEXT,
    posicao_id INTEGER NOT NULL,
    posicao_nome TEXT,
    data_nascimento DATE,
    nacionalidade TEXT,
    altura INTEGER, -- em cm
    peso INTEGER,   -- em kg
    valor_mercado DECIMAL(15,2),
    status_ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mapeamento de IDs entre fontes
CREATE TABLE jogador_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    fonte TEXT NOT NULL, -- 'cartola', 'footystats', 'sofascore', etc.
    fonte_id TEXT NOT NULL,
    fonte_nome TEXT,
    confianca REAL DEFAULT 1.0 CHECK (confianca >= 0 AND confianca <= 100),
    metadados JSONB, -- Dados específicos da fonte
    verificado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (fonte, fonte_id)
);

-- Clubes
CREATE TABLE clubes (
    id SERIAL PRIMARY KEY,
    clube_id INTEGER UNIQUE NOT NULL, -- ID do Cartola
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

-- ================================
-- STATISTICS & PERFORMANCE
-- ================================

-- Estatísticas dos jogadores por rodada
CREATE TABLE estatisticas_rodada (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    rodada INTEGER NOT NULL,
    campeonato TEXT DEFAULT 'brasileirao',
    data_rodada DATE,
    
    -- Cartola FC stats
    pontos_cartola REAL,
    preco REAL,
    variacao_preco REAL,
    media_ultimas_5 REAL,
    
    -- Match stats
    jogou BOOLEAN DEFAULT false,
    minutos_jogados INTEGER DEFAULT 0,
    gols INTEGER DEFAULT 0,
    assistencias INTEGER DEFAULT 0,
    finalizacoes INTEGER DEFAULT 0,
    finalizacoes_certas INTEGER DEFAULT 0,
    passes_certos INTEGER DEFAULT 0,
    passes_errados INTEGER DEFAULT 0,
    cartoes_amarelos INTEGER DEFAULT 0,
    cartoes_vermelhos INTEGER DEFAULT 0,
    
    -- Advanced stats (FootyStats/SofaScore)
    xg REAL, -- Expected Goals
    xa REAL, -- Expected Assists
    rating REAL,
    touches INTEGER,
    duelos_vencidos INTEGER,
    duelos_perdidos INTEGER,
    
    fonte TEXT NOT NULL,
    metadados JSONB, -- Outros dados específicos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (jogador_id, rodada, fonte)
);

-- Estatísticas históricas agregadas
CREATE TABLE estatisticas_historicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    
    -- Períodos de agregação
    periodo TEXT NOT NULL, -- 'temporada', 'ultimos_10', 'ultimos_5', 'casa', 'fora'
    temporada TEXT DEFAULT '2024',
    
    -- Stats agregadas
    jogos INTEGER DEFAULT 0,
    minutos_total INTEGER DEFAULT 0,
    gols_total INTEGER DEFAULT 0,
    assistencias_total INTEGER DEFAULT 0,
    media_pontos REAL,
    media_preco REAL,
    
    -- Advanced metrics
    gols_por_jogo REAL,
    assistencias_por_jogo REAL,
    minutos_por_jogo REAL,
    xg_total REAL,
    xa_total REAL,
    rating_medio REAL,
    
    -- Form indicators
    consistencia REAL, -- Desvio padrão das pontuações
    forma_recente REAL, -- Média últimos 5 jogos
    tendencia TEXT, -- 'crescente', 'estavel', 'decrescente'
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (jogador_id, periodo, temporada)
);

-- ================================
-- ESCALAÇÕES E PROVÁVEIS
-- ================================

-- Prováveis escalações
CREATE TABLE provaveis_escalacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    rodada INTEGER NOT NULL,
    
    -- Probabilidades
    probabilidade_titular REAL DEFAULT 0.0 CHECK (probabilidade_titular >= 0 AND probabilidade_titular <= 100),
    probabilidade_banco REAL DEFAULT 0.0,
    confirmado BOOLEAN DEFAULT false,
    
    -- Contexto
    lesionado BOOLEAN DEFAULT false,
    suspenso BOOLEAN DEFAULT false,
    convocado_selecao BOOLEAN DEFAULT false,
    observacoes TEXT,
    
    -- Fonte da informação
    fonte TEXT NOT NULL,
    confiabilidade REAL DEFAULT 50.0,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (jogador_id, rodada, fonte)
);

-- Escalações confirmadas (pós-jogo)
CREATE TABLE escalacoes_confirmadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    partida_id TEXT,
    rodada INTEGER NOT NULL,
    
    posicao_campo TEXT, -- Posição específica no campo
    titular BOOLEAN NOT NULL,
    minuto_entrada INTEGER,
    minuto_saida INTEGER,
    motivo_saida TEXT, -- 'substituicao', 'expulsao', etc.
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (jogador_id, partida_id)
);

-- ================================
-- TEAM SUGGESTIONS
-- ================================

-- Sugestões de times
CREATE TABLE sugestoes_times (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID, -- Se implementar autenticação
    rodada INTEGER NOT NULL,
    
    -- Configurações da sugestão
    orcamento_maximo REAL DEFAULT 100.0,
    estrategia TEXT DEFAULT 'balanced', -- 'conservative', 'aggressive', 'balanced'
    esquema_tatico TEXT DEFAULT '3-4-3',
    
    -- Métricas calculadas
    pontuacao_esperada REAL,
    custo_total REAL,
    roi_esperado REAL, -- Return on Investment
    risco_calculado REAL,
    
    -- Metadados
    algoritmo_versao TEXT DEFAULT '1.0',
    parametros JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jogadores nas sugestões
CREATE TABLE sugestoes_jogadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sugestao_id UUID REFERENCES sugestoes_times(id) ON DELETE CASCADE,
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    
    posicao_time TEXT NOT NULL, -- 'GOL', 'DEF', 'MID', 'ATA'
    capitao BOOLEAN DEFAULT false,
    vice_capitao BOOLEAN DEFAULT false,
    
    -- Métricas individuais para essa sugestão
    pontos_esperados REAL,
    preco REAL,
    roi_individual REAL,
    probabilidade_escalar REAL,
    
    UNIQUE (sugestao_id, jogador_id)
);

-- ================================
-- MARKET DATA
-- ================================

-- Status do mercado
CREATE TABLE mercado_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rodada_atual INTEGER,
    mercado_aberto BOOLEAN DEFAULT false,
    data_abertura TIMESTAMP,
    data_fechamento TIMESTAMP,
    
    -- Game state
    temporada TEXT DEFAULT '2024',
    mes_atual INTEGER,
    tipo_periodo TEXT, -- 'pre_season', 'regular', 'playoffs'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de preços
CREATE TABLE historico_precos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    rodada INTEGER NOT NULL,
    preco REAL NOT NULL,
    variacao REAL,
    variacao_percentual REAL,
    volume_transferencias INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (jogador_id, rodada)
);

-- ================================
-- OPTIMIZATION & ML
-- ================================

-- Modelos de predição
CREATE TABLE modelos_predicao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    versao TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'pontuacao', 'escalacao', 'preco'
    
    -- Configuração do modelo
    algoritmo TEXT, -- 'linear_regression', 'random_forest', etc.
    features JSONB, -- Lista de features utilizadas
    parametros JSONB, -- Hyperparameters
    
    -- Performance metrics
    mae REAL, -- Mean Absolute Error
    mse REAL, -- Mean Squared Error
    r2_score REAL,
    accuracy REAL,
    
    -- Metadata
    data_treino DATE,
    dataset_size INTEGER,
    ativo BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (nome, versao)
);

-- Predições dos modelos
CREATE TABLE predicoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modelo_id UUID REFERENCES modelos_predicao(id) ON DELETE CASCADE,
    jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
    rodada INTEGER NOT NULL,
    
    valor_predito REAL NOT NULL,
    confianca REAL DEFAULT 0.0,
    intervalo_min REAL,
    intervalo_max REAL,
    
    -- Para comparação posterior
    valor_real REAL,
    erro_absoluto REAL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (modelo_id, jogador_id, rodada)
);

-- ================================
-- LOGS & MONITORING
-- ================================

-- Log de execuções do ETL
CREATE TABLE etl_execucoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_execucao TEXT NOT NULL, -- 'full', 'incremental', 'cartola_only', etc.
    inicio TIMESTAMP NOT NULL,
    fim TIMESTAMP,
    status TEXT DEFAULT 'running', -- 'running', 'success', 'error'
    
    -- Métricas
    registros_processados INTEGER DEFAULT 0,
    registros_inseridos INTEGER DEFAULT 0,
    registros_atualizados INTEGER DEFAULT 0,
    registros_com_erro INTEGER DEFAULT 0,
    
    -- Detalhes
    fontes_consultadas JSONB,
    erros JSONB,
    metricas JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- INDEXES
-- ================================

-- Jogadores
CREATE INDEX idx_jogadores_nome_normalizado ON jogadores(nome_normalizado);
CREATE INDEX idx_jogadores_clube_posicao ON jogadores(clube_id, posicao_id);

-- Estatísticas
CREATE INDEX idx_estatisticas_jogador_rodada ON estatisticas_rodada(jogador_id, rodada);
CREATE INDEX idx_estatisticas_rodada_campeonato ON estatisticas_rodada(rodada, campeonato);
CREATE INDEX idx_estatisticas_pontos ON estatisticas_rodada(pontos_cartola DESC) WHERE pontos_cartola IS NOT NULL;

-- Prováveis
CREATE INDEX idx_provaveis_rodada ON provaveis_escalacoes(rodada);
CREATE INDEX idx_provaveis_probabilidade ON provaveis_escalacoes(probabilidade_titular DESC);

-- Performance indexes
CREATE INDEX idx_sugestoes_rodada ON sugestoes_times(rodada);
CREATE INDEX idx_historico_precos_jogador ON historico_precos(jogador_id);

-- ================================
-- FUNCTIONS & TRIGGERS
-- ================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_jogadores_updated_at BEFORE UPDATE ON jogadores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estatisticas_historicas_updated_at BEFORE UPDATE ON estatisticas_historicas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para normalizar nomes
CREATE OR REPLACE FUNCTION normalizar_nome(nome TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(
        unaccent(trim(nome)), 
        '[^a-z0-9\s]', 
        '', 
        'g'
    ));
END;
$$ LANGUAGE plpgsql;

-- ================================
-- INITIAL DATA
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

-- Configuração inicial do mercado
INSERT INTO mercado_status (rodada_atual, mercado_aberto, temporada) 
VALUES (1, false, '2024') 
ON CONFLICT DO NOTHING;

-- ================================
-- VIEWS
-- ================================

-- View consolidada de jogadores com estatísticas
CREATE OR REPLACE VIEW vw_jogadores_completo AS
SELECT 
    j.id,
    j.jogador_id,
    j.nome,
    j.apelido,
    c.nome as clube_nome,
    p.nome as posicao_nome,
    p.abreviacao as posicao_abrev,
    
    -- Estatísticas atuais
    eh.media_pontos,
    eh.gols_total,
    eh.assistencias_total,
    eh.forma_recente,
    eh.consistencia,
    
    -- Preço atual (última rodada)
    (SELECT preco FROM historico_precos hp 
     WHERE hp.jogador_id = j.id 
     ORDER BY rodada DESC LIMIT 1) as preco_atual,
    
    -- Probabilidade de escalar
    (SELECT probabilidade_titular FROM provaveis_escalacoes pe 
     WHERE pe.jogador_id = j.id 
     ORDER BY rodada DESC LIMIT 1) as prob_titular,
    
    j.status_ativo,
    j.updated_at
    
FROM jogadores j
LEFT JOIN clubes c ON j.clube_id = c.clube_id
LEFT JOIN posicoes p ON j.posicao_id = p.posicao_id
LEFT JOIN estatisticas_historicas eh ON j.id = eh.jogador_id 
    AND eh.periodo = 'temporada' AND eh.temporada = '2024'
WHERE j.status_ativo = true;

-- View para dashboard de performance
CREATE OR REPLACE VIEW vw_performance_dashboard AS
SELECT 
    j.nome,
    j.apelido,
    c.nome as clube,
    p.abreviacao as posicao,
    
    -- Métricas de performance
    ROUND(AVG(er.pontos_cartola), 2) as media_pontos,
    ROUND(AVG(er.preco), 2) as preco_medio,
    COUNT(er.id) as jogos,
    
    -- ROI aproximado
    ROUND(AVG(er.pontos_cartola) / NULLIF(AVG(er.preco), 0), 4) as roi,
    
    -- Forma recente (últimos 5 jogos)
    ROUND(AVG(
        CASE WHEN er.rodada > (SELECT MAX(rodada) - 5 FROM estatisticas_rodada) 
             THEN er.pontos_cartola 
             ELSE NULL END
    ), 2) as forma_recente
    
FROM jogadores j
JOIN estatisticas_rodada er ON j.id = er.jogador_id
JOIN clubes c ON j.clube_id = c.clube_id
JOIN posicoes p ON j.posicao_id = p.posicao_id
WHERE er.pontos_cartola IS NOT NULL
GROUP BY j.id, j.nome, j.apelido, c.nome, p.abreviacao
HAVING COUNT(er.id) >= 3; -- Mínimo 3 jogos

-- ================================
-- COMMENTS
-- ================================

COMMENT ON SCHEMA supermittos IS 'Schema principal do SuperMittos - Sistema de análise de futebol';
COMMENT ON TABLE jogadores IS 'Tabela master de jogadores com dados consolidados';
COMMENT ON TABLE jogador_mapping IS 'Mapeamento de IDs entre diferentes fontes de dados';
COMMENT ON TABLE estatisticas_rodada IS 'Estatísticas detalhadas por rodada e fonte';
COMMENT ON TABLE sugestoes_times IS 'Times sugeridos pelo algoritmo de otimização';
COMMENT ON TABLE provaveis_escalacoes IS 'Prováveis escalações coletadas de múltiplas fontes';