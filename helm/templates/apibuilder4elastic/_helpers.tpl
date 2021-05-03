{{- define "apibuilder4elastic.fullname" -}}
{{ include "apim4elastic.fullname" . }}-apibuilder4elastic
{{- end }}

{{- define "apibuilder4elastic.name" -}}
{{ include "apim4elastic.name" . }}-apibuilder4elastic
{{- end }}

{{/*
Common labels
*/}}
{{- define "apibuilder4elastic.labels" -}}
helm.sh/chart: {{ include "apim4elastic.chart" . }}
{{ include "apibuilder4elastic.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "apibuilder4elastic.selectorLabels" -}}
app.kubernetes.io/component: apibuilder4elastic
app.kubernetes.io/name: {{ include "apim4elastic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- range $key, $value := .Values.apibuilder4elastic.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}