{{- define "logstash.fullname" -}}
{{ include "apim4elastic.fullname" . }}-logstash
{{- end }}

{{- define "logstash.name" -}}
{{ include "apim4elastic.name" . }}-logstash
{{- end }}

{{/*
Common labels
*/}}
{{- define "logstash.labels" -}}
helm.sh/chart: {{ include "apim4elastic.chart" . }}
{{ include "logstash.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "logstash.selectorLabels" -}}
app.kubernetes.io/component: logstash
app.kubernetes.io/name: {{ include "apim4elastic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- range $key, $value := .Values.logstash.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}