As personas abaixo representam perfis complementares de pequenos negócios com atendimento presencial e consumo de energia condicionado por horários, considerando fornecimento pela distribuidora, geração solar ou combinação de ambos.

Persona 1 - A gestora focada em reduzir custos

Nome: Juliana Ferreira  
Idade: 38 anos  
Profissão: Proprietária de salão de beleza  
Cidade: Campinas, SP  

Principal dor: Juliana recebe contas de energia elevadas, mas não consegue identificar quais equipamentos, serviços ou períodos do dia provocam os picos de consumo. Secadores, aparelhos de ar-condicionado e aquecedores de água são usados simultaneamente em horários de maior movimento.

Familiaridade com tecnologia: Intermediária. Utiliza aplicativos bancários, agenda digital, WhatsApp Business e sistemas simples de gestão, mas evita configurações técnicas.

Cenário típico de uso: No encerramento do expediente, Juliana consulta um painel no celular para comparar o consumo por horário com a quantidade de atendimentos realizados. Ao perceber um pico fora do horário comercial, verifica se algum equipamento permaneceu ligado e orienta a equipe.

Métrica de sucesso: Redução percentual do custo mensal de energia, com meta inicial de 10% em três meses.

Persona 2 - O operador que precisa agir rapidamente

Nome: Marcelo Nunes  
Idade: 46 anos  
Profissão: Gerente de padaria  
Cidade: Belo Horizonte, MG  

Principal dor: Marcelo não sabe quando o consumo de fornos, câmaras frias, balcões refrigerados e aparelhos de ar-condicionado ultrapassa o padrão esperado. Ele normalmente descobre problemas apenas quando a conta aumenta ou um equipamento apresenta defeito.

Familiaridade com tecnologia: Básica. Usa WhatsApp e aplicativos essenciais, mas prefere interfaces objetivas, com alertas claros e poucas etapas.

Cenário típico de uso: Antes de abrir a padaria, Marcelo verifica se o consumo durante a madrugada permaneceu dentro do esperado. Ao receber um alerta de consumo anormal, confere os equipamentos no local e aciona a manutenção quando necessário.

Métrica de sucesso: Quantidade de ocorrências de consumo anormal identificadas antes do fechamento da conta mensal.

Persona 3 - A empreendedora que quer aproveitar melhor a energia solar

Nome: Renata Almeida  
Idade: 34 anos  
Profissão: Proprietária de clínica de estética  
Cidade: Recife, PE  

Principal dor: Renata possui painéis solares, mas não consegue visualizar de forma integrada quanto está gerando, consumindo e importando da distribuidora. Também não sabe quais serviços deveria concentrar nos horários de maior geração solar.

Familiaridade com tecnologia: Avançada. Utiliza sistemas de gestão, automações, dashboards e aplicativos de monitoramento.

Cenário típico de uso: Renata acompanha a geração solar e o consumo em tempo real. Com base no histórico por horário, reorganiza procedimentos que utilizam equipamentos de maior potência para períodos de melhor geração e compara o resultado após algumas semanas.

Métrica de sucesso: Percentual do consumo atendido diretamente pela geração solar, buscando aumentar o autoconsumo.

Comparação das personas

| Persona | Dor principal | Tecnologia | Métrica |
|---|---|---|---|
| Juliana Ferreira | Não identifica equipamentos ou horários responsáveis pelos picos de consumo | Intermediária | Redução percentual do custo mensal |
| Marcelo Nunes | Descobre anomalias apenas após aumento da conta ou falha de equipamento | Básica | Ocorrências anormais detectadas antecipadamente |
| Renata Almeida | Não integra geração solar, consumo e energia importada da rede | Avançada | Percentual do consumo atendido pela energia solar |

Requisitos funcionais
RF01 - Monitoramento em tempo real

O sistema deve exibir o consumo instantâneo da unidade em kW, com indicação da data e do horário da última leitura.

RF02 - Identificação da origem da energia

O sistema deve informar, quando houver integração disponível:

• Energia consumida da distribuidora;
• Energia gerada pelo sistema solar;
• Energia solar consumida diretamente no imóvel;
• Energia excedente injetada na rede.

RF03 - Histórico de consumo

O sistema deve permitir consultar o consumo por hora, dia, semana e mês, utilizando visualizações compreensíveis para usuários sem conhecimento técnico.

RF04 - Comparação entre períodos

O usuário deve poder comparar o consumo entre dois períodos equivalentes, como hoje e ontem, semana atual e anterior ou mês atual e anterior.

RF05 - Controle por horário de funcionamento

O sistema deve permitir configurar dias e horários de funcionamento do negócio, incluindo intervalos, feriados e horários especiais.

RF06 - Separação por faixa operacional

O sistema deve classificar as leituras em:

• Antes do expediente;
• Durante o expediente;
• Intervalos configurados;
• Após o expediente;
• Dias sem funcionamento.

RF07 - Alertas de consumo fora do horário

O sistema deve enviar alertas quando detectar consumo acima de um limite configurável fora do horário de funcionamento.

RF08 - Alertas de consumo anormal

O sistema deve identificar consumo significativamente superior ao padrão histórico do mesmo horário e dia da semana.

RF09 - Configuração de limites

O usuário deve poder definir limites de consumo em kW ou kWh por período, além de limites estimados de custo.

RF10 - Estimativa financeira

O sistema deve estimar o custo do consumo com base na tarifa cadastrada, distinguindo, quando aplicável:

• Tarifa de energia;
• Bandeira tarifária;
• Faixas ou postos tarifários;
• Tributos e encargos;
• Créditos relacionados à geração distribuída.

A estimativa deve ser apresentada como referência e não como substituta da fatura oficial da distribuidora.

