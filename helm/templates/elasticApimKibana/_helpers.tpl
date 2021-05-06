{{- define "kibana.fullname" -}}
{{ include "apim4elastic.fullname" . }}-kibana
{{- end }}

{{- define "kibana.name" -}}
{{ include "apim4elastic.name" . }}-kibana
{{- end }}
