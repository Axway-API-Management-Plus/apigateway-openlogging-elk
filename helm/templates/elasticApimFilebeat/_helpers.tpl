{{- define "filebeat.fullname" -}}
{{ include "apim4elastic.fullname" . }}-filebeat
{{- end }}

{{- define "filebeat.name" -}}
{{ include "apim4elastic.name" . }}-filebeat
{{- end }}

{{/*
Common labels
*/}}
{{- define "filebeat.labels" -}}
helm.sh/chart: {{ include "apim4elastic.chart" . }}
{{ include "filebeat.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "filebeat.selectorLabels" -}}
app.kubernetes.io/component: filebeat
app.kubernetes.io/name: {{ include "apim4elastic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- range $key, $value := .Values.filebeat.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}

{{/*
Helper to decide if Filebeat secret should be generated
*/}}
{{- define "filebeat.generateSecret" -}}
{{- if and (eq .Values.filebeat.enabled true .Values.filebeat.filebeatSecrets.enabled true) }}
true
{{- else if .Values.filebeat.createFilebeatConfig }}
true
{{- else }}
false
{{- end }}
{{- end }}