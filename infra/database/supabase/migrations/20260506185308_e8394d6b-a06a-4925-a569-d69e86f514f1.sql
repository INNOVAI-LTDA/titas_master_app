
-- GRUPOS
CREATE TABLE public.grupos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  icone TEXT,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- MEMBROS
CREATE TABLE public.membros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID NOT NULL REFERENCES public.grupos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especialidade TEXT,
  telefone TEXT,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- COMPETENCIAS MENSAIS (mes_referencia armazenado como primeiro dia do mês)
CREATE TABLE public.competencias_mensais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID NOT NULL REFERENCES public.grupos(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  data_abertura TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_fechamento TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta','fechada')),
  bloqueada BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (grupo_id, mes_referencia)
);

-- FATURAMENTOS
CREATE TABLE public.faturamentos_mensais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID NOT NULL REFERENCES public.grupos(id) ON DELETE CASCADE,
  membro_id UUID NOT NULL REFERENCES public.membros(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  valor_bruto NUMERIC(14,2) NOT NULL CHECK (valor_bruto >= 0),
  data_registro TIMESTAMPTZ NOT NULL DEFAULT now(),
  bloqueado BOOLEAN NOT NULL DEFAULT false,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (grupo_id, membro_id, mes_referencia)
);

-- HOTSEATS
CREATE TABLE public.hotseats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID NOT NULL REFERENCES public.grupos(id) ON DELETE CASCADE,
  data_hotseat DATE NOT NULL,
  lider_id UUID NOT NULL REFERENCES public.membros(id),
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GARGALOS
CREATE TABLE public.gargalos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotseat_id UUID NOT NULL REFERENCES public.hotseats(id) ON DELETE CASCADE,
  membro_id UUID NOT NULL REFERENCES public.membros(id),
  descricao TEXT NOT NULL,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger genérico para data_atualizacao
CREATE OR REPLACE FUNCTION public.set_data_atualizacao()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.data_atualizacao = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_grupos_upd BEFORE UPDATE ON public.grupos FOR EACH ROW EXECUTE FUNCTION public.set_data_atualizacao();
CREATE TRIGGER trg_membros_upd BEFORE UPDATE ON public.membros FOR EACH ROW EXECUTE FUNCTION public.set_data_atualizacao();
CREATE TRIGGER trg_fat_upd BEFORE UPDATE ON public.faturamentos_mensais FOR EACH ROW EXECUTE FUNCTION public.set_data_atualizacao();
CREATE TRIGGER trg_hs_upd BEFORE UPDATE ON public.hotseats FOR EACH ROW EXECUTE FUNCTION public.set_data_atualizacao();
CREATE TRIGGER trg_gg_upd BEFORE UPDATE ON public.gargalos FOR EACH ROW EXECUTE FUNCTION public.set_data_atualizacao();

-- Trigger: bloquear modificações em competência fechada
CREATE OR REPLACE FUNCTION public.bloquear_competencia_fechada()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_status TEXT;
  v_mes DATE;
  v_grupo UUID;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_mes := OLD.mes_referencia; v_grupo := OLD.grupo_id;
  ELSE
    v_mes := NEW.mes_referencia; v_grupo := NEW.grupo_id;
  END IF;

  SELECT status INTO v_status FROM public.competencias_mensais
   WHERE grupo_id = v_grupo AND mes_referencia = v_mes;

  IF v_status = 'fechada' THEN
    RAISE EXCEPTION 'Competência % fechada — operação não permitida', to_char(v_mes,'YYYY-MM');
  END IF;

  IF (TG_OP = 'DELETE') THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

CREATE TRIGGER trg_fat_bloqueio
BEFORE INSERT OR UPDATE OR DELETE ON public.faturamentos_mensais
FOR EACH ROW EXECUTE FUNCTION public.bloquear_competencia_fechada();

-- RLS — sistema sem login, acesso público total (premissa explícita)
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencias_mensais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturamentos_mensais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotseats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gargalos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public all" ON public.grupos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.membros FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.competencias_mensais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.faturamentos_mensais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.hotseats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.gargalos FOR ALL USING (true) WITH CHECK (true);
