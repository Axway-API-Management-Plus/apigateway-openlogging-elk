{{- define "elasticsearch.fullname" -}}
{{ include "apim4elastic.fullname" . }}-elasticsearch
{{- end }}

{{- define "elasticsearch.name" -}}
{{ include "apim4elastic.name" . }}-elasticsearch
{{- end }}

{{/*
Common labels
*/}}
{{- define "elasticsearch.label" -}}
helm.sh/chart: {{ include "apim4elastic.chart" . }}
{{ include "elasticsearch.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "elasticsearch.selectorLabels" -}}
app.kubernetes.io/component: logstash
app.kubernetes.io/name: {{ include "apim4elastic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- range $key, $value := .Values.elasticsearch.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}