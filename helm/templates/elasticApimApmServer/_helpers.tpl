{{- define "apmserver.fullname" -}}
{{ include "apim4elastic.fullname" . }}-apmserver
{{- end }}

{{- define "apmserver.name" -}}
{{ include "apim4elastic.name" . }}-apmserver
{{- end }}

{{/*
Common labels
*/}}
{{- define "apmserver.labels" -}}
helm.sh/chart: {{ include "apim4elastic.chart" . }}
{{ include "apmserver.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "apmserver.selectorLabels" -}}
app.kubernetes.io/component: apm-server
app.kubernetes.io/name: {{ include "apim4elastic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- range $key, $value := .Values.apmserver.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}