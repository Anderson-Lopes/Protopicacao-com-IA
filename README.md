# Energia Clara --- Monitoramento Inteligente de Energia

Aplicativo conceitual de monitoramento energético para pequenos
negócios. O projeto propõe uma experiência simples para acompanhar o
consumo de eletricidade, identificar anomalias, estimar custos e
aproveitar melhor a geração de energia solar.

> **Status:** protótipo de UX/UI e definição funcional. Este repositório
> documenta a proposta do produto e suas principais telas. Não
> representa, por si só, um sistema de monitoramento conectado a
> medidores reais.

## Objetivo

Ajudar proprietários e gestores de pequenos negócios a entender quando e
como a energia é consumida, identificar desperdícios e tomar decisões
operacionais com base em informações claras.

O projeto prioriza três objetivos:

-   **Reduzir custos:** identificar horários e situações de maior
    consumo.
-   **Detectar anomalias:** sinalizar consumo fora do expediente ou
    acima do padrão histórico.
-   **Aproveitar energia solar:** acompanhar geração, autoconsumo,
    energia importada da rede e excedente exportado, quando houver
    integração disponível.

## Público-alvo

O documento de requisitos considera três perfis complementares:

  -----------------------------------------------------------------------
  Persona                 Negócio                 Necessidade principal
  ----------------------- ----------------------- -----------------------
  Juliana Ferreira        Salão de beleza         Identificar
                                                  equipamentos e horários
                                                  que provocam picos e
                                                  aumentam a conta

  Marcelo Nunes           Padaria                 Detectar rapidamente
                                                  consumo anormal,
                                                  especialmente fora do
                                                  expediente

  Renata Almeida          Clínica de estética com Integrar consumo,
                          energia solar           geração solar e energia
                                                  importada da
                                                  distribuidora
  -----------------------------------------------------------------------

A interface deve atender pessoas com diferentes níveis de familiaridade
com tecnologia, priorizando clareza e poucas etapas para as tarefas
frequentes.

## Funcionalidades principais

-   Monitoramento do consumo instantâneo em kW, com data e horário da
    última leitura.
-   Visualização da origem da energia: distribuidora, geração solar,
    autoconsumo e excedente injetado, conforme disponibilidade dos
    dados.
-   Histórico de consumo por hora, dia, semana e mês.
-   Comparação entre períodos equivalentes.
-   Configuração dos dias e horários de funcionamento, incluindo
    intervalos e horários especiais.
-   Classificação do consumo por faixa operacional: antes, durante e
    depois do expediente, intervalos e dias sem funcionamento.
-   Alertas de consumo fora do horário e de consumo acima do padrão
    histórico.
-   Configuração de limites de consumo e estimativas de custo.
-   Estimativa financeira baseada na tarifa cadastrada, apresentada como
    referência e não como substituta da fatura oficial.
-   Cadastro de equipamentos e associação estimada de consumo quando não
    houver medição individual.
-   Registro de ocorrências, como manutenção, falha de equipamento,
    feriado ou atendimento excepcional.
-   Recomendações de horários para uso de equipamentos de maior
    potência.
-   Relatório mensal com consumo, custo estimado, picos, consumo fora do
    expediente, alertas e participação solar.
-   Gestão de usuários e unidades consumidoras, conforme o escopo de
    implantação.

## Telas essenciais e navegação

A proposta inicial organiza o produto em quatro telas principais,
acessíveis por uma navegação inferior persistente.

  -----------------------------------------------------------------------
  Tela                    Responsabilidade        Conteúdo principal
  ----------------------- ----------------------- -----------------------
  **Dashboard**           Visão geral da unidade  Consumo atual e
                                                  acumulado, custo
                                                  estimado, situação em
                                                  relação ao padrão,
                                                  origem da energia,
                                                  status da coleta e
                                                  alertas ativos

  **Histórico**           Análise do              Gráficos por período,
                          comportamento de        filtros e comparação
                          consumo                 entre intervalos

  **Alertas**             Investigação de         Alertas ativos e
                          anomalias               resolvidos,
                                                  justificativa,
                                                  reconhecimento e
                                                  registro da ação tomada

  **Configurações**       Gestão dos parâmetros   Horários de
                          energéticos             funcionamento, limites,
                                                  equipamentos, tarifa,
                                                  notificações e
                                                  integração solar
  -----------------------------------------------------------------------

### Fluxo principal