RF11 - Cadastro de equipamentos

O usuário deve poder cadastrar equipamentos com nome, categoria, potência estimada, quantidade e horários usuais de funcionamento.

RF12 - Associação de consumo a equipamentos

Quando não houver medição individual por equipamento, o sistema deve apresentar qualquer atribuição de consumo como estimativa, diferenciando-a de dados medidos.

RF13 - Registro de ocorrências

O usuário deve poder registrar eventos que expliquem alterações de consumo, como manutenção, equipamento quebrado, atendimento excepcional, feriado ou mudança de horário.

RF14 - Painel resumido

O painel inicial deve apresentar, no mínimo:

• Consumo atual;
• Consumo acumulado no dia;
• Estimativa de custo do período;
• Situação em relação ao padrão esperado;
• Origem da energia;
• Alertas ativos.

RF15 - Indicadores de energia solar

Para unidades com geração solar, o sistema deve exibir geração atual, geração acumulada, autoconsumo, energia importada e excedente exportado.

RF16 - Recomendações por horário

O sistema deve sugerir horários mais adequados para utilização de equipamentos de alto consumo, considerando horário de funcionamento, histórico e disponibilidade de geração solar.

RF17 - Gestão de alertas

O usuário deve poder visualizar, reconhecer e encerrar um alerta, registrando a causa e a ação tomada.

RF18 - Notificações

O sistema deve disponibilizar notificações no próprio sistema e, conforme os canais integrados ao MVP, por e-mail ou mensagem.

RF19 - Relatório mensal

O sistema deve gerar um resumo mensal contendo consumo, custo estimado, picos, consumo fora do expediente, alertas e participação da energia solar.

RF20 - Gestão de usuários

O sistema deve permitir perfis de acesso diferenciados, como proprietário, gerente e operador, limitando ações conforme a função.

RF21 - Gestão de unidades

O sistema deve permitir cadastrar uma ou mais unidades consumidoras, ainda que o MVP possa limitar cada conta a uma única unidade.

RF22 - Status da coleta

O sistema deve informar falhas de comunicação, ausência de dados e horário da última sincronização, sem apresentar dados antigos como se fossem atuais.

Requisitos não funcionais
RNF01 - Usabilidade

As informações principais devem ser compreensíveis sem conhecimento técnico de eletricidade. Termos como kW, kWh, geração, consumo e injeção devem ter explicações contextuais.

RNF02 - Responsividade

A interface deve funcionar em celulares, tablets e computadores, priorizando o uso móvel durante a operação presencial.

RNF03 - Atualização dos dados

O painel em tempo real deve refletir novas leituras em intervalo definido pela capacidade do dispositivo de medição. O MVP deve indicar claramente esse intervalo e a última atualização.

RNF04 - Desempenho

As telas principais devem carregar em até 3 segundos em condições normais de conexão, desconsiderando atrasos de equipamentos ou serviços externos.

RNF05 - Disponibilidade

O serviço deve buscar disponibilidade mensal mínima de 99,5%, exceto em manutenções previamente comunicadas.

RNF06 - Segurança

Todo tráfego deve utilizar HTTPS. Senhas devem ser armazenadas com algoritmo seguro de hash, e operações sensíveis devem exigir autenticação e autorização.

RNF07 - Privacidade e LGPD

O sistema deve coletar apenas os dados pessoais necessários, informar finalidade e base de tratamento, controlar retenção e permitir atendimento aos direitos dos titulares conforme a LGPD.

RNF08 - Segregação de dados

Dados de diferentes clientes e unidades consumidoras devem permanecer logicamente isolados e acessíveis apenas a usuários autorizados.

RNF09 - Rastreabilidade

Alterações de configurações, limites, horários, usuários e tratamento de alertas devem ser registradas com data, horário e usuário responsável.

RNF10 - Confiabilidade das medições

O sistema deve diferenciar claramente:

• Valores medidos;
• Valores estimados;
• Valores calculados;
• Dados indisponíveis.

RNF11 - Tolerância a falhas

Falhas temporárias de internet ou integração não devem apagar leituras já recebidas. O sistema deve retomar a sincronização e sinalizar lacunas no histórico.

RNF12 - Compatibilidade de integração

A arquitetura deve permitir integração com medidores inteligentes, inversores solares e APIs de terceiros sem exigir mudanças significativas no núcleo do sistema.

RNF13 - Acessibilidade

A interface deve buscar conformidade com WCAG 2.1 nível AA, incluindo contraste adequado, navegação por teclado, rótulos acessíveis e ausência de dependência exclusiva de cores.

RNF14 - Localização brasileira

O sistema deve utilizar português do Brasil, moeda em reais, datas no formato local, fuso horário configurável e unidades elétricas apropriadas.

RNF15 - Escalabilidade

A solução deve suportar aumento de usuários, unidades e volume de leituras sem degradação relevante das telas de acompanhamento.

RNF16 - Manutenibilidade

As regras de tarifas, alertas, horários e integrações devem ser configuráveis e desacopladas da interface, facilitando ajustes sem reescrever o sistema.

RNF17 - Transparência

Recomendações e alertas devem apresentar uma justificativa simples, como "consumo 35% acima da média deste horário", evitando classificações sem explicação.

RNF18 - Recuperação e backup

O sistema deve realizar backups periódicos das configurações e dos dados históricos, com procedimento documentado de restauração.

RNF19 - Observabilidade

A aplicação deve registrar erros, falhas de integração, atrasos de leitura e indisponibilidades, permitindo diagnóstico pela equipe responsável.

RNF20 - Compatibilidade com navegadores

O sistema deve funcionar nas versões recentes dos principais navegadores móveis e desktop, especialmente Chrome, Edge, Firefox e Safari.
