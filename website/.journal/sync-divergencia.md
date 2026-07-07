# Sync fichas README ↔ reproductor — informe de divergencia

> Generado automáticamente. Comparación por nombres de MCP (proxy de divergencia). Además de MCPs, revisar nombre de agente/validador y mecanismos del bloque 5. Fuente de verdad: **caso por caso** (elegir el mejor y alinear el otro).

Total: 119 · sin-solape: 25 · parcial: 89 · alineado: 5

| Estado | id | MCPs reproductor | MCPs README |
|---|---|---|---|
| sin-solape | `analista/de-pregunta-de-negocio-a-sql` | mcp-catalog, mcp-warehouse | mcp-atlan, mcp-bigquery, mcp-databricks, mcp-dbt, mcp-github, mcp-snowflake |
| sin-solape | `analista/limpiar-y-normalizar-un-dataset` | mcp-catalog, mcp-warehouse | mcp-databricks, mcp-gcs, mcp-s3 |
| sin-solape | `analista/resumir-hallazgos-para-no-tecnicos` | mcp-bi, mcp-confluence, mcp-notebook, mcp-warehouse | — |
| sin-solape | `analista/segunda-opinion-sobre-tu-propio-analisis` | mcp-notebook, mcp-warehouse | — |
| sin-solape | `desarrollador/revision-asistida-de-pr-ajenos` | mcp-ci, mcp-git, mcp-pr | mcp-filesystem, mcp-github, mcp-semgrep |
| sin-solape | `ejecutivo/decision-making-estructurar-opciones-y-trade` | mcp-bi, mcp-crm, mcp-docs, mcp-drive | mcp-financial-model |
| sin-solape | `finanzas/conciliacion-bancaria` | mcp-bank, mcp-erp, mcp-je, mcp-vendor | mcp-bank-statement, mcp-excel, mcp-sap |
| sin-solape | `finanzas/forecast-y-presupuesto` | mcp-erp, mcp-excel, mcp-planning, mcp-warehouse | mcp-anaplan, mcp-bigquery, mcp-graph-files, mcp-pigment, mcp-snowflake |
| sin-solape | `finanzas/lectura-de-contratos-financieros` | mcp-clm, mcp-erp, mcp-sharepoint, mcp-treasury | mcp-docusign-clm, mcp-graph-files, mcp-icertis |
| sin-solape | `finanzas/modelado-en-excel-formulas-complejas` | mcp-erp, mcp-excel, mcp-graph-files | — |
| sin-solape | `frontline/apoyo-en-emergencias-o-situaciones-dificiles` | mcp-directorio, mcp-handoff, mcp-protocolos | mcp-directorio-emergencias |
| sin-solape | `frontline/comunicacion-con-el-cliente` | mcp-crm, mcp-kb, mcp-messaging | mcp-mensajeria, mcp-whatsapp-business |
| sin-solape | `frontline/traduccion-y-atencion-multilingue` | mcp-envio, mcp-glosario, mcp-kb | mcp-traduccion |
| sin-solape | `it-seguridad/caza-de-amenazas-threat-hunting` | mcp-edr, mcp-mitre, mcp-siem, mcp-soar | mcp-sentinel-kql, mcp-splunk-spl |
| sin-solape | `it-seguridad/triage-phishing-usuario` | mcp-graph-mail, mcp-remediation, mcp-reputation, mcp-siem | mcp-azure-ad, mcp-server, mcp-virustotal |
| sin-solape | `legal/analisis-y-comparativa-jurisprudencial` | mcp-cendoj, mcp-dms, mcp-eurlex, mcp-sharepoint | mcp-aranzadi, mcp-lexis, mcp-vlex, mcp-westlaw |
| sin-solape | `legal/borrador-de-dictamenes-notas-y-memorandos` | mcp-caselaw, mcp-clm, mcp-dms, mcp-sharepoint | mcp-aranzadi, mcp-graph-files, mcp-vlex |
| sin-solape | `manager/preparar-un-1-1` | mcp-calendar, mcp-hris, mcp-jira, mcp-notes | mcp-graph-goals, mcp-graph-onenote, mcp-graph-teams |
| sin-solape | `marketing/imagenes-videos-y-diseno` | mcp-brand-guide, mcp-cms, mcp-dam | mcp-adobe-express, mcp-bynder, mcp-frontify, mcp-graph-files |
| sin-solape | `operador/asistente-en-on-call` | mcp-k8s, mcp-k8s-op, mcp-prometheus, mcp-runbook | mcp-datadog, mcp-kubernetes, mcp-loki, mcp-pagerduty, mcp-y-herramientas |
| sin-solape | `operador/borrador-de-postmortem` | mcp-git, mcp-pagerduty, mcp-slack, mcp-statuspage | — |
| sin-solape | `operador/generacion-de-manifiestos-e-iac` | mcp-cloud, mcp-git, mcp-k8s | mcp-kubernetes |
| sin-solape | `operador/generacion-y-mantenimiento-de-runbooks` | mcp-confluence, mcp-git, mcp-incident, mcp-k8s | mcp-context7, mcp-slack |
| sin-solape | `rrhh/redaccion-de-ofertas-de-empleo` | mcp-ats, mcp-brand-guide, mcp-greenhouse | mcp-graph-files, mcp-workday |
| sin-solape | `soporte/traduccion-y-adaptacion-cultural` | mcp-glossary, mcp-kb, mcp-reply, mcp-zendesk | mcp-deepl, mcp-graph-files |
| parcial | `analista/analisis-exploratorio-inicial-eda` | mcp-atlan, mcp-databricks, mcp-databricks-nb, mcp-snowflake | mcp-bigquery, mcp-databricks, mcp-snowflake |
| parcial | `analista/deteccion-de-anomalias` | mcp-datadog, mcp-hris, mcp-notify, mcp-snowflake | mcp-datadog, mcp-hris, mcp-snowflake |
| parcial | `analista/documentacion-del-analisis` | mcp-confluence, mcp-dbt, mcp-notebook, mcp-warehouse | mcp-confluence, mcp-y-herramientas |
| parcial | `analista/visualizaciones-rapidas` | mcp-powerbi, mcp-tableau, mcp-warehouse | mcp-powerbi, mcp-tableau |
| parcial | `desarrollador/asistente-desarrollador-agents-md` | mcp-github, mcp-jira, mcp-tests | mcp-confluence, mcp-github, mcp-jira |
| parcial | `desarrollador/refactor-estructurado-de-un-modulo` | mcp-git, mcp-issue, mcp-repo-fs | mcp-filesystem, mcp-git, mcp-github, mcp-jest, mcp-pytest |
| parcial | `desarrollador/triage-de-incidentes-a-partir-de` | mcp-git, mcp-jira, mcp-logs, mcp-sentry | mcp-argocd, mcp-datadog, mcp-datadog-apm, mcp-github, mcp-jira, mcp-kubernetes, mcp-newrelic, mcp-pagerduty, mcp-splunk, mcp-y-herramientas |
| parcial | `ejecutivo/analisis-competitivo-y-de-mercado` | mcp-brief, mcp-crm, mcp-news, mcp-web-fetch | mcp-crm, mcp-market-intel, mcp-news |
| parcial | `ejecutivo/borrador-de-comunicacion-interna-o-externa` | mcp-brand, mcp-cms, mcp-confluence, mcp-historic-comms | mcp-confluence, mcp-historic-comms |
| parcial | `ejecutivo/briefing-para-reuniones` | mcp-calendar, mcp-crm, mcp-drive, mcp-mail, mcp-news | mcp-calendar, mcp-crm, mcp-mail |
| parcial | `ejecutivo/gestion-de-calendario-y-comunicacion-operativa` | mcp-calendar, mcp-graph-send, mcp-mail, mcp-tasks | mcp-calendar, mcp-mail, mcp-tasks |
| parcial | `ejecutivo/lectura-critica-de-planes-y-propuestas` | mcp-benchmarks, mcp-bi, mcp-docs, mcp-review | mcp-bi |
| parcial | `ejecutivo/preparacion-de-comite` | mcp-bi, mcp-board-portal, mcp-distribute, mcp-sharepoint | mcp-board, mcp-board-portal, mcp-sharepoint |
| parcial | `ejecutivo/sintesis-de-informacion-estrategica` | mcp-brief, mcp-crm, mcp-drive, mcp-sharepoint | mcp-confluence, mcp-sharepoint |
| parcial | `finanzas/analisis-varianza-pl` | mcp-bi, mcp-budget, mcp-erp-post, mcp-sap, mcp-warehouse | mcp-bi, mcp-excel, mcp-fi, mcp-sap, mcp-warehouse |
| parcial | `finanzas/benchmarks-y-analisis-competitivo` | mcp-erp, mcp-market-data, mcp-report, mcp-web-fetch | mcp-bigquery, mcp-web-fetch, mcp-y-herramientas |
| parcial | `finanzas/borrador-de-informe-para-comite-o` | mcp-confluence, mcp-graph-files, mcp-sharepoint | mcp-confluence, mcp-graph-files |
| parcial | `finanzas/categorizacion-de-gastos-y-deteccion-de` | mcp-concur, mcp-coupa, mcp-erp, mcp-graph-files | mcp-concur, mcp-coupa, mcp-graph-files |
| parcial | `frontline/aprendizaje-y-formacion-continua` | mcp-kb, mcp-lms, mcp-progress | mcp-kb, mcp-lms |
| parcial | `frontline/asistente-puesto-banca` | mcp-account-action, mcp-core-banking, mcp-crm, mcp-policies | mcp-core-banking, mcp-crm, mcp-policies |
| parcial | `frontline/encontrar-la-respuesta-al-instante` | mcp-kb, mcp-policy, mcp-ticket | mcp-kb, mcp-manuales |
| parcial | `frontline/imagenes-y-fotos-del-servicio` | mcp-catalogo, mcp-dam, mcp-fieldservice | mcp-catalogo, mcp-dam |
| parcial | `frontline/notas-y-registro-de-la-atencion` | mcp-crm, mcp-ficha, mcp-registro, mcp-transcripcion | mcp-crm, mcp-transcripcion |
| parcial | `frontline/sugerencia-de-producto-o-servicio` | mcp-catalog, mcp-crm, mcp-reco | mcp-crm |
| parcial | `it-seguridad/analisis-de-phishing-y-malware-sospechoso` | mcp-defender-o365, mcp-misp, mcp-o365-quarantine, mcp-virustotal | mcp-defender-o365, mcp-misp, mcp-recorded-future, mcp-virustotal, mcp-web-fetch |
| parcial | `it-seguridad/asistente-del-equipo-de-grc-auditoria` | mcp-confluence, mcp-drata, mcp-grc, mcp-vanta | mcp-confluence, mcp-drata, mcp-graph-files, mcp-vanta |
| parcial | `it-seguridad/borrador-de-politicas-runbooks-y-procedimientos` | mcp-confluence, mcp-git-policies, mcp-graph-files, mcp-vanta | mcp-confluence, mcp-drata, mcp-graph-files, mcp-vanta |
| parcial | `it-seguridad/cumplimiento-nis2` | mcp-ens, mcp-eurlex, mcp-grc, mcp-plan | mcp-eurlex, mcp-grc, mcp-sentinel |
| parcial | `it-seguridad/gobierno-del-shadow-ai-en-la` | mcp-casb-enforce, mcp-defender-cloudapps, mcp-entra-id, mcp-netskope | mcp-concur, mcp-coupa, mcp-defender-cloudapps, mcp-entra-id, mcp-netskope, mcp-y-herramientas, mcp-zscaler |
| parcial | `it-seguridad/investigacion-de-incidente` | mcp-cmdb, mcp-crowdstrike-edr, mcp-sentinel, mcp-soar | mcp-aws-cloudtrail, mcp-azure-activity-log, mcp-crowdstrike-edr, mcp-entra-id, mcp-gcp-audit, mcp-sentinel |
| parcial | `it-seguridad/revision-de-configuraciones-e-iac` | mcp-aws-config, mcp-checkov, mcp-fix-pr, mcp-github | mcp-aws-config, mcp-azure-policy, mcp-github, mcp-prisma, mcp-wiz |
| parcial | `it-seguridad/triage-soc` | mcp-containment, mcp-edr, mcp-misp, mcp-sentinel, mcp-splunk, mcp-ti, mcp-virustotal | mcp-edr, mcp-misp, mcp-sentinel, mcp-splunk, mcp-virustotal |
| parcial | `legal/apoyo-en-discovery-e-investigaciones-internas` | mcp-graph-files, mcp-graph-mail, mcp-purview-chat, mcp-relativity | mcp-graph-files, mcp-graph-files-investigacion, mcp-relativity |
| parcial | `legal/apoyo-kyc-onboarding` | mcp-core, mcp-idv, mcp-registry, mcp-sanctions | mcp-comply, mcp-core, mcp-ocr, mcp-worldcheck |
| parcial | `legal/apoyo-regulatorio` | mcp-boe, mcp-eurlex, mcp-report, mcp-sharepoint | mcp-aepd, mcp-eurlex, mcp-sharepoint |
| parcial | `legal/due-diligence` | mcp-clm, mcp-dataroom, mcp-report, mcp-sharepoint | mcp-court, mcp-dataroom, mcp-ironclad |
| parcial | `legal/monitoring-regulatorio` | mcp-graph-files, mcp-sharepoint, mcp-vlex, mcp-web-fetch | mcp-aranzadi, mcp-graph-files, mcp-vlex, mcp-web-fetch |
| parcial | `legal/privacidad-y-dpias` | mcp-dpia-write, mcp-graph-files, mcp-onetrust, mcp-vlex | mcp-graph-files, mcp-onetrust, mcp-vlex |
| parcial | `legal/redaccion-de-politicas-internas` | mcp-confluence, mcp-graph-files, mcp-publish, mcp-vlex | mcp-aranzadi, mcp-confluence, mcp-graph-files, mcp-vlex |
| parcial | `legal/revision-contratos-redlining` | mcp-ironclad, mcp-redline, mcp-sharepoint, mcp-vlex | mcp-ironclad, mcp-sharepoint, mcp-vlex |
| parcial | `manager/analisis-de-dashboard-bi` | mcp-confluence, mcp-powerbi, mcp-snowflake, mcp-teams | mcp-bigquery, mcp-confluence, mcp-powerbi, mcp-snowflake |
| parcial | `manager/borrador-de-comunicacion-a-stakeholders` | mcp-brand-guide, mcp-graph-mail, mcp-graph-teams, mcp-sharepoint | mcp-graph-files, mcp-graph-mail, mcp-graph-teams |
| parcial | `manager/gestion-documental-proyecto` | mcp-jira, mcp-msproject, mcp-report, mcp-sharepoint | mcp-jira, mcp-msproject, mcp-sharepoint |
| parcial | `manager/lectura-critica-planes` | mcp-bi, mcp-drive, mcp-research, mcp-review | mcp-bi, mcp-research |
| parcial | `manager/memoria-personal-del-trabajo` | mcp-graph-files, mcp-graph-mail, mcp-graph-teams, mcp-jira, mcp-notes | mcp-confluence, mcp-graph-calendar, mcp-graph-files, mcp-graph-mail, mcp-graph-teams, mcp-jira, mcp-y-herramientas |
| parcial | `manager/notas-a-mano-digital-y-buscable` | mcp-graph-files, mcp-notion, mcp-notion-write | mcp-google-drive, mcp-graph-files, mcp-graph-onenote, mcp-obsidian |
| parcial | `manager/presentaciones-documentos-largos-e-imagenes` | mcp-deck, mcp-graph-files, mcp-mermaid, mcp-sharepoint | mcp-graph-files |
| parcial | `manager/priorizacion-del-backlog` | mcp-jira, mcp-notion, mcp-okr | mcp-graph-goals, mcp-jira, mcp-linear |
| parcial | `manager/reporte-semanal-de-equipo` | mcp-graph, mcp-jira, mcp-sharepoint | mcp-atlassian, mcp-graph, mcp-graph-calendar, mcp-graph-files, mcp-graph-teams |
| parcial | `manager/resumen-reuniones-acciones` | mcp-asana, mcp-calendar, mcp-teams | mcp-asana, mcp-jira, mcp-teams |
| parcial | `manager/triage-de-bandeja-email-chat` | mcp-graph-calendar, mcp-graph-mail, mcp-teams | mcp-gmail, mcp-graph-calendar, mcp-graph-mail, mcp-graph-teams |
| parcial | `marketing/analisis-de-campana-y-reporting` | mcp-ads, mcp-ga4, mcp-hubspot, mcp-slides | mcp-ga4, mcp-google-ads, mcp-hubspot, mcp-marketo, mcp-meta-ads, mcp-salesforce |
| parcial | `marketing/borrador-campana-guardarrailes` | mcp-brand, mcp-claims, mcp-cms, mcp-dam | mcp-cms, mcp-dam |
| parcial | `marketing/borrador-de-contenido-blog-post-landing` | mcp-brand-guide, mcp-cms, mcp-confluence | mcp-cms-wordpress, mcp-confluence, mcp-contentful, mcp-graph-files |
| parcial | `marketing/briefs-creativos-y-de-agencia` | mcp-agency, mcp-asana, mcp-brand-guide, mcp-graph-files | mcp-asana, mcp-graph-files, mcp-monday |
| parcial | `marketing/gestion-de-comunidad-y-social-listening` | mcp-brandwatch, mcp-social-publish, mcp-sprinklr, mcp-talkwalker | mcp-brandwatch, mcp-sprinklr, mcp-y-herramientas |
| parcial | `marketing/investigacion-de-audiencia-y-mensajes` | mcp-gong, mcp-graph-files, mcp-messaging, mcp-web-fetch | mcp-chorus, mcp-gong, mcp-graph-files, mcp-web-fetch |
| parcial | `marketing/seo-y-content-gap` | mcp-cms, mcp-search-console, mcp-web-fetch | mcp-ahrefs, mcp-ga4, mcp-search-console, mcp-semrush |
| parcial | `marketing/variantes-y-testing-a-b` | mcp-abtest, mcp-brand, mcp-google-ads, mcp-marketo | mcp-google-ads, mcp-hubspot, mcp-marketo, mcp-meta-ads |
| parcial | `operador/analisis-de-trazas-distributed-tracing` | mcp-loki, mcp-pagerduty, mcp-prometheus, mcp-tempo | mcp-datadog-apm, mcp-jaeger, mcp-slo-registry, mcp-tempo |
| parcial | `operador/busqueda-en-documentacion-y-agents-md` | mcp-confluence, mcp-context7, mcp-github, mcp-jira | mcp-confluence, mcp-context7, mcp-deepwiki, mcp-github |
| parcial | `operador/diagnostico-incidente-operacional` | mcp-k8s, mcp-logs, mcp-prometheus, mcp-remediate | mcp-datadog, mcp-kubernetes, mcp-pagerduty, mcp-prometheus |
| parcial | `operador/lectura-masiva-de-logs` | mcp-cloudwatch, mcp-elastic, mcp-loki, mcp-pagerduty | mcp-elastic, mcp-loki, mcp-redact, mcp-splunk |
| parcial | `operador/triage-de-alertas-e-incidentes` | mcp-alertmanager, mcp-cmdb, mcp-pagerduty, mcp-prometheus | mcp-datadog, mcp-kubernetes, mcp-pagerduty, mcp-prometheus |
| parcial | `rrhh/apoyo-en-evaluacion-del-desempeno` | mcp-graph-files, mcp-review-draft, mcp-workday | mcp-graph-files, mcp-workday |
| parcial | `rrhh/asistente-empleado-politicas` | mcp-hr-case, mcp-servicenow, mcp-sharepoint, mcp-workday | mcp-servicenow, mcp-sharepoint |
| parcial | `rrhh/borrador-de-comunicacion-interna` | mcp-confluence, mcp-graph-files, mcp-graph-mail | mcp-confluence, mcp-graph-files |
| parcial | `rrhh/cribado-de-candidatos-con-cuidado` | mcp-graph-files, mcp-greenhouse, mcp-shortlist | mcp-graph-files, mcp-greenhouse |
| parcial | `rrhh/documentacion-y-faq-del-empleado` | mcp-confluence, mcp-graph-files, mcp-hr-publish, mcp-servicenow-hrsd | mcp-confluence, mcp-graph-files, mcp-servicenow-hrsd, mcp-y-herramientas |
| parcial | `rrhh/people-analytics` | mcp-report, mcp-snowflake, mcp-visier, mcp-workday-prism | mcp-snowflake, mcp-visier, mcp-workday-prism |
| parcial | `rrhh/preparacion-de-entrevistas` | mcp-ats-guide, mcp-graph-files, mcp-greenhouse, mcp-workday | mcp-graph-files, mcp-greenhouse, mcp-workday-recruiting |
| parcial | `rrhh/resumen-de-encuestas-de-clima` | mcp-qualtrics, mcp-report, mcp-workday | mcp-graph-files, mcp-peakon, mcp-qualtrics |
| parcial | `rrhh/voz-empleado` | mcp-qualtrics, mcp-report, mcp-workday | mcp-qualtrics, mcp-workday |
| parcial | `soporte/atencion-cliente-plan` | mcp-account, mcp-billing, mcp-crm, mcp-offers | mcp-billing, mcp-crm, mcp-offers |
| parcial | `soporte/borrador-de-respuesta-personalizada` | mcp-crm, mcp-kb, mcp-zendesk, mcp-zendesk-reply | mcp-confluence, mcp-graph-mail, mcp-zendesk |
| parcial | `soporte/diagnostico-inicial-sobre-logs-y-trazas` | mcp-datadog, mcp-servicenow, mcp-splunk, mcp-zendesk | mcp-datadog, mcp-filesystem, mcp-loki, mcp-splunk |
| parcial | `soporte/kb-soporte` | mcp-confluence, mcp-kb, mcp-zendesk | mcp-confluence, mcp-zendesk |
| parcial | `soporte/knowledge-mining-generar-y-mantener-kb` | mcp-guru, mcp-kb, mcp-zendesk | mcp-confluence, mcp-guru, mcp-salesforce-sc, mcp-zendesk |
| parcial | `soporte/sugerencia-de-respuesta-a-partir-de` | mcp-confluence, mcp-crm, mcp-zendesk, mcp-zendesk-reply | mcp-confluence, mcp-guru, mcp-zendesk |
| parcial | `soporte/triage-de-ticket-entrante` | mcp-graph-files, mcp-salesforce-sc, mcp-zendesk, mcp-zendesk-route | mcp-graph-files, mcp-salesforce-sc, mcp-zendesk |
| parcial | `soporte/triage-tickets-soporte` | mcp-crm, mcp-kb, mcp-servicenow, mcp-zendesk | mcp-jira, mcp-servicenow, mcp-zendesk |
| parcial | `soporte/voz-del-cliente-y-analisis-de` | mcp-confluence, mcp-crm, mcp-qualtrics, mcp-zendesk | mcp-graph-files, mcp-medallia, mcp-qualtrics, mcp-y-herramientas, mcp-zendesk |
| parcial | `ventas/brief-comercial-pre-reunion` | mcp-crm-notes, mcp-gong, mcp-salesforce, mcp-webfetch | mcp-gong, mcp-mail, mcp-salesforce |
| parcial | `ventas/forecast-y-revision-de-pipeline` | mcp-crm-forecast, mcp-gong, mcp-salesforce, mcp-warehouse | mcp-gong, mcp-hubspot, mcp-salesforce |
| parcial | `ventas/investigacion-de-cuenta-antes-de-la` | mcp-linkedin, mcp-news, mcp-salesforce, mcp-web-fetch | mcp-apollo, mcp-salesforce, mcp-web-fetch, mcp-zoominfo |
| parcial | `ventas/limpieza-y-enriquecimiento-de-crm` | mcp-crm-writeback, mcp-salesforce, mcp-zoominfo | mcp-apollo, mcp-salesforce, mcp-y-herramientas, mcp-zoominfo |
| parcial | `ventas/preparacion-de-qbr-business-review` | mcp-gong, mcp-salesforce, mcp-slides, mcp-usage | mcp-jira-servicedesk, mcp-product-analytics, mcp-salesforce, mcp-zendesk |
| parcial | `ventas/respuesta-rfp` | mcp-confluence, mcp-loopio, mcp-rfp-submit, mcp-trust-center | mcp-confluence, mcp-loopio, mcp-trust-center |
| parcial | `ventas/talk-track-y-simulacion-de-objeciones` | mcp-battlecard, mcp-enablement, mcp-gong, mcp-salesforce | mcp-gong |
| alineado | `legal/lectura-dora-eba` | mcp-bde, mcp-eba, mcp-eurlex, mcp-grc | mcp-bde, mcp-eba, mcp-eurlex, mcp-grc, mcp-sharepoint |
| alineado | `operador/triage-incidencias-red` | mcp-elasticsearch, mcp-ne, mcp-netcool, mcp-snow | mcp-elasticsearch, mcp-ne, mcp-netcool, mcp-snow |
| alineado | `soporte/asistente-cara-al-cliente-chatbot-deflection` | mcp-confluence, mcp-salesforce-sc, mcp-zendesk | mcp-confluence, mcp-guru, mcp-salesforce-sc, mcp-zendesk |
| alineado | `ventas/borrador-de-correo-personalizado-de-seguimiento` | mcp-gong, mcp-graph-mail, mcp-salesforce | mcp-gong, mcp-graph-mail, mcp-salesforce |
| alineado | `ventas/resumen-y-next-steps-de-llamadas` | mcp-gong, mcp-salesforce | mcp-chorus, mcp-gong, mcp-graph-teams, mcp-salesforce |
