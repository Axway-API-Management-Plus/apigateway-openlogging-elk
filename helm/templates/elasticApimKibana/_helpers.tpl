{{- define "kibana.fullname" -}}
{{ include "apim4elastic.fullname" . }}-kibana
{{- end }}

{{- define "kibana.name" -}}
{{ include "apim4elastic.name" . }}-kibana
{{- end }}

{{/*
Common labels
*/}}
{{- define "kibana.label" -}}
helm.sh/chart: {{ include "apim4elastic.chart" . }}
{{ include "kibana.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "kibana.selectorLabels" -}}
app.kubernetes.io/component: logstash
app.kubernetes.io/name: {{ include "apim4elastic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- range $key, $value := .Values.kibana.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}