1.  A pessoa usuária abre o **Dashboard** e verifica o consumo atual.
2.  Identifica um valor ou alerta fora do esperado.
3.  Acessa **Alertas** para investigar a ocorrência.
4.  Consulta os detalhes e registra a causa ou a ação tomada.
5.  Usa o **Histórico** para comparar o comportamento com outros
    períodos.
6.  Ajusta horários, limites ou equipamentos em **Configurações**,
    quando necessário.
7.  Retorna ao **Dashboard** para acompanhar o resultado.

## Diretrizes visuais

A identidade visual proposta combina modo escuro com azul e roxo para
transmitir tecnologia, confiança e eficiência energética.

### Paleta de cores

  Token            Cor                              Hex
  ---------------- -------------------------------- -----------
  Preto profundo   Fundo principal                  `#090B12`
  Azul             Cor primária e ações             `#2176F5`
  Roxo             Destaques e séries de gráficos   `#8257E8`
  Branco           Texto principal                  `#FFFFFF`
  Cinza            Texto secundário                 `#A1A8B7`
  Verde            Estado positivo                  `#22C983`

### Tipografia e componentes

-   **Fonte proposta:** Inter.
-   **Títulos:** 24--28 px, semibold.
-   **Subtítulos:** 16--18 px, medium.
-   **Texto de corpo:** 14--16 px, regular.
-   **Informações auxiliares:** 12 px.
-   **Cards:** cantos arredondados de 12 px.
-   **Botões:** altura mínima de 44 px.
-   **Acessibilidade:** não depender exclusivamente de cores para
    comunicar estados; combinar cor com texto e ícones.

## Requisitos não funcionais e qualidade

A solução deverá considerar:

-   Interface responsiva para celular, tablet e computador, com
    prioridade para uso móvel.
-   Linguagem em português do Brasil, moeda em reais, datas no formato
    local e unidades elétricas apropriadas.
-   Carregamento das telas principais em até 3 segundos em condições
    normais de conexão, desconsiderando atrasos de dispositivos e
    serviços externos.
-   Indicação explícita da última atualização, intervalo de coleta e
    eventuais falhas de comunicação.
-   Diferenciação entre valores medidos, estimados, calculados e
    indisponíveis.
-   Comunicação segura por HTTPS, autenticação e autorização para
    operações sensíveis.
-   Isolamento dos dados de diferentes clientes e unidades.
-   Cuidados com privacidade e tratamento de dados conforme a LGPD.
-   Acessibilidade com objetivo de conformidade WCAG 2.1 nível AA.
-   Registro rastreável de alterações de configurações e tratamento de
    alertas.

## Transparência dos dados

Alguns indicadores dependem da disponibilidade de integrações com
medidores, inversores solares ou serviços de terceiros.

-   O consumo atribuído a equipamentos sem medição individual deve ser
    identificado como **estimativa**.
-   A estimativa de custo deve ser apresentada como referência, não como
    valor oficial da fatura.
-   Dados antigos não devem ser apresentados como se fossem atuais.
-   Falhas de comunicação, ausência de dados e lacunas no histórico
    devem ser sinalizadas.
-   Recomendações e alertas devem explicar sua justificativa, por
    exemplo: "consumo 35% acima da média deste horário".

## Escopo e observações

Este projeto parte de uma definição de produto, personas, requisitos
funcionais e requisitos não funcionais, acompanhada de uma proposta
inicial de UX/UI com quatro telas.

As integrações com medidores inteligentes, inversores solares, APIs de
terceiros, notificações externas e dados tarifários dependem de
implementação e validação técnica. Não se presume que estejam
operacionais apenas pela existência dos layouts ou desta documentação.

## Próximos passos sugeridos

1.  Validar as quatro telas e os fluxos com representantes das personas.
2.  Criar um protótipo navegável no Figma.
3.  Priorizar os requisitos para definir o MVP.
4.  Definir arquitetura, fontes de dados e integrações de medição.
5.  Implementar autenticação, gestão de unidades e isolamento de dados.
6.  Testar usabilidade, acessibilidade, desempenho e confiabilidade das
    leituras.
7.  Validar alertas e estimativas com dados reais antes de
    disponibilizá-los aos usuários.

## Contribuição

Contribuições são bem-vindas. Antes de propor mudanças, descreva o
problema, o comportamento esperado e os requisitos afetados. Para
alterações de interface, inclua capturas de tela ou link do protótipo,
quando possível.

## Licença

A licença deste projeto ainda não foi definida. Até que uma licença seja
adicionada ao repositório, não presuma permissões de reutilização,
distribuição ou modificação do conteúdo.




LINK DO PROJETO
https://cy6xekivtg5ev4qybylfamxt7.bolt.host/